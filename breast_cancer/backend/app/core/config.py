from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Updated for SQLite
    DATABASE_URL:                str = "sqlite+aiosqlite:///./breast_cancer.db"
    SECRET_KEY:                  str = "dev-secret-change-in-production"
    ALGORITHM:                   str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    # ML_MODEL_PATH:               str = "../ml/models/pipeline.joblib"

    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()