from fastapi import FastAPI, Query
from typing import List
from difflib import get_close_matches
import json

app = FastAPI()

# Caricamento nomi dei giocatori
with open("players_all_unified.json", "r") as f:
    all_players = json.load(f)
    player_names = list(all_players.keys())

@app.get("/search-player")
def search_player(name: str = Query(...)) -> List[str]:
    matches = get_close_matches(name.lower(), player_names, n=5, cutoff=0.5)
    return matches
