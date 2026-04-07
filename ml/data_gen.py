import pandas as pd
import random
import os

def generate_mock_data(num_samples=800):
    products_info = {
        "QuantumX Laptop": "Electronics",
        "SonicBeat Headphones": "Electronics", 
        "GlowSmart Bulb": "Smart Home", 
        "AeroChair Pro": "Office Workspace",
        "VisionPro Monitor": "Electronics",
        "Titanium Standing Desk": "Office Workspace",
        "EcoSense Thermostat": "Smart Home",
        "Luna Coffee Maker": "Home Appliances",
        "Breeze Air Purifier": "Home Appliances"
    }
    products = list(products_info.keys())
    
    positive_words = ["amazing", "great", "excellent", "love", "perfect", "fantastic", "good", "best", "incredible", "smooth"]
    negative_words = ["terrible", "bad", "awful", "hate", "worst", "broken", "poor", "disappointing", "slow", "cheap"]
    neutral_words = ["okay", "average", "fine", "decent", "acceptable", "standard", "basic"]
    
    data = []
    
    for _ in range(num_samples):
        product = random.choice(products)
        category = products_info[product]
        rating = random.choices([1, 2, 3, 4, 5], weights=[0.15, 0.15, 0.15, 0.25, 0.30])[0]
        
        if rating >= 4:
            words = random.sample(positive_words, k=2) + ["quality", "design", "performance"]
        elif rating <= 2:
            words = random.sample(negative_words, k=2) + ["quality", "money", "useless"]
        else:
            words = random.sample(neutral_words, k=2) + ["product", "expected", "price"]
            
        words = random.sample(words, k=3) # mix them up
        review_text = f"This is an {words[0]} product. I really think the {words[1]} is {words[2]}."
        
        data.append({
            "product_name": product,
            "category": category,
            "review_text": review_text,
            "rating": rating
        })
        
    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    df.to_csv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dataset.csv"), index=False)
    print(f"Mock dataset generated successfully with {len(df)} samples and categories.")

if __name__ == "__main__":
    generate_mock_data()
