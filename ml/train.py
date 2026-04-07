import pandas as pd
import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from data_gen import generate_mock_data

def get_sentiment(rating):
    if rating >= 4:
        return "Positive"
    elif rating <= 2:
        return "Negative"
    return "Neutral"

def train_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "dataset.csv")
    
    if not os.path.exists(dataset_path):
        generate_mock_data()
        
    df = pd.DataFrame(pd.read_csv(dataset_path))
    
    # Process text
    df['review_text'] = df['review_text'].str.lower().str.replace(r'[^\w\s]', '', regex=True)
    df['sentiment'] = df['rating'].apply(get_sentiment)
    
    X = df['review_text']
    y = df['sentiment']
    
    # Needs to be simple as requested
    vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
    X_vec = vectorizer.fit_transform(X)
    
    model = LogisticRegression(max_iter=1000)
    model.fit(X_vec, y)
    
    with open(os.path.join(current_dir, "model.pkl"), 'wb') as f:
        pickle.dump(model, f)
        
    with open(os.path.join(current_dir, "vectorizer.pkl"), 'wb') as f:
        pickle.dump(vectorizer, f)
        
    # Re-save the dataset
    df.to_csv(os.path.join(current_dir, "dataset_processed.csv"), index=False)
    
    print(f"Model trained. Accuracy on training set: {model.score(X_vec, y):.2f}")

if __name__ == "__main__":
    train_model()
