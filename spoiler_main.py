import json
import random
import requests
import openai
import time
import os
from google import genai
from dotenv import load_dotenv
load_dotenv()



# 1. SETUP: Replace with your actual key
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def is_spoiler(review):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config={
                "system_instruction": "You are a movie review classifier. Detect spoilers.",
                "temperature": 0,
                "response_mime_type": "application/json",
            },
            contents=f"Classify this review. Return a JSON object with the key 'classification' and value 'SPOILER' or 'NON-SPOILER'. Review: {review}"
        )

        data = json.loads(response.text)
        return data.get("classification", "Error")
        
    except Exception as e:
        return f"Error: {e}"

# 2. TESTING: Let's try two different examples
test_reviews = [
    "I loved the cinematography and the acting was top notch! Highly recommend.",
    "I can't believe the main character dies at the 20-minute mark, what a twist!"
]

print("--- Gemini Spoiler Test Results ---")
for i, review in enumerate(test_reviews, 1):
    result = is_spoiler(review)
    print(f"Review {i}: {review}")
    print(f"Result:  [{result}]\n")



def search_omdb(title: str):
    print("Searching OMDB...")
    api_key = os.getenv("OMDB_API_KEY")
    url = f"http://www.omdbapi.com/?t={title}&apikey={api_key}"
    response = requests.get(url)
    print(response.url)  
    if response.status_code == 200:
        data = response.json()
        # Check if the API response indicates success
        if data.get("Response") == "True":
            return data
        else:
            print(f"Error: {data.get('Error', 'Unknown error')}")
            return None
    else:
        return None

def search_movie(title: str):
    if check_local_db(title):
        with open("movie_db.json", "r") as local_db:
            local_db_data = json.load(local_db)
        return local_db_data[title]
    else:
        omdb_data = search_omdb(title)
        if omdb_data:
            add_to_local_db(title, omdb_data)
            return omdb_data
        else:
            print("Movie not found in OMDB database.")
            return None

def check_local_db(title: str):
    try:
        with open("movie_db.json", "r") as local_db:
            local_db_data = json.load(local_db)
            return title in local_db_data
    except (FileNotFoundError, json.JSONDecodeError):
        # Create empty JSON file if it doesn't exist or is invalid
        with open("movie_db.json", "w") as local_db:
            json.dump({}, local_db)
        return False


#This will add the files to the local data base if the files are found
def add_to_local_db(title: str, data: dict):
    try:
        with open("movie_db.json", "r") as local_db:
            try:
                local_db_data = json.load(local_db)
            except json.JSONDecodeError:
                local_db_data = {}
    except FileNotFoundError:
        local_db_data = {}

    local_db_data[title] = data

    with open("movie_db.json", "w") as local_db:
        json.dump(local_db_data, local_db, indent=4)

async def get_movie_suggestions(search_term: str):
    api_key = os.getenv("OMDB_API_KEY")
    url = f"http://www.omdbapi.com/?s={search_term}&apikey={api_key}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data.get("Response") == "True":
                # Return only the first 5 suggestions
                return data.get("Search", [])[:5]
    except Exception as e:
        print(f"Error fetching suggestions: {e}")
    
    return []
