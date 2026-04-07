# 🚀 Review Insight Analyzer

A sophisticated AI/ML full-stack web application designed to automatically fetch and synthesize product reviews into deep, actionable insights using machine learning and NLP. The system features a responsive, glassmorphic React dashboard displaying macro metrics, product distributions, categorical sentiment mapping, and an interactive real-time AI Sandbox.

---

## 🔥 Key Features

1. **Intelligent Data Pipeline**: 
    - Simulates and parses reviews utilizing synthetic data generation covering metrics across `Electronics`, `Home Appliances`, `Office Workspace`, and `Smart Home`.
    - Automated creation of complex classification datasets consisting of product names, ratings, and contextual review summaries.

2. **Machine Learning NLP Core**:
    - Leverages **Scikit-Learn** (`TfidfVectorizer`) to parse raw review text into numerical embeddings.
    - Implements **Logistic Regression** trained algorithms to output precise sentiment evaluations (Positive ✨, Negative 🚩, Neutral ⚖️).

3. **Categorical Feature Grouping**: High-performance backend engine written in **FastAPI** mapping granular product sentiments down to a categorical organizational structure, extracting Top Loved interactions and critical Pain Points.

4. **Stunning Glassmorphic UI**: 
    - **React & Vite** powered lightning-fast HMR.
    - Designed sequentially using **Tailwind CSS v3** producing advanced Backdrop Blur effects, mesh gradients, and dark-theme focus.
    - Integrated with **Recharts.js** for animated, responsive charts and **Framer Motion** for spring-layout tab switching.
    - Includes a **Sentiment AI Sandbox Lab** testing custom input directly against the ML target endpoints.

---

## 🛠️ Architecture Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React Icons
- **Backend API**: Python, FastAPI, Uvicorn, Pydantic
- **Data & ML**: Python, Scikit-Learn, Pandas, NumPy, Pickle

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/) & `npm`
- [Python 3.9+](https://www.python.org/)

### 1. Backend & ML Initialization
In the root directory, create your virtual environment and resolve dependencies:

```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Dependencies
pip install -r requirements.txt

# Trigger Data Generation and train the ML Model (generates .pkl artifacts)
python ml/data_gen.py
python ml/train.py

# Boot the FastAPI Server
python -m uvicorn backend.main:app --port 8001
```

### 2. Frontend Development Server
Open a new terminal session matching the same root project directory:

```bash
cd frontend
npm install
npm run dev
```

The React dashboard will be accessible at **http://localhost:5174/** (or port 5173 depending on your local config).

---

## 🤝 Project Hierarchy Structure

```text
review_insight_analyzer/
│
├── agentic_ai.md            # Execution framework rules
├── requirements.txt         # Python dependencies
├── backend/
│   └── main.py              # FastAPI Routes & Logic
├── ml/
│   ├── data_gen.py          # Synthetic NLP dataset generator
│   └── train.py             # Feature Extraction & Logistic Regression 
└── frontend/
    ├── package.json
    ├── tailwind.config.js   
    ├── postcss.config.js    
    ├── src/
    │   ├── index.css        # Core Tailwind CSS / Mesh Gradients
    │   └── App.jsx          # Massive React Monolithic Dashboard
```
