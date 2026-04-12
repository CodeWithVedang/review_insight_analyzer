import os

class Settings:
    PROJECT_NAME: str = "Review Intelligence Platform"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-jwt-replace-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

settings = Settings()
