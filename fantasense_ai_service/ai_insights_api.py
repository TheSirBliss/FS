from fastapi import FastAPI, Query
from typing import Dict
from pydantic import BaseModel
import json
import uvicorn

app = FastAPI()

# Simulazione di database (puoi sostituire con MongoDB in seguito)
with open("players_all_unified.json", "r") as f:
    all_players = json.load(f)

class Insight(BaseModel):
    trend: str = ""
    warning: str = ""

@app.get("/insight-player")
def get_insight(name: str = Query(..., description="Nome del giocatore")) -> Dict:
    player_data = all_players.get(name.lower())
    if not player_data:
        return {"error": "Giocatore non trovato"}

    last_3 = player_data.get("history", [])[-3:]  # Ultime 3 partite
    form = [p.get("rating", 0) for p in last_3]
    insights = {}

    if len(form) >= 3:
        if form[-1] < form[-2] < form[-3]:
            insights["trend"] = "📉 In calo: media voti scesa consecutivamente"
        elif form[-1] > form[-2] > form[-3]:
            insights["trend"] = "📈 In crescita: prestazioni in miglioramento"

    avg = sum(form) / len(form) if form else 0
    if avg < 6:
        insights["warning"] = "⚠️ Prestazioni recenti sotto la sufficienza"

    return insights

# Per test locale
# if __name__ == "__main__":
#     uvicorn.run("ai_insights_api:app", port=8020, reload=True)