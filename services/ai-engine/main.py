from fastapi import FastAPI
from pydantic import BaseModel
import os
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Query(BaseModel):
    prompt: str

@app.get("/")
def root():
    return {"status": "AI Engine Running"}

@app.post("/ai-query")
def ai_query(q: Query):
    res = client.chat.completions.create(
        model="gpt-5.3",
        messages=[{"role":"user","content": q.prompt}]
    )
    return {"response": res.choices[0].message.content}
