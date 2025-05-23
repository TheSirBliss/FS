import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FantaSense backend è attivo! 🎉"}

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.fantasense
scores = db.scores

class ScoreEntry(BaseModel):
    userId: str
    matchday: int
    teamName: str
    goal: int = 0
    assist: int = 0
    cleanSheet: bool = False
    yellowCard: int = 0
    redCard: int = 0

@app.post("/submit-score")
def submit_score(entry: ScoreEntry):
    points = (entry.goal * 3) + (entry.assist * 1)
    if entry.cleanSheet:
        points += 3
    points -= entry.yellowCard * 1
    points -= entry.redCard * 2

    score_doc = {
        "userId": entry.userId,
        "matchday": entry.matchday,
        "teamName": entry.teamName,
        "points": points
    }

    scores.insert_one(score_doc)
    return {"message": "Punteggio registrato", "points": points}

@app.get("/scoreboard/{matchday}")
def scoreboard_matchday(matchday: int):
    records = list(scores.find({"matchday": matchday}))
    return sorted(records, key=lambda x: x["points"], reverse=True)

@app.get("/scoreboard/global")
def scoreboard_global():
    pipeline = [
        {"$group": {"_id": "$userId", "teamName": {"$first": "$teamName"}, "total": {"$sum": "$points"}}},
        {"$sort": {"total": -1}}
    ]
    records = list(scores.aggregate(pipeline))
    return records
