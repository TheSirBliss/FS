import os
import json
import pandas as pd

# Percorso ai JSON dei campionati
LEAGUES = ["Serie_A", "Premier_League", "La_Liga", "Bundesliga", "Ligue_1", "Championship", "Eredivisie"]
BASE_FOLDER = "./leagues_json/"

all_rows = []

for league in LEAGUES:
    path = os.path.join(BASE_FOLDER, f"{league.lower()}.json")
    if not os.path.exists(path):
        continue
    with open(path) as f:
        players = json.load(f)
        for name, p in players.items():
            history = p.get("history", [])
            for match in history:
                all_rows.append({
                    "name": name,
                    "team": p.get("team"),
                    "role": p.get("role"),
                    "price": p.get("price"),
                    "date": match.get("date"),
                    "xG": match.get("xG", 0),
                    "xA": match.get("xA", 0),
                    "key_passes": match.get("key_passes", 0),
                    "rating": match.get("rating", 0),
                    "goal": match.get("goal", 0),
                    "assist": match.get("assist", 0),
                    "minutes": match.get("minutes", 0),
                })

# Conversione in DataFrame
print(f"✔️ Totale righe raccolte: {len(all_rows)}")
df = pd.DataFrame(all_rows)
df.to_csv("dataset_fanta_all.csv", index=False)
print("✅ dataset_fanta_all.csv generato con successo")
