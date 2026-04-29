from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/keys")
async def create_api_key():
    # TODO: generate blake2b-hashed key, store prefix+hash in Supabase, return full key once
    raise HTTPException(status_code=501, detail="Not implemented")


@router.delete("/keys/{key_id}")
async def revoke_api_key(key_id: str):
    # TODO: delete from Supabase
    raise HTTPException(status_code=501, detail="Not implemented")
