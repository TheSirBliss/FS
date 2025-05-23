
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()

model = joblib.load("ai_voto_model.pkl")

class PlayerStats(BaseModel):
    goals_per_game: float
    assists_per_game: float
    xG_per_game: float
    xA_per_game: float
    key_passes_per_game: float
    minutes_per_game: float
    price: float

@app.post("/predict-vote")
async def predict_vote(player: PlayerStats):
    X = pd.DataFrame([player.dict()])
    pred = model.predict(X)[0]
    return {"voto_predetto": round(pred, 2)}
