import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs

url = "https://www.magayo.com/lotto-balls/poland/eurojackpot-numbers/"
response = requests.get(url)
response.raise_for_status()
soup = BeautifulSoup(response.text, "html.parser")

ball_data = []
for img_tag in soup.find_all("img"):
    img_url = img_tag.get("src")
    if not img_url or "show_ball" not in img_url:
        continue

    img_url = urljoin(url, img_url)
    parsed_url = urlparse(img_url)
    params = parse_qs(parsed_url.query)

    color = params.get('p1', [None])[0]
    number = params.get('p2', [None])[0]

    if color and number:
        ball_data.append(f"{color}{number}")

print("\n".join(ball_data))
