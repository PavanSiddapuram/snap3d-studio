from fastapi import APIRouter, UploadFile, BackgroundTasks, HTTPException, Depends
from app.models.schemas import JobCreate, JobQueued, JobResult
from app.core.supabase import get_db

router = APIRouter()


@router.post("/generate", response_model=JobQueued, status_code=202)
async def create_job(
    image: UploadFile | None = None,
    params: JobCreate = Depends(),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    # TODO: validate JWT / API key, check credits, preprocess, enqueue
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/jobs/{job_id}", response_model=JobResult)
async def get_job(job_id: str):
    # TODO: fetch from Supabase, return presigned URLs
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str):
    # TODO: SSE stream for job progress
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/jobs")
async def list_jobs():
    # TODO: return last 50 jobs for authenticated user
    raise HTTPException(status_code=501, detail="Not implemented")
