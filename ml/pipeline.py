import random
import re
from textblob import TextBlob
from rake_nltk import Rake
import nltk

# Ensure NLTK data is available
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

rake_processor = Rake()

def analyze_text_advanced(text: str):
    """
    Advanced analysis using TextBlob for sentiment and NLP heuristics for 
    emotion and aspect extraction.
    """
    if not text or len(text) < 3:
        return {
            "sentiment": "Neutral",
            "confidence": 1.0,
            "emotion": "neutral",
            "aspects": {},
            "is_fake_score": 0.0
        }

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # 1. Sentiment Mapping
    # Polarity is from -1 to 1. Using a threshold for Neutral.
    if polarity > 0.15:
        sentiment = "Positive"
    elif polarity < -0.15:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    # Translate polarity to confidence (0 to 1)
    conf = abs(polarity) if sentiment != "Neutral" else (1.0 - abs(polarity))
    # Normalize a bit for confidence feel
    conf = min(0.99, max(0.45, conf + 0.2))

    # 2. Emotion Mapping (Based on polarity and keyword nuance)
    emotion = "neutral"
    if sentiment == "Positive":
        if polarity > 0.6: emotion = "excited"
        elif subjectivity > 0.6: emotion = "happy"
        else: emotion = "satisfied"
    elif sentiment == "Negative":
        if polarity < -0.6: emotion = "angry"
        elif subjectivity > 0.6: emotion = "frustrated"
        else: emotion = "disappointed"
    else:
        if subjectivity > 0.5: emotion = "curious"
        else: emotion = "neutral"

    # 3. Enhanced Aspect Extraction
    aspects = {}
    keywords = ["battery", "price", "screen", "camera", "quality", "customer service", "delivery", "design", "shipping", "software"]
    
    # Analyze sentences for specific aspects
    for sentence in blob.sentences:
        sent_str = str(sentence).lower()
        sent_polarity = sentence.sentiment.polarity
        
        for kw in keywords:
            if kw in sent_str:
                # If the specific sentence about the aspect is positive/negative
                if sent_polarity > 0.1:
                    aspects[kw] = "Positive"
                elif sent_polarity < -0.1:
                    aspects[kw] = "Negative"
                else:
                    # Fallback to overall sentiment if sentence is neutral
                    aspects[kw] = sentiment

    # 4. Fake Review Score (Logic based on subjectivity and patterns)
    # High subjectivity + Extremely high/low polarity + Short length often indicates fake
    is_fake_score = 0.05
    if len(text) < 15: is_fake_score += 0.3
    if abs(polarity) > 0.9: is_fake_score += 0.3
    if text.isupper(): is_fake_score += 0.2
    
    # Cap it
    is_fake_score = min(0.99, is_fake_score)

    return {
        "sentiment": sentiment,
        "confidence": round(float(conf), 4),
        "emotion": emotion,
        "aspects": aspects,
        "is_fake_score": round(float(is_fake_score), 4)
    }

def generate_review_summary(reviews: list) -> str:
    """ Generates a summary by analyzing actual clusters. """
    if not reviews:
        return "No telemetry data found for summarization."
    
    total = len(reviews)
    pos_count = sum(1 for r in reviews if r.get('sentiment') == 'Positive')
    neg_count = sum(1 for r in reviews if r.get('sentiment') == 'Negative')
    
    # Extract all aspects mentioned
    all_aspects = []
    for r in reviews:
        if isinstance(r.get('aspects'), dict):
            all_aspects.extend(r['aspects'].keys())
    
    from collections import Counter
    top_aspects = [a for a, c in Counter(all_aspects).most_common(2)]
    
    summary = f"Synthesizing data from {total} reviews. "
    
    if pos_count / total > 0.7:
        summary += "Overwhelmingly positive reception. "
    elif neg_count / total > 0.4:
        summary += "Critical consensus suggests significant friction points. "
    else:
        summary += "The overall sentiment is cautiously balanced. "
        
    if top_aspects:
        summary += f"Core discussions revolve around {', '.join(top_aspects)}. "
        
    return summary
