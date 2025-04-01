import json
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
