from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()

# --- Test 1: .env is loading correctly ---
api_key = os.getenv("GROQ_API_KEY")
model   = os.getenv("GROQ_MODEL")
embed   = os.getenv("EMBEDDING_MODEL")

print(f"[1] API key loaded  : {api_key[:8]}...")
print(f"[2] Model           : {model}")
print(f"[3] Embedding model : {embed}")

# --- Test 2: Groq API is working ---
client = Groq(api_key=api_key)

response = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Say hello and tell me your model name in one sentence."
        }
    ],
    max_tokens=100
)

answer = response.choices[0].message.content
print(f"[4] Groq response   : {answer}")

# --- Test 3: Embeddings are working ---
print("[5] Loading embedding model (downloads ~90MB on first run)...")

from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer(embed)
vector   = embedder.encode("This is a test sentence.")

print(f"[6] Embedding shape : {vector.shape}")
print(f"[7] First 5 values  : {vector[:5].tolist()}")

print("\n✓ All systems go. Week 0 complete.")