from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class WalletRequest(BaseModel):
    address: str

@app.get("/")
def root():
    return {"status": "Wallet Engine Running"}

@app.post("/analyze-wallet")
def analyze_wallet(req: WalletRequest):
    address = req.address

    # Example using public API (placeholder)
    try:
        res = requests.get(f"https://api.blockchair.com/ethereum/dashboards/address/{address}")
        data = res.json()

        balance = data.get("data", {}).get(address, {}).get("address", {}).get("balance", 0)
        tx_count = data.get("data", {}).get(address, {}).get("address", {}).get("transaction_count", 0)

        risk_score = "LOW"
        if tx_count < 5:
            risk_score = "HIGH"
        elif tx_count < 20:
            risk_score = "MEDIUM"

        return {
            "address": address,
            "balance": balance,
            "transactions": tx_count,
            "risk": risk_score
        }

    except Exception as e:
        return {"error": str(e)}
