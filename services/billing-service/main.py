from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Payment(BaseModel):
    user: str
    amount: float

payments = []

@app.post("/pay")
def pay(p: Payment):
    payments.append(p.dict())
    return {"status": "payment recorded"}

@app.get("/payments")
def get_payments():
    return {"payments": payments}
