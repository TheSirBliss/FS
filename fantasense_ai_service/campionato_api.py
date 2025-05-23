from ai_insights import compare_players
from fastapi import FastAPI, Body

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Campionato API attiva!"}

@app.get("/classifica")
def get_classifica():
    return [
        {"pos": 1, "team": "Inter", "points": 75},
        {"pos": 2, "team": "Juventus", "points": 68},
        {"pos": 3, "team": "Milan", "points": 64}
    ]

@app.get("/marcatori")
def get_marcatori():
    return [
        {"player": "Lautaro Martinez", "team": "Inter", "goals": 22},
        {"player": "Osimhen", "team": "Napoli", "goals": 18}
    ]

@app.get("/partite")
def get_prossime_partite():
    return [
        {"date": "2024-05-26", "home": "Inter", "away": "Milan"},
        {"date": "2024-05-27", "home": "Roma", "away": "Juventus"}
    ]

@app.get("/gol_subiti")
def get_gol_subiti():
    return [
        {"team": "Inter", "conceded": 23},
        {"team": "Frosinone", "conceded": 51}
    ]

@app.post("/compare-players")
def compare(p1: dict = Body(...), p2: dict = Body(...)):
    return compare_players(p1, p2)