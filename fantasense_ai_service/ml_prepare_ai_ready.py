
import json
import pandas as pd

def prepare_ai_dataset(json_file="players_all.json", output_csv="dataset.csv"):
    with open(json_file, "r") as f:
        players = json.load(f)

    rows = []
    for p in players:
        games = int(p.get("games", 0))
        minutes = float(p.get("minutes", 0))
        goals = float(p.get("goals", 0))
        assists = float(p.get("assists", 0))
        xG = float(p.get("xG", 0))
        xA = float(p.get("xA", 0))
        key_passes = float(p.get("key_passes", 0)) if "key_passes" in p else (xA * 3)  # stimato da xA

        if games > 0:
            rows.append({
                "name": p["name"],
                "team": p["team"],
                "position": p["position"],
                "league": p.get("league", "unknown"),
                "games": games,
                "minutes": minutes,
                "goals": goals,
                "assists": assists,
                "xG": xG,
                "xA": xA,
                "key_passes": key_passes,
                "goals_per_game": goals / games,
                "assists_per_game": assists / games,
                "xG_per_game": xG / games,
                "xA_per_game": xA / games,
                "key_passes_per_game": key_passes / games,
                "minutes_per_game": minutes / games
            })

    df = pd.DataFrame(rows)
    df.to_csv(output_csv, index=False)
    print(f"✅ Dataset AI salvato in {output_csv} con {len(df)} righe.")

if __name__ == "__main__":
    prepare_ai_dataset()
