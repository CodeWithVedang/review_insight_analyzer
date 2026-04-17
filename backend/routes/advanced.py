from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from backend.services.chat_service import chat_service
from backend.services.report_service import report_generator
from ml.real_world_scraper import real_world_scraper
import pandas as pd
import os
from pydantic import BaseModel
from typing import List, Optional
import json
import uuid

router = APIRouter(prefix="/advanced", tags=["Advanced Features"])

dataset_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'ml', 'dataset_processed.csv')

class ChatRequest(BaseModel):
    query: str

class ScrapeRequest(BaseModel):
    url: Optional[str] = None
    product_name: str
    category: Optional[str] = "general"

def load_data():
    try:
        return pd.read_csv(dataset_path)
    except:
        return pd.DataFrame()

@router.post("/chat")
def ai_chat(request: ChatRequest):
    df = load_data()
    response = chat_service.ask_data(request.query, df)
    return {"response": response}

@router.get("/report")
def download_report():
    df = load_data()
    if df.empty:
        raise HTTPException(status_code=404, detail="No data available for report")
    
    report_path = "review_insight_report.pdf"
    report_generator.generate_professional_report(df, report_path)
    
    return FileResponse(
        path=report_path,
        filename="Market_Intelligence_Report.pdf",
        media_type="application/pdf"
    )

@router.get("/compare")
def get_comparison(p1: str, p2: str):
    df = load_data()
    if df.empty:
        raise HTTPException(status_code=404, detail="Dataset empty")
    
    d1 = df[df['product_name'] == p1]
    d2 = df[df['product_name'] == p2]
    
    if d1.empty or d2.empty:
        return {"error": "One or both products not found in current dataset"}
        
    def get_stats(data):
        return {
            "avg_rating": round(data['rating'].mean(), 2),
            "sentiment": data['sentiment'].value_counts().to_dict(),
            "review_count": len(data),
            "top_aspects": ["Battery", "Performance", "Value"] # Simplified for comparison
        }
        
    return {
        "product_1": { "name": p1, "stats": get_stats(d1) },
        "product_2": { "name": p2, "stats": get_stats(d2) }
    }

@router.post("/scrape")
async def start_scrape(request: ScrapeRequest):
    """
    Scrapes LIVE real-world reviews from multiple sources.
    Fetches fresh data every time - no caching.
    Sources: Reddit, GitHub, HackerNews, Verified Databases
    """
    try:
        print(f"\n[BACKEND] Live Scrape Request - Product: {request.product_name}, Category: {request.category}")

        # Use real-world scraper to get FRESH data from multiple live sources
        reviews = real_world_scraper.get_live_reviews(
            request.product_name,
            request.category
        )

        if not reviews or len(reviews) == 0:
            return {
                "status": "failed",
                "message": f"Could not retrieve data for '{request.product_name}'. Please try again."
            }

    except Exception as e:
        print(f"[ERROR] Scraper Exception: {str(e)}")
        return {
            "status": "failed",
            "message": f"Scraping failed: {str(e)}"
        }

    # Run ML analysis on every scraped review
    from backend.services.ml_service import ml_service

    analyzed_reviews = []

    try:
        for r in reviews:
            # Run live ML engine on every newly scraped review
            analysis = ml_service.analyze_review(r['review_text'])

            entry = {
                "id": r.get('id', str(uuid.uuid4())),
                "product_name": request.product_name,
                "product_image": "",  # Empty - frontend will show "Image not available"
                "category": request.category,
                "brand": r.get('brand', "Live Source"),
                "reviewer_name": r.get('reviewer_name', "User"),
                "source": r.get('source', "Live Data"),
                "review_text": r['review_text'],
                "rating": int(r['rating']),
                "sentiment": analysis['sentiment'],
                "confidence": analysis['confidence'],
                "emotion": analysis['emotion'],
                "aspects": json.dumps(analysis['aspects']),
                "is_fake_score": analysis['is_fake_score']
            }
            analyzed_reviews.append(entry)

        if not analyzed_reviews:
            return {
                "status": "failed",
                "message": "No reviews could be processed."
            }

        # Save to dataset
        df_new = pd.DataFrame(analyzed_reviews)
        df_existing = load_data()

        if not df_existing.empty:
            df_final = pd.concat([df_existing, df_new], ignore_index=True)
        else:
            df_final = df_new

        df_final.to_csv(dataset_path, index=False)

        # Get unique sources
        sources = list(set([r.get('source', '') for r in reviews]))

        return {
            "status": "success",
            "reviews_added": len(analyzed_reviews),
            "product": request.product_name,
            "reviews": analyzed_reviews,
            "mode": "Live Real Data",
            "sources": sources,
            "timestamp": pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    except Exception as e:
        print(f"[ERROR] ML Analysis Exception: {str(e)}")
        return {
            "status": "failed",
            "message": f"ML analysis failed: {str(e)}"
        }
