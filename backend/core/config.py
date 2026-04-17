import os
from dotenv import load_dotenv

# Load .env file at the project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

class Settings:
    PROJECT_NAME: str = "Review Intelligence Platform"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-jwt-replace-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
