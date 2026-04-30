import asyncio
import json
import time
import uuid
from datetime import datetime, timezone
from typing import AsyncGenerator

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.core.auth import get_current_user_id
from app.core.config import settings
from app.core.storage import presign, upload
from app.core.supabase import get_db
from app.models.schemas import JobAssets, JobQueued, JobResult, MeshStats
from app.workers.preprocess import remove_background_and_resize

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB

# job_id → list of asyncio.Queue for SSE fan-out
_sse_listeners: dict[str, list[asyncio.Queue]] = {}


def _push(job_id: str, event: dict) -> None:
    for q in _sse_listeners.get(job_id, []):
        q.put_nowait(event)


def _credits_for(resolution: int) -> int:
    return 1 if resolution == 512 else 2


# ── POST /v1/generate ────────────────────────────────────────────────────────

@router.post("/generate", response_model=JobQueued, status_code=202)
async def create_job(
    background_tasks: BackgroundTasks,
    image: UploadFile | None = None,
    job_type: str = Form("image_to_3d"),
    resolution: int = Form(1024),
    poly_budget: str = Form("medium"),
    style_preset: str | None = Form(None),
    prompt: str | None = Form(None),
    webhook_url: str | None = Form(None),
    user_id: str = Depends(get_current_user_id),
):
    db = get_db()
    credits_needed = _credits_for(resolution)

    # Validate inputs
    if job_type in ("image_to_3d", "pet", "face"):
        if image is None:
            raise HTTPException(400, "image file required for this job type")
        if image.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(400, f"unsupported image type: {image.content_type}")
        image_bytes = await image.read()
        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(413, "image exceeds 10 MB limit")
        content_type = image.content_type or "image/jpeg"
    elif job_type == "text_to_3d":
        if not prompt:
            raise HTTPException(400, "prompt required for text_to_3d")
        image_bytes = b""
        content_type = "text/plain"
    else:
        raise HTTPException(400, f"unknown job_type: {job_type}")

    # Atomic credit deduction — service key bypasses RLS intentionally
    profile = db.table("profiles").select("credits").eq("id", user_id).single().execute()
    if not profile.data:
        raise HTTPException(404, "user profile not found — contact support")
    if profile.data["credits"] < credits_needed:
        raise HTTPException(
            402,
            f"insufficient credits: have {profile.data['credits']}, need {credits_needed}",
        )
    updated = (
        db.table("profiles")
        .update({"credits": profile.data["credits"] - credits_needed})
        .eq("id", user_id)
        .gte("credits", credits_needed)  # guard against concurrent deduction
        .execute()
    )
    if not updated.data:
        raise HTTPException(402, "insufficient credits (concurrent conflict — please retry)")

    # Upload raw input to R2
    job_id = str(uuid.uuid4())
    input_key = f"assets/{job_id}/input_raw"
    upload(input_key, image_bytes if image_bytes else (prompt or "").encode(), content_type)

    # Insert job record
    db.table("jobs").insert({
        "id": job_id,
        "user_id": user_id,
        "job_type": job_type,
        "status": "queued",
        "resolution": resolution,
        "poly_budget": poly_budget,
        "style_preset": style_preset,
        "input_r2_key": input_key,
        "credits_used": credits_needed,
    }).execute()

    # Append credit audit event
    db.table("credit_events").insert({
        "user_id": user_id,
        "delta": -credits_needed,
        "reason": "job_deduct",
        "ref_id": job_id,
    }).execute()

    background_tasks.add_task(
        _run_inference,
        job_id=job_id,
        image_bytes=image_bytes,
        job_type=job_type,
        resolution=resolution,
        poly_budget=poly_budget,
        prompt=prompt,
        webhook_url=webhook_url,
    )

    eta = 25 if resolution == 512 else 50
    base = settings.api_base_url
    return JobQueued(
        job_id=job_id,
        status="queued",
        eta_seconds=eta,
        credits_used=credits_needed,
        poll_url=f"{base}/v1/jobs/{job_id}",
        stream_url=f"{base}/v1/jobs/{job_id}/stream",
    )


# ── Background inference task ─────────────────────────────────────────────────

