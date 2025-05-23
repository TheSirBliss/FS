
import json
import pandas as pd

def prepare_dataset(json_file="players_all.json", output_csv="dataset.csv"):
    with open(json_file, "r") as f:
        players = json.load(f)

    rows = []
    for p in players:
        rows.append({
            "name": p["name"],
            "team": p["team"],
            "position": p["position"],
            "games": int(p.get("games", 0)),
            "goals": float(p.get("goals", 0)),
            "assists": float(p.get("assists", 0)),
            "xG": float(p.get("xG", 0)),
            "xA": float(p.get("xA", 0)),
            "yellow_cards": int(p.get("yellow_cards", 0)),
            "red_cards": int(p.get("red_cards", 0)),
            "minutes": float(p.get("minutes", 0)),
            "league": p.get("league", "unknown")
        })

    df = pd.DataFrame(rows)
    df = df[df["games"] > 0]
    df["goal_rate"] = df["goals"] / df["games"]
    df["assist_rate"] = df["assists"] / df["games"]
    df["minutes_per_game"] = df["minutes"] / df["games"]
    df["xG_per_game"] = df["xG"] / df["games"]
    df["xA_per_game"] = df["xA"] / df["games"]

    df.to_csv(output_csv, index=False)
    print(f"✅ Dataset salvato come {output_csv} con {len(df)} righe.")

if __name__ == "__main__":
    prepare_dataset()
