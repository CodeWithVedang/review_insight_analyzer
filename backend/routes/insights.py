from fastapi import APIRouter, HTTPException
from backend.models.schemas import InsightResponse
from backend.services.ml_service import ml_service
import pandas as pd
import os
from collections import Counter
import json

router = APIRouter(prefix="/insights", tags=["Insights"])

dataset_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'ml', 'dataset_processed.csv')

def load_data():
    try:
        return pd.read_csv(dataset_path)
    except:
        return pd.DataFrame()

@router.get("/overall", response_model=InsightResponse)
def get_overall_insights():
    df = load_data()
    if df.empty:
        raise HTTPException(status_code=500, detail="Data unavailable")
        
    # Real sentiment distribution
    sentiment_dist = df['sentiment'].value_counts().to_dict()
    total_reviews = len(df)
    
    # Real averages
    product_avg = df.groupby('product_name')['rating'].mean()
    most_pos_product = product_avg.idxmax() if not product_avg.empty else "None"
    most_neg_product = product_avg.idxmin() if not product_avg.empty else "None"
    
    pos_percent = round((sentiment_dist.get('Positive', 0) / total_reviews) * 100, 1) if total_reviews > 0 else 0
    neg_percent = round((sentiment_dist.get('Negative', 0) / total_reviews) * 100, 1) if total_reviews > 0 else 0

    # Calculate real keywords/aspects (Topics mentioned in reviews)
    common_aspects = ["battery", "price", "screen", "camera", "quality", "service", "delivery", "design", "performance"]
    aspect_counts = {}
    for aspect in common_aspects:
        count = df['review_text'].str.contains(aspect, case=False).sum()
        if count > 0:
            aspect_counts[aspect] = int(count)

    # Real emotion distribution from pre-calculated column
    if 'emotion' in df.columns:
        emotion_dist = df['emotion'].value_counts().to_dict()
    else:
        emotion_dist = {"satisfied": total_reviews} # fallback

    return {
        "total_reviews": total_reviews,
        "overall_sentiment": sentiment_dist,
        "most_positively_reviewed": most_pos_product,
        "most_negatively_reviewed": most_neg_product,
        "positive_percentage": pos_percent,
        "negative_percentage": neg_percent,
        "trending_keywords": aspect_counts,
        "emotion_distribution": emotion_dist
    }

@router.get("/summary")
def get_ai_summary():
    df = load_data()
    if df.empty:
        return {"ai_summary": "Syncing with intelligence core..."}
    
    # Process a representative sample for the summary
    sample = df.sample(min(50, len(df))).to_dict(orient='records')
    summary = ml_service.generate_summary(sample)
    return {"ai_summary": summary}
