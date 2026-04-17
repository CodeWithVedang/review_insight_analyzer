import requests
from bs4 import BeautifulSoup

url = "https://www.amazon.in/product-reviews/B0FQFTV1NP/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Referer": "https://www.google.com/",
    "Upgrade-Insecure-Requests": "1"
}

try:
    print(f"Fetching {url}...")
    session = requests.Session()
    response = session.get(url, headers=headers, timeout=15)
    print(f"Status Code: {response.status_code}")
    
    if "api-services-support@amazon.com" in response.text:
        print("Blocked by Amazon Bot Detection (CAPTCHA/Access Denied).")
    
    soup = BeautifulSoup(response.content, "html.parser")
    reviews = soup.find_all("div", {"data-hook": "review"})
    print(f"Found {len(reviews)} reviews with 'review' hook.")
    
    if len(reviews) == 0:
        # Try alternate selectors
        reviews = soup.select(".review")
        print(f"Found {len(reviews)} reviews with '.review' selector.")

except Exception as e:
    print(f"Error: {e}")
