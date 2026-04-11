from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

API_KEYS = {"admin-key": "admin"}


def verify(api_key: str):
    if api_key not in API_KEYS:
        raise HTTPException(status_code=403, detail="Unauthorized")


@app.get("/secure")
def secure_endpoint(x_api_key: str = Header(...)):
    verify(x_api_key)
    return {"status": "authorized"}
