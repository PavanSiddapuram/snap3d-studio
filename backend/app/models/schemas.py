from pydantic import BaseModel, HttpUrl
from typing import Literal
from datetime import datetime


class JobCreate(BaseModel):
    job_type: Literal["image_to_3d", "text_to_3d", "pet", "face"] = "image_to_3d"
    resolution: Literal[512, 1024] = 1024
    poly_budget: Literal["low", "medium", "high"] = "medium"
    style_preset: Literal["realistic", "cartoon", "mechanical", "organic", "chibi"] | None = None
    prompt: str | None = None
    webhook_url: HttpUrl | None = None


class JobQueued(BaseModel):
    job_id: str
    status: str = "queued"
    eta_seconds: int
    credits_used: int
    poll_url: str
    stream_url: str


class MeshStats(BaseModel):
    vertices: int
    faces: int


class JobAssets(BaseModel):
    glb: str
    stl: str
    preview: str | None = None


class JobResult(BaseModel):
    job_id: str
    status: Literal["queued", "processing", "complete", "failed"]
    duration_s: float | None = None
    assets: JobAssets | None = None
    mesh: MeshStats | None = None
    error: str | None = None
    created_at: datetime | None = None
    completed_at: datetime | None = None
