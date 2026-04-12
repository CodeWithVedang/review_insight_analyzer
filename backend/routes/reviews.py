from fastapi import APIRouter, HTTPException
from typing import List
from backend.models.schemas import ReviewInput, ReviewResponse
from backend.services.ml_service import ml_service
import uuid
import pandas as pd
import os

router = APIRouter(prefix="/reviews", tags=["Reviews"])

dataset_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'ml', 'dataset_processed.csv'
)

# Load dataset at startup
try:
    _df = pd.read_csv(dataset_path)
    if 'id' not in _df.columns:
        _df['id'] = [str(uuid.uuid4()) for _ in range(len(_df))]
except Exception as e:
    print(f"[WARN] Could not load dataset: {e}")
    _df = pd.DataFrame()

# Mutable global proxy
df = _df.copy() if not _df.empty else pd.DataFrame()


@router.get("/", response_model=List[ReviewResponse])
def get_all_reviews():
    if df.empty:
        return []

    records = df.to_dict(orient='records')[:250]
    results = []
    for r in records:
        analysis = ml_service.analyze_review(r.get('review_text', ''))
        results.append({
            "id": r.get('id', str(uuid.uuid4())),
            "product_name": r.get('product_name', 'Unknown'),
            "product_image": r.get('product_image', ''),
            "category": r.get('category', 'General'),
            "brand": r.get('brand', 'Unknown'),
            "review_text": r.get('review_text', ''),
            "rating": int(r.get('rating', 3)),
            "sentiment": analysis['sentiment'],
            "source": r.get('source', 'Synthesized'),
            "confidence": analysis['confidence'],
            "emotion": analysis['emotion'],
            "aspects": analysis['aspects'],
            "is_fake_score": analysis['is_fake_score'],
        })
    return results


@router.post("/", response_model=ReviewResponse)
def add_review(review: ReviewInput):
    global df
    analysis = ml_service.analyze_review(review.review_text)
    new_id = str(uuid.uuid4())
    new_row = {
        "id": new_id,
        "product_name": review.product_name,
        "review_text": review.review_text,
        "rating": review.rating,
        "sentiment": analysis['sentiment'],
    }
    new_df = pd.DataFrame([new_row])
    df = new_df if df.empty else pd.concat([df, new_df], ignore_index=True)

    return {
        "id": new_id,
        "product_name": review.product_name,
        "review_text": review.review_text,
        "rating": review.rating,
        "sentiment": analysis['sentiment'],
        "confidence": analysis['confidence'],
        "emotion": analysis['emotion'],
        "aspects": analysis['aspects'],
        "is_fake_score": analysis['is_fake_score'],
    }


@router.delete("/{review_id}")
def delete_review(review_id: str):
    global df
    initial_len = len(df)
    df = df[df['id'] != review_id]
    if len(df) == initial_len:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}


@router.post("/bulk-analyze")
def bulk_analyze(reviews: List[ReviewInput]):
    """Full analysis on a batch of reviews — returns all ML fields."""
    results = []
    for r in reviews:
        analysis = ml_service.analyze_review(r.review_text)
        results.append({
            "product_name": r.product_name,
            "review_text": r.review_text,
            "rating": r.rating,
            "sentiment": analysis['sentiment'],
            "confidence": analysis['confidence'],
            "emotion": analysis['emotion'],
            "aspects": analysis['aspects'],
            "is_fake_score": analysis['is_fake_score'],
        })
    return {"status": "success", "analyzed_count": len(results), "results": results}
