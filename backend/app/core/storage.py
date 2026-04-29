import boto3
from app.core.config import settings

_client = None


def get_r2():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.r2_access_key_id,
            aws_secret_access_key=settings.r2_secret_access_key,
        )
    return _client


def upload(key: str, data: bytes, content_type: str = "application/octet-stream") -> str:
    get_r2().put_object(
        Bucket=settings.r2_bucket_name,
        Key=key,
        Body=data,
        ContentType=content_type,
    )
    return f"{settings.r2_public_url}/{key}"


def presign(key: str, expires: int = 172800) -> str:
    return get_r2().generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.r2_bucket_name, "Key": key},
        ExpiresIn=expires,
    )
