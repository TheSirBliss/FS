import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

# Carica dataset
print("🔍 Caricamento dataset...")
df = pd.read_csv("dataset_fanta_all.csv")

# Preprocessing: rimuove valori nulli o anomali
df = df.dropna()
df = df[df["rating"] > 0]

# Selezione delle feature
features = ["xG", "xA", "key_passes", "goal", "assist", "minutes", "price"]
X = df[features]
y = df["rating"]

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Training modello
print("🚀 Addestramento modello RandomForest...")
model = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42)
model.fit(X_train, y_train)

# Valutazione
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"📉 MSE: {mse:.3f} | RMSE: {mse**0.5:.3f}")

# Salvataggio modello
joblib.dump(model, "modello_fanta_finale.pkl")
print("✅ Modello salvato come modello_fanta_finale.pkl")
