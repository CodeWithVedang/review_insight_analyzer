from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ReviewInput(BaseModel):
    product_name: str
    review_text: str
    rating: int

class ReviewResponse(BaseModel):
    id: str
    product_name: str
    product_image: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    review_text: str
    rating: int
    sentiment: str
    source: Optional[str] = "Unknown"
    confidence: float
    emotion: str
    aspects: Dict[str, Any]
    is_fake_score: float

class InsightResponse(BaseModel):
    total_reviews: int
    overall_sentiment: dict
    most_positively_reviewed: str
    most_negatively_reviewed: str
    positive_percentage: float
    negative_percentage: float
    trending_keywords: dict
    emotion_distribution: dict

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
