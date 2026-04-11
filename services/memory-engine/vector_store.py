import os
from typing import List
from openai import OpenAI
import numpy as np

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory simple vector store (upgrade to FAISS later)
VECTORS = []  # list of (embedding, text)


def embed(text: str) -> List[float]:
    res = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return res.data[0].embedding


def add_memory(text: str):
    vec = embed(text)
    VECTORS.append((np.array(vec), text))


def search(query: str, k: int = 5):
    if not VECTORS:
        return []
    q = np.array(embed(query))
    sims = []
    for v, t in VECTORS:
        sim = float(np.dot(q, v) / (np.linalg.norm(q) * np.linalg.norm(v)))
        sims.append((sim, t))
    sims.sort(reverse=True, key=lambda x: x[0])
    return [t for _, t in sims[:k]]
