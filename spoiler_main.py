import random
import requests

def is_spoiler(text: str):
    if random.randint(0, 1) == 0:
        return "This is not a spoiler!"
    else:
        return "This is a spoiler!"

def search_movie(title: str):
    api_key = "your_omdb_api_key"  # Replace with your actual OMDB API key
    url = f"http://www.omdbapi.com/?t={title}&apikey={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None