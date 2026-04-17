from fpdf import FPDF
import pandas as pd
import os
from datetime import datetime

class ReportGenerator:
    def generate_professional_report(self, df: pd.DataFrame, output_path: str):
        """
        Generates a sleek, professional PDF report of the insights.
        """
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_fill_color(31, 41, 55) # Dark slate
        pdf.rect(0, 0, 210, 40, 'F')
        
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 20, "REVIEW INTELLIGENCE REPORT", ln=True, align='C')
        
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 10, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}", ln=True, align='C')
        
        pdf.ln(20)
        pdf.set_text_color(0, 0, 0)
        
        # summary Section
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "1. Executive Summary", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)
        
        total_reviews = len(df)
        pos_reviews = len(df[df['sentiment'] == 'Positive'])
        neg_reviews = len(df[df['sentiment'] == 'Negative'])
        avg_rating = df['rating'].mean()
        
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(0, 10, f"Total Reviews Analyzed: {total_reviews}", ln=True)
        pdf.cell(0, 10, f"Overall Positive Sentiment: {round((pos_reviews/total_reviews)*100, 1)}%", ln=True)
        pdf.cell(0, 10, f"Overall Negative Sentiment: {round((neg_reviews/total_reviews)*100, 1)}%", ln=True)
        pdf.cell(0, 10, f"Average Customer Rating: {round(avg_rating, 2)} / 5.0", ln=True)
        
        pdf.ln(10)
        
        # Product Breakdown
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "2. Detailed Insights", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)
        
        # Get top 5 products by rating
        top_products = df.groupby('product_name')['rating'].mean().sort_values(ascending=False).head(5)
        
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 10, "Top Rated Products:", ln=True)
        pdf.set_font("Helvetica", "", 11)
        for prod, rating in top_products.items():
            pdf.cell(0, 8, f"- {prod}: {round(rating, 2)} stars", ln=True)
            
        pdf.ln(10)
        
        # Critical Reviews
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "3. Critical Issues To Address", ln=True)
        pdf.set_font("Helvetica", "I", 10)
        
        critical_reviews = df[df['sentiment'] == 'Negative'].head(3)['review_text'].tolist()
        for i, rev in enumerate(critical_reviews):
            pdf.multi_cell(0, 8, f"{i+1}. \"{rev[:200]}...\"", border=0)
            pdf.ln(2)

        # Footer
        pdf.set_y(-15)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 10, "Confidential - Review Insight Analyzer AI Platform", align='C')
        
        pdf.output(output_path)
        return output_path

report_generator = ReportGenerator()
