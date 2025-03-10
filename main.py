from fastapi import FastAPI
from pydantic import BaseModel
from spoiler_main import is_spoiler
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

