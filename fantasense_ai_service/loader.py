
import json
import sys
from pymongo import MongoClient

def load_players(json_file, league_name):
    with open(json_file, "r") as f:
        players = json.load(f)

    for p in players:
        p["league"] = league_name

    client = MongoClient("mongodb://localhost:27017")
    db = client.fantasense
    collection = db.players

    # Inserisce o aggiorna per nome + squadra
    for player in players:
        collection.update_one(
            {"name": player["name"], "team": player["team"], "league": player["league"]},
            {"$set": player},
            upsert=True
        )

    print(f"✅ {len(players)} giocatori caricati nel DB per la lega: {league_name}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("❌ Usa: python loader.py <file_json> <nome_lega>")
    else:
        load_players(sys.argv[1], sys.argv[2])
