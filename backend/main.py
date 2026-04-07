from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
from collections import Counter
import uuid

app = FastAPI(title="Review Insight Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
model_path = os.path.join(ml_dir, 'model.pkl')
vec_path = os.path.join(ml_dir, 'vectorizer.pkl')
dataset_path = os.path.join(ml_dir, 'dataset_processed.csv')

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    with open(vec_path, 'rb') as f:
        vectorizer = pickle.load(f)
    df = pd.read_csv(dataset_path)
    if 'id' not in df.columns:
        df['id'] = [str(uuid.uuid4()) for _ in range(len(df))]
except Exception as e:
    print("Error loading ML artifacts.", e)
    model, vectorizer, df = None, None, pd.DataFrame()

class ReviewInput(BaseModel):
    product_name: str
    review_text: str
    rating: int

@app.get("/products")
def get_products():
    if df.empty:
        return {"products": [], "categories": {}}
    
    category_products = {}
    if 'category' in df.columns:
        for _, row in df[['category', 'product_name']].drop_duplicates().iterrows():
            cat = row['category']
            prod = row['product_name']
            if pd.isna(cat):
                cat = "Uncategorized"
            if cat not in category_products:
                category_products[cat] = []
            if prod not in category_products[cat]:
                category_products[cat].append(prod)
    else:
        category_products["All"] = df['product_name'].unique().tolist()
        
    return {
        "products": df['product_name'].unique().tolist(),
        "categories": category_products
    }

@app.post("/analyze")
def analyze_text(text: dict):
    if not model or not vectorizer:
        raise HTTPException(status_code=500, detail="Model uninitialized")
    review = text.get("review_text", "")
    processed = review.lower()
    vec = vectorizer.transform([processed])
    prediction = model.predict(vec)[0]
    return {"review_text": review, "sentiment_prediction": prediction}

@app.get("/insights/overall/summary")
def get_overall_insights():
    if df.empty:
        raise HTTPException(status_code=500, detail="Data unavailable")
    
    sentiment_dist = df['sentiment'].value_counts().to_dict()
    total_reviews = len(df)
    
    product_avg = df.groupby('product_name')['rating'].mean()
    most_pos_product = product_avg.idxmax()
    most_neg_product = product_avg.idxmin()
    pos_percent = round((sentiment_dist.get('Positive', 0) / total_reviews) * 100, 1)
    neg_percent = round((sentiment_dist.get('Negative', 0) / total_reviews) * 100, 1)
    
    return {
        "total_reviews": total_reviews,
        "overall_sentiment": sentiment_dist,
        "most_positively_reviewed": most_pos_product,
        "most_negatively_reviewed": most_neg_product,
        "positive_percentage": pos_percent,
        "negative_percentage": neg_percent,
        "product_averages": product_avg.to_dict()
    }

@app.get("/insights/{product}")
def get_product_insights(product: str):
    if df.empty:
        raise HTTPException(status_code=500, detail="Data unavailable")
    product_df = df[df['product_name'] == product]
    if product_df.empty:
        raise HTTPException(status_code=404, detail="Product not found")
        
    sentiments = product_df['sentiment'].value_counts().to_dict()
    total_reviews = len(product_df)
    
    pos_reviews = product_df[product_df['sentiment'] == 'Positive']['review_text'].str.cat(sep=' ')
    neg_reviews = product_df[product_df['sentiment'] == 'Negative']['review_text'].str.cat(sep=' ')
    
    def get_top_words(text, n=5):
        words = str(text).split()
        return dict(Counter(words).most_common(n))
        
    top_features = get_top_words(pos_reviews)
    top_complaints = get_top_words(neg_reviews)
    
    return {
        "product_name": product,
        "total_reviews": total_reviews,
        "sentiment_distribution": sentiments,
        "top_features": top_features,
        "top_complaints": top_complaints,
        "average_rating": round(product_df['rating'].mean(), 2)
    }

@app.get("/reviews")
def get_reviews():
    return {"reviews": df.to_dict(orient='records')[:100]}

@app.post("/reviews")
def add_review(review: ReviewInput):
    global df
    new_row = {
        "id": str(uuid.uuid4()),
        "product_name": review.product_name,
        "review_text": review.review_text,
        "rating": review.rating
    }
    new_row['sentiment'] = "Positive" if review.rating >= 4 else "Negative" if review.rating <= 2 else "Neutral"
    new_df = pd.DataFrame([new_row])
    if df.empty:
        df = new_df
    else:
        df = pd.concat([df, new_df], ignore_index=True)
    return {"message": "Review added"}

@app.delete("/reviews/{id}")
def delete_review(id: str):
    global df
    df = df[df['id'] != id]
    return {"message": "Review deleted"}

@app.put("/reviews/{id}")
def update_review(id: str, review: ReviewInput):
    global df
    idx = df[df['id'] == id].index
    if not idx.empty:
        df.loc[idx[0], 'product_name'] = review.product_name
        df.loc[idx[0], 'review_text'] = review.review_text
        df.loc[idx[0], 'rating'] = review.rating
        df.loc[idx[0], 'sentiment'] = "Positive" if review.rating >= 4 else "Negative" if review.rating <= 2 else "Neutral"
        return {"message": "Review updated"}
    raise HTTPException(status_code=404, detail="Review not found")
