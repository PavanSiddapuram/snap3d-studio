from upstash_redis import Redis
from app.core.config import settings

_redis: Redis | None = None


def get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis(
            url=settings.upstash_redis_rest_url,
            token=settings.upstash_redis_rest_token,
        )
    return _redis


STREAM_KEY = "snap3d:jobs"


def enqueue(job_id: str, payload: dict) -> None:
    get_redis().xadd(STREAM_KEY, {"job_id": job_id, **payload})
