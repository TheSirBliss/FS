
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

def train_model(csv_file="dataset.csv", model_out="ai_voto_model.pkl"):
    print("📥 Carico dataset...")
    df = pd.read_csv(csv_file)

    # Selezioniamo feature numeriche per predizione intelligente del voto
    features = [
        "goals_per_game", "assists_per_game", "xG_per_game",
        "xA_per_game", "key_passes_per_game", "minutes_per_game", "price"
    ]
    X = df[features]

    # Etichetta fittizia = formula di voto smart (simulata se non reale)
    df["voto_ai"] = (
        df["goals_per_game"] * 3 +
        df["assists_per_game"] * 1.5 +
        df["xG_per_game"] * 2 +
        df["xA_per_game"] * 1.2 +
        df["key_passes_per_game"] * 0.8 +
        df["minutes_per_game"] / 90
    )

    y = df["voto_ai"]

    print("🔁 Suddivido train/test...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("🧠 Alleno il modello GradientBoostingRegressor...")
    model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    print("📊 Valutazione...")
    preds = model.predict(X_test)
    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"✅ MSE: {mse:.4f}")
    print(f"✅ R2 Score: {r2:.4f}")

    joblib.dump(model, model_out)
    print(f"📦 Modello salvato in {model_out}")

if __name__ == "__main__":
    train_model()
