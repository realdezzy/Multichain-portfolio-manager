#!/usr/bin/python3
"""Base environment settings for portfolio server."""
from pathlib import Path
from fastapi.templating import Jinja2Templates
from pydantic import BaseSettings, EmailStr

BASE_PATH = Path(__file__).resolve().parent
TEMPLATES = Jinja2Templates(directory=str(BASE_PATH / "templates"))


class Settings(BaseSettings):
    """
    Base settings.
    This must be true for the app to run smothly.
    """
    
    PASSWORD: str
    DB_NAME: str
    DB_USER: str
    OAUTH_SECRET: str
    ACCESS_TOKEN_EXPIRY_WEEKS: int
    ALGORITHM: str
    X_CMC_PRO_API_KEY: str
    COINRANK_API_KEY: str
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr
    ENVIRONMENT: str

    class Config:
        """Environment variable file location."""

        env_file = "./.env"


settings = Settings()
