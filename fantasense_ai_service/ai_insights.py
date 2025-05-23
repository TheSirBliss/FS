
def get_matchup_advice(home_team_stats, away_team_stats):
    advice = []

    # Gol subiti
    if home_team_stats["conceded_per_game"] < 1:
        advice.append(f"⚠️ Difficile segnare all'{home_team_stats['team']} in casa: schiera pochi attaccanti avversari.")
    else:
        advice.append(f"✅ {home_team_stats['team']} concede gol: puoi schierare attaccanti.")

    if away_team_stats["conceded_per_game"] > 2:
        advice.append(f"🔥 Il {away_team_stats['team']} prende molti gol: schiera attaccanti della squadra di casa.")
    else:
        advice.append(f"📊 Difesa del {away_team_stats['team']} solida: attaccanti avversari a rischio.")

    return advice

def compare_players(p1, p2):
    def compute_score(p):
        score = 0
        score += p.get("goals_per_game", 0) * 3
        score += p.get("assists_per_game", 0) * 2
        score += p.get("xG_per_game", 0) * 2
        score += p.get("xA_per_game", 0) * 1.5
        score += p.get("key_passes_per_game", 0)
        score += p.get("minutes_per_game", 0) / 90
        score -= p.get("price", 0) * 0.2  # penalizza giocatori troppo costosi
        return round(score, 2)

    score1 = compute_score(p1)
    score2 = compute_score(p2)

    best = p1["name"] if score1 > score2 else p2["name"]

    return {
        "player1_score": score1,
        "player2_score": score2,
        "recommendation": f"✅ Schiera {best} (AI Score: {max(score1, score2)})"
    }
