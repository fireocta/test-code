from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from spoiler_main import is_spoiler, search_movie
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    text: str

@app.post("/check_spoiler/")
async def check_spoiler(review: ReviewRequest):
    result = is_spoiler(review.text)
    return {"message": result}

class MovieSearchRequest(BaseModel):
    title: str

@app.post("/search_movie/")
async def search_movie_endpoint(request: MovieSearchRequest):
    result = search_movie(request.title)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Movie not found")

