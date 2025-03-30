import random
import requests
import openai
import time
import os
from dotenv import load_dotenv
load_dotenv()

def is_spoiler(review):
    prompt = f"Classify the following movie review as 'Spoiler' or 'Non-Spoiler':\n\n{review}\n\nAnswer:"

    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Use "gpt-4-turbo" or "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": "You are a movie review classifier that detects spoilers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0  # Low temperature for consistent responses
        )

        result = response.choices[0].message.content.strip()
        return result
    except Exception as e:
        #print(f"Error: {e}")
        return "Error"

def search_movie(title: str):
    api_key = os.getenv("OMDB_API_KEY")
    url = f"http://www.omdbapi.com/?t={title}&apikey={api_key}"
    response = requests.get(url)
    print(response.url)  
    if response.status_code == 200:
        return response.json()
    else:
        return None
    

