import sys
import os

# Ensure project root is in path so `ml` package is always importable
_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _root not in sys.path:
    sys.path.insert(0, _root)

from ml.pipeline import analyze_text_advanced, generate_review_summary

class MLService:
    @staticmethod
    def analyze_review(review_text: str):
        return analyze_text_advanced(review_text)

    @staticmethod
    def generate_summary(reviews: list) -> str:
        return generate_review_summary(reviews)

ml_service = MLService()
