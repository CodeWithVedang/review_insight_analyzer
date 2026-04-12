import sys
import os

# Ensure project root is always on the path
_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _root not in sys.path:
    sys.path.insert(0, _root)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import reviews, insights
from backend.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise API for Review Intelligence Platform",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router)
app.include_router(insights.router)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "2.0.0",
        "ml_engine": "TextBlob + NLP Heuristics"
    }


@app.get("/health")
def health():
    return {"status": "ok"}
