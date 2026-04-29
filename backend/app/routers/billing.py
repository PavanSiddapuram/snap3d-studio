from fastapi import APIRouter, Request, HTTPException, Header
import hmac, hashlib
from app.core.config import settings

router = APIRouter()


@router.post("/razorpay-webhook")
async def razorpay_webhook(request: Request, x_razorpay_signature: str = Header(...)):
    body = await request.body()
    expected = hmac.new(
        settings.razorpay_webhook_secret.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(expected, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    # TODO: handle subscription.activated, payment.captured, subscription.cancelled
    return {"status": "ok"}
