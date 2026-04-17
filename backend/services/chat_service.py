import google.generativeai as genai
import os
import pandas as pd
from backend.core.config import settings

class AIChatService:
    def __init__(self):
        # Fallback to a dummy response if no key is found, but logic is ready
        api_key = os.getenv("GEMINI_API_KEY", "")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def ask_data(self, query: str, context_df: pd.DataFrame):
        """
        Uses Gemini to answer questions about the review dataset.
        """
        if context_df.empty:
            return "The dataset is currently empty. Please upload or scrape reviews first."

        # Prepare a summarized context for the LLM
        summary = context_df.describe(include='all').to_string()
        # Top positive/negative reviews
        top_pos = context_df[context_df['sentiment'] == 'Positive'].head(3)['review_text'].tolist()
        top_neg = context_df[context_df['sentiment'] == 'Negative'].head(3)['review_text'].tolist()
        
        prompt = f"""
        You are an Expert Review Analyst. You are given a summary of customer reviews.
        
        Dataset Summary:
        {summary}
        
        Sample Positive Reviews:
        {top_pos}
        
        Sample Negative Reviews:
        {top_neg}
        
        User Query: "{query}"
        
        Answer professionally based ONLY on the data provided. If you don't know, suggest looking at specific product metrics.
        """
        
        if not self.model:
            return "AI Chat is offline. Please set GEMINI_API_KEY in your environment to enable real-time analysis."

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"

chat_service = AIChatService()
