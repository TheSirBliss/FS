
import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_transfermarkt():
    url = "https://www.transfermarkt.it/serie-a/startseite/wettbewerb/IT1"
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, "html.parser")
    players = []

    for row in soup.select("table.items tbody tr"):
        name_tag = row.select_one(".hauptlink .hide-for-small")
        if not name_tag: continue
        name = name_tag.get_text(strip=True)
        team_tag = row.select_one("td.zentriert a[href*='/verein/']")
        team = team_tag.get("title") if team_tag else "N/A"
        position = row.select("td")[4].get_text(strip=True)
        players.append({
            "name": name,
            "team": team,
            "position": position,
            "league": "Serie_A"
        })

    return players

def scrape_fbref():
    url = "https://fbref.com/en/comps/11/Serie-A-Stats"
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, "html.parser")
    players = []

    table = soup.find("table")
    if not table:
        return players

    for row in table.select("tbody tr"):
        name_cell = row.find("th", {"data-stat": "player"})
        if not name_cell: continue
        name = name_cell.text.strip()
        team = row.find("td", {"data-stat": "squad"}).text.strip()
        goals = row.find("td", {"data-stat": "goals"}).text.strip()
        assists = row.find("td", {"data-stat": "assists"}).text.strip()
        minutes = row.find("td", {"data-stat": "minutes"}).text.strip()
        players.append({
            "name": name,
            "team": team,
            "goals": float(goals) if goals else 0,
            "assists": float(assists) if assists else 0,
            "minutes": float(minutes) if minutes else 0,
            "league": "Serie_A"
        })

    return players

def merge_players(data1, data2):
    merged = []
    seen = set()

    for p1 in data1:
        key = (p1["name"].lower(), p1["team"].lower())
        matched = next((p2 for p2 in data2 if p2["name"].lower() == p1["name"].lower() and p2["team"].lower() == p1["team"].lower()), None)
        if matched:
            combined = {**p1, **matched}
        else:
            combined = p1
        if key not in seen:
            merged.append(combined)
            seen.add(key)

    for p2 in data2:
        key = (p2["name"].lower(), p2["team"].lower())
        if key not in seen:
            merged.append(p2)
            seen.add(key)

    return merged

if __name__ == "__main__":
    print("📥 Scraping Transfermarkt...")
    tm_data = scrape_transfermarkt()
    print(f"✅ {len(tm_data)} giocatori da Transfermarkt")

    print("📥 Scraping FBref...")
    fbref_data = scrape_fbref()
    print(f"✅ {len(fbref_data)} giocatori da FBref")

    print("🔗 Unione dati...")
    all_players = merge_players(tm_data, fbref_data)

    with open("players_all_unified.json", "w") as f:
        json.dump(all_players, f, indent=2)

    print(f"🎉 Completato: {len(all_players)} giocatori salvati in players_all_unified.json")
