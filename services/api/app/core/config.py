"""Application settings, loaded from environment variables (and an optional .env file).

Secrets never live in code. Every value here has a safe local-development default
except credentials, which must come from the environment.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "MoneyMentor API"
    app_version: str = "0.1.0"
    environment: Literal["development", "test", "production"] = "development"

    # psycopg 3 driver. The default points at the Docker Compose database in infra/.
    database_url: str = (
        "postgresql+psycopg://moneymentor:moneymentor_dev@localhost:5433/moneymentor"
    )
    db_connect_timeout_seconds: int = Field(default=3, ge=1, le=30)

    # Comma-separated list of browser origins allowed to call the API.
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
