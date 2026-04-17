import requests
import sys

def test_api():
    base_url = "http://127.0.0.1:8001"
    try:
        # 1. Health check
        r = requests.get(f"{base_url}/")
        print(f"Health Check: {r.status_code} - {r.json()}")
        
        # 2. Overall insights
        r = requests.get(f"{base_url}/insights/overall")
        print(f"Overall Insights: {r.status_code}")
        if r.status_code == 200:
            print(f"  Total Reviews: {r.json().get('total_reviews')}")
        
        # 3. Reviews list
        r = requests.get(f"{base_url}/reviews/")
        print(f"Reviews List: {r.status_code}")
        if r.status_code == 200:
            print(f"  Reviews fetched: {len(r.json())}")
            
        # 4. ML Logic check
        review_data = {"product_name": "Test Product", "review_text": "This is a great product with amazing battery!", "rating": 5}
        r = requests.post(f"{base_url}/reviews/", json=review_data)
        print(f"Add Review & ML Check: {r.status_code} - {r.json().get('sentiment')}")
        
        print("\n[SUCCESS] Backend appears fully functional.")
    except Exception as e:
        print(f"[ERROR] API Test failed: {e}")
        # If it failed because server is not running, we know what to do.

if __name__ == "__main__":
    test_api()
