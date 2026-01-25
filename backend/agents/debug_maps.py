import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
# UCF Student Union area
LAT = 28.6024
LNG = -81.2001

url = "https://places.googleapis.com/v1/places:searchNearby"

headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.primaryType"
}

data = {
    "includedTypes": ["restaurant", "store"],
    "maxResultCount": 5,
    "locationRestriction": {
        "circle": {
            "center": {
                "latitude": LAT,
                "longitude": LNG
            },
            "radius": 100.0
        }
    }
}

print(f"Testing API Key: {API_KEY[:5]}...{API_KEY[-5:]}")
response = requests.post(url, json=data, headers=headers)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")