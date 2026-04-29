from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import generate, tools, auth, billing
from app.core.config import settings

app = FastAPI(
    title="Snap3D API",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/v1")
app.include_router(tools.router, prefix="/v1/tools")
app.include_router(auth.router, prefix="/v1/auth")
app.include_router(billing.router, prefix="/v1/billing")


@app.get("/health")
async def health():
    return {"status": "ok"}
