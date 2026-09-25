from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App Information
    APP_NAME: str = "RailVoya"
    BRAND_NAME: str = "RailVoya"
    INTENDED_DOMAIN: str = "railvoya.co.in"
    TAGLINE: str = "Every journey, made simpler."
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server Binding
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./railvoya.db"
    
    # Security & Auth
    SECRET_KEY: str = "railvoya-super-secret-dev-key-change-in-production-random-bytes"
    SESSION_COOKIE_NAME: str = "railvoya_session"
    SESSION_MAX_AGE_SECONDS: int = 60 * 60 * 24 * 30  # 30 days
    COOKIE_SECURE: bool = False  # Set to True when served over HTTPS
    COOKIE_SAMESITE: str = "lax"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # Provider Modes ("demo" or "live")
    RAILWAY_PROVIDER_MODE: str = "demo"
    PAYMENT_PROVIDER_MODE: str = "demo"
    
    # Live Railway Credentials (Required only for live mode)
    LIVE_RAILWAY_API_URL: str = ""
    LIVE_RAILWAY_API_KEY: str = ""
    LIVE_RAILWAY_PARTNER_CODE: str = ""
    
    # Live Payment Gateway Credentials (Required only for live mode)
    LIVE_PAYMENT_GATEWAY_URL: str = ""
    LIVE_PAYMENT_KEY_ID: str = ""
    LIVE_PAYMENT_KEY_SECRET: str = ""
    LIVE_PAYMENT_WEBHOOK_SECRET: str = ""

settings = Settings()
