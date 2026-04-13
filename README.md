# 🚀 Review Intelligence Platform

An enterprise-grade AI solution that transforms raw customer reviews into actionable insights using advanced Natural Language Processing (NLP).

## 🌟 What this project does (Simpler Terms)
Imagine you have thousands of customer reviews for your products. Reading them all is impossible. This tool does the heavy lifting for you:
1.  **Reads everything**: It automatically scans all reviews.
2.  **Understand Emotions**: It knows if a customer is "Happy", "Excited", "Frustrated", or "Angry".
3.  **Finds Details**: It identifies exactly what customers are talking about—like "Battery", "Price", or "Camera Quality".
4.  **Spots Fakes**: It calculates a "Fake Review Score" to help you find unreliable feedback.
5.  **Summarizes**: It generates a 1-sentence strategic summary of thousands of data points.

---

## 🏗️ How it works (The Tech Stack)

### 🧠 The Brain (Machine Learning)
- **Sentiment Engine**: Uses a trained Logistic Regression model to classify reviews.
- **NLP Pipeline**: Uses **TextBlob** and **RAKE** (Rapid Automatic Keyword Extraction) to find emotions and key product aspects.
- **Data Processor**: Converts raw text into a structured dataset (`dataset_processed.csv`).

### ⚙️ The Engine (Backend)
- **FastAPI**: A high-performance Python web framework.
- **REST API**: Provides endpoints for the frontend to fetch real-time analytics.
- **Intelligence Core**: Connects the ML models to the web interface.

### 🎨 The Face (Frontend)
- **React + Vite**: A lightning-fast modern web framework.
- **Tailwind CSS**: For a premium, dark-mode "Enterprise" aesthetic.
- **Framer Motion**: Smooth animations and transitions.
- **Lucide React**: Beautiful icons for professional data visualization.

---

## 🚀 Getting Started (The Easy Way)
I've created a one-click setup script.

1.  **Open the project folder** in your file explorer.
2.  **Double-click `start.bat`**.
3.  **Wait**: It will automatically:
    - Install Python & Node.js dependencies.
    - Download required AI data models (NLTK).
    - Create the dataset and train the initial AI model.
    - Launch both the **Backend** and **Frontend** in separate windows.
4.  **Enjoy**: Your browser will automatically open to `http://localhost:5173`.

---

## 📂 Project Structure
- `/frontend`: The user interface (React).
- `/backend`: The web server (FastAPI).
- `/ml`: The AI logic, data fetchers, and training scripts.
- `requirements.txt`: Python package list.
- `start.bat`: The all-in-one launcher.

---

## 🛠️ Manual Commands
If you prefer running things manually:

**Backend Setup:**
```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m ml.setup_data  # Generate Initial Data
python -m ml.train       # Train the Model
python -m uvicorn backend.main:app --port 8001 --reload
```

**Frontend Setup:**
```powershell
cd frontend
npm install
npm run dev
```
