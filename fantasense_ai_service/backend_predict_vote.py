from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("modello_fanta_finale.pkl")

class PlayerInput(BaseModel):
    goals_per_game: float
    assists_per_game: float
    xG_per_game: float
    xA_per_game: float
    key_passes_per_game: float
    minutes_per_game: float
    price: float

@app.post("/predict-vote")
def predict_vote(player: PlayerInput):
    features = [[
        player.xG_per_game,
        player.xA_per_game,
        player.key_passes_per_game,
        player.goals_per_game,
        player.assists_per_game,
        player.minutes_per_game,
        player.price
    ]]
    voto_predetto = model.predict(features)[0]
    return {"voto_predetto": round(voto_predetto, 2)}
