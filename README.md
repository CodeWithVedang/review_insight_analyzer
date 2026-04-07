# Review Insight Analyzer

A sophisticated AI/ML full-stack web application that fetches product reviews, trains a model to predict sentiment, analyzes review text, and visualizes insights on a professional React dashboard.

## Approach
1. **Machine Learning Pipeline**: A Logistic Regression model coupled with a TF-IDF vectorizer trained on simulated review data.
2. **Backend Services**: A FastAPI server that handles NLP, generation of insights (top complaints, liked features, average sentiments), and routing. 
3. **Frontend Application**: A Vite React application stylized with Tailwind CSS, Recharts for dynamic visual rendering, Framer Motion for liquid-smooth animations, and Lucide React icons.

## Installation & Setup

1. **Prerequisites**
   - Node.js & npm
   - Python 3.9+

2. **Project Initialization**
   This workspace contains everything you need. Open a terminal and run the backend setup:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   
   # Triggers model generation and training script
   python ml/train.py
   ```

3. **Running the FastAPI Backend**
   ```bash
   .\venv\Scripts\python.exe -m uvicorn backend.main:app --port 8001
   ```

4. **Running the React Frontend**
   Open a new terminal session, then run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be accessible at `http://localhost:5174/`.
