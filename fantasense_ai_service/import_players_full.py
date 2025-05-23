
import csv
from pymongo import MongoClient

# Connessione a MongoDB locale
client = MongoClient("mongodb://localhost:27017")
db = client.fantasense
collection = db.players

# Pulizia collezione prima di importare
collection.delete_many({})

# Percorso del file CSV
csv_file = "serieA_players_full.csv"

with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    players = []
    for row in reader:
        row['xG'] = float(row['xG'])
        row['form'] = float(row['form'])
        row['goals'] = int(row['goals'])
        row['assists'] = int(row['assists'])
        row['price'] = int(row['price'])
        players.append(row)

    collection.insert_many(players)

print(f"Importati {len(players)} giocatori nella collezione 'players'")
