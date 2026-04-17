import requests
from bs4 import BeautifulSoup

url = "https://www.amazon.in/product-reviews/B0FQFTV1NP/"
# Trying a mobile browser header which is sometimes less restricted
headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
    "Referer": "https://www.google.com/"
}

try:
    print(f"Fetching {url} as Mobile...")
    response = requests.get(url, headers=headers, timeout=15)
    print(f"Status Code: {response.status_code}")
    
    if "api-services-support@amazon.com" in response.text or "To discuss automated access to Amazon data please contact" in response.text:
         print("Amazon detected bot. Blocked!")
    else:
        soup = BeautifulSoup(response.content, "html.parser")
        reviews = soup.find_all("div", {"data-hook": "review"})
        print(f"Found {len(reviews)} reviews.")
        if len(reviews) > 0:
            print(f"Sample: {reviews[0].find('span', {'data-hook': 'review-body'}).text[:50]}")

except Exception as e:
    print(f"Error: {e}")
