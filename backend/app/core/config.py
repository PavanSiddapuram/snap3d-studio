from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    debug: bool = False
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Supabase
    supabase_url: str
    supabase_service_key: str

    # Cloudflare R2
    r2_account_id: str
    r2_access_key_id: str
    r2_secret_access_key: str
    r2_bucket_name: str = "snap3d-assets"
    r2_public_url: str

    # Upstash Redis
    upstash_redis_rest_url: str
    upstash_redis_rest_token: str

    # Modal
    modal_token_id: str = ""
    modal_token_secret: str = ""

    # Razorpay
    razorpay_key_id: str
    razorpay_key_secret: str
    razorpay_webhook_secret: str

    # Resend
    resend_api_key: str

    # Auth
    jwt_secret: str


settings = Settings()