async def _run_inference(
    *,
    job_id: str,
    image_bytes: bytes,
    job_type: str,
    resolution: int,
    poly_budget: str,
    prompt: str | None,
    webhook_url: str | None,
) -> None:
    # Import here so the module loads fine even without a Modal token during dev
    from modal_inference import generate_3d  # type: ignore[import]

    db = get_db()
    t0 = time.time()

    def _set_status(status: str, **extra):
        db.table("jobs").update({"status": status, **extra}).eq("id", job_id).execute()

    try:
        _set_status("processing")
        _push(job_id, {"status": "processing", "progress": 5, "stage": "Starting"})

        # Preprocess image — rembg bg removal + center-pad
        if image_bytes:
            _push(job_id, {"status": "processing", "progress": 15, "stage": "Removing background"})
            preprocessed = remove_background_and_resize(image_bytes)
            prep_key = f"assets/{job_id}/input_processed.png"
            upload(prep_key, preprocessed, "image/png")
        else:
            preprocessed = b""

        _push(job_id, {"status": "processing", "progress": 30, "stage": "Generating 3D model"})

        result = await generate_3d.remote.aio(
            preprocessed or image_bytes,
            resolution=resolution,
            poly_budget=poly_budget,
        )

        _push(job_id, {"status": "processing", "progress": 85, "stage": "Uploading assets"})

        glb_key = f"assets/{job_id}/model.glb"
        upload(glb_key, result["glb_bytes"], "model/gltf-binary")

        duration_ms = int((time.time() - t0) * 1000)
        _set_status(
            "complete",
            glb_r2_key=glb_key,
            stl_r2_key=glb_key,  # GLB served for both; STL export is a future improvement
            duration_ms=duration_ms,
            mesh_vertices=result["vertices"],
            mesh_faces=result["triangles"],
            completed_at=datetime.now(timezone.utc).isoformat(),
        )

        _push(job_id, {"status": "complete", "progress": 100, "job_id": job_id})

        if webhook_url:
            await _fire_webhook(webhook_url, job_id)

    except Exception as exc:
        _set_status("failed", error_msg=str(exc)[:500])
        _push(job_id, {"status": "failed", "progress": 0, "error": str(exc)[:200]})


async def _fire_webhook(url: str, job_id: str) -> None:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(url, json={"job_id": job_id, "status": "complete"})
    except Exception:
        pass  # webhook delivery is best-effort


# ── GET /v1/jobs/{job_id} ─────────────────────────────────────────────────────

@router.get("/jobs/{job_id}", response_model=JobResult)
async def get_job(job_id: str, user_id: str = Depends(get_current_user_id)):
    db = get_db()
    row = (
        db.table("jobs")
        .select("*")
        .eq("id", job_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not row.data:
        raise HTTPException(404, "job not found")
    return _job_row_to_result(row.data)


def _job_row_to_result(j: dict) -> JobResult:
    assets = None
    if j.get("glb_r2_key"):
        assets = JobAssets(
            glb=presign(j["glb_r2_key"]),
            stl=presign(j.get("stl_r2_key") or j["glb_r2_key"]),
            preview=None,
        )
    mesh = None
    if j.get("mesh_vertices") is not None:
        mesh = MeshStats(vertices=j["mesh_vertices"], faces=j["mesh_faces"])
    return JobResult(
        job_id=j["id"],
        status=j["status"],
        duration_s=j["duration_ms"] / 1000 if j.get("duration_ms") else None,
        assets=assets,
        mesh=mesh,
        error=j.get("error_msg"),
        created_at=j.get("created_at"),
        completed_at=j.get("completed_at"),
    )


# ── GET /v1/jobs/{job_id}/stream (SSE) ───────────────────────────────────────

@router.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str, user_id: str = Depends(get_current_user_id)):
    db = get_db()
    row = (
        db.table("jobs")
        .select("status")
        .eq("id", job_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not row.data:
        raise HTTPException(404, "job not found")

    # If already terminal, return one event and close immediately
    if row.data["status"] in ("complete", "failed"):
        status = row.data["status"]

        async def _immediate() -> AsyncGenerator[str, None]:
            yield f"data: {json.dumps({'status': status, 'progress': 100})}\n\n"

        return StreamingResponse(_immediate(), media_type="text/event-stream")

    q: asyncio.Queue = asyncio.Queue()
    _sse_listeners.setdefault(job_id, []).append(q)

    async def _generate() -> AsyncGenerator[str, None]:
        try:
            while True:
                try:
                    event = await asyncio.wait_for(q.get(), timeout=30)
                    yield f"data: {json.dumps(event)}\n\n"
                    if event.get("status") in ("complete", "failed"):
                        break
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"  # SSE comment prevents proxy timeouts
        finally:
            listeners = _sse_listeners.get(job_id, [])
            if q in listeners:
                listeners.remove(q)
            if not listeners:
                _sse_listeners.pop(job_id, None)

    return StreamingResponse(_generate(), media_type="text/event-stream")


# ── GET /v1/jobs ──────────────────────────────────────────────────────────────

@router.get("/jobs")
async def list_jobs(user_id: str = Depends(get_current_user_id)):
    db = get_db()
    rows = (
        db.table("jobs")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return [_job_row_to_result(j) for j in rows.data]
