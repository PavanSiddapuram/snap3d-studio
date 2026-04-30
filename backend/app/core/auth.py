from datetime import datetime, timezone
from hashlib import blake2b

from fastapi import Header, HTTPException

from app.core.supabase import get_db


async def get_current_user_id(
    authorization: str | None = Header(default=None),
    x_snap3d_key: str | None = Header(default=None, alias="X-Snap3D-Key"),
) -> str:
    db = get_db()

    if x_snap3d_key:
        key_hash = blake2b(x_snap3d_key.encode(), digest_size=32).hexdigest()
        row = db.table("api_keys").select("user_id").eq("key_hash", key_hash).single().execute()
        if not row.data:
            raise HTTPException(status_code=401, detail="Invalid API key")
        db.table("api_keys").update(
            {"last_used": datetime.now(timezone.utc).isoformat()}
        ).eq("key_hash", key_hash).execute()
        return row.data["user_id"]

    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
        try:
            response = db.auth.get_user(token)
            return response.user.id
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    raise HTTPException(status_code=401, detail="Authentication required")
