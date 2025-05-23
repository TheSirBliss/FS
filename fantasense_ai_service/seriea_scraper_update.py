import requests
import json
from bs4 import BeautifulSoup

# Base URL (da cambiare con fonte ufficiale appena hai accesso)
BASE_URL = "https://www.football-data.co.uk/italym.php"

# Simulazione scraping (mockup per esempio real-time con tabelle pronte)
def fetch_seriea_data():
    r = requests.get(BASE_URL)
    soup = BeautifulSoup(r.text, "html.parser")

    players = {}

    for i in range(1, 6):  # Fino a 5 squadre per test
        player_name = f"giocatore_{i}"
        players[player_name] = {
            "team": f"Squadra_{i}",
            "role": "C",
            "price": 12 + i,
            "xG": 0.3 * i,
            "xA": 0.2 * i,
            "key_passes": 1.1 * i,
            "rating": 6.5 + 0.1 * i,
            "history": [
                {"date": "2024-04-01", "rating": 6.7},
                {"date": "2024-04-08", "rating": 6.3},
                {"date": "2024-04-15", "rating": 7.1}
            ]
        }

    with open("players_all_unified.json", "w") as f:
        json.dump(players, f, indent=2)

    print("✔ Database Serie A aggiornato")

if __name__ == "__main__":
    fetch_seriea_data()
