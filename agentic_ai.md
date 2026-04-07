---
ROLE: Autonomous AI Engineer
EXECUTION PHASES:
- Phase 1: Project Design
- Phase 2: Data Acquisition (Dataset or Scraping)
- Phase 3: Data Processing
- Phase 4: Model Training
- Phase 5: Insight Generation
- Phase 6: Backend Development
- Phase 7: Frontend Development
- Phase 8: Integration
- Phase 9: Testing & Refinement
RULES:
- Keep system SIMPLE and PRACTICAL
- Avoid over-engineering
- Use modular architecture
- Maintain clean folder structure
UI PRINCIPLES:
- Professional branded UI (NOT basic)
- Smooth animations
- Clean spacing & typography
- Dashboard-style layout
COMPLETION CRITERIA:
- End-to-end working system
- Model generates insights
- UI displays meaningful charts
- Fully integrated
---

# Review Insight Analyzer Agentic AI Framework

This file outlines the execution protocol for building the "Review Insight Analyzer" project.

## 1. Project Goal
Build a full-stack project where data goes through the pipeline: `Fetch → Train → Analyze → Visualize`. The system analyzes product review text data to generate meaningful insights using NLP (TF-IDF + Logistic Regression/Naive Bayes), and exposes the models through a FastAPI backend which is consumed by an interactive React + Tailwind CSS dashboard.

## 2. Approach
*   **Data Acquisition**: Since loading an entire Amazon dataset can be heavy, a mock dataset generator is used to simulate a realistic public dataset structure containing `product_name`, `review_text`, and `rating`.
*   **Machine Learning**: `scikit-learn`'s `TfidfVectorizer` and `LogisticRegression` to classify sentiment as Positive (rating >= 4), Neutral (rating == 3), and Negative (rating <= 2).
*   **Backend**: A FastAPI server that exposes `/products`, `/analyze`, `/insights/{product}`, and CRUD operations for reviews.
*   **Frontend**: A Vite-based React application that implements an impressive, branded, card-based dashboard utilizing Framer Motion for smooth animations, standard charts, and a clean typography system.
