from fastapi import FastAPI
from pydantic import BaseModel
import psycopg2
import os

app = FastAPI()

conn = psycopg2.connect(
    host="db",
    database="voltex",
    user="voltex",
    password="voltex"
)

class Memory(BaseModel):
    content: str

@app.post("/store-memory")
def store_memory(mem: Memory):
    cur = conn.cursor()
    cur.execute("INSERT INTO memory (content) VALUES (%s)", (mem.content,))
    conn.commit()
    cur.close()
    return {"status": "stored"}

@app.get("/get-memories")
def get_memories():
    cur = conn.cursor()
    cur.execute("SELECT * FROM memory ORDER BY id DESC LIMIT 10")
    rows = cur.fetchall()
    cur.close()
    return {"memories": rows}
