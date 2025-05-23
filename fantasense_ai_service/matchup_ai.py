from fastapi import FastAPI, Query
from typing import Dict

app = FastAPI()

# Forza squadre fittizia (puoi collegare a un database reale in seguito)
team_strength = {
    "inter": 9.1,
    "milan": 8.3,
    "napoli": 8.5,
    "empoli": 6.4,
    "verona": 6.2,
    "salernitana": 5.8
}

@app.get("/matchup-rating")
def get_matchup_rating(home: str = Query(...), away: str = Query(...)) -> Dict:
    h = team_strength.get(home.lower())
    a = team_strength.get(away.lower())
    if not h or not a:
        return {"error": "Squadra non trovata"}

    diff = h - a
    suggestion = ""
    if diff > 1.5:
        suggestion = f"✅ Favoriti: {home.capitalize()}"
    elif diff < -1.5:
        suggestion = f"🚫 Rischio alto per: {home.capitalize()}"
    else:
        suggestion = f"⚠️ Matchup equilibrato"

    return {
        "home": home,
        "away": away,
        "rating_home": h,
        "rating_away": a,
        "suggestion": suggestion
    }

# Per test locale
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("matchup_ai_api:app", port=8021, reload=True)