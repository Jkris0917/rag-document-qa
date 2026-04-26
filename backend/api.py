from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import shutil
import os
from dotenv import load_dotenv
from embed import load_embedder, get_chroma_collection, embed_and_store, clear_collection
from rag import answer

load_dotenv()

app = FastAPI()
os.makedirs("data", exist_ok=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://rag-document-qa.vercel.app",  # replace with your actual Vercel URL
        "https://*.vercel.app",                 # covers all Vercel preview URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedder    = load_embedder(os.getenv("EMBEDDING_MODEL"))
collection  = get_chroma_collection(os.getenv("CHROMA_PERSIST_DIR"), "documents")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
model       = os.getenv("GROQ_MODEL")

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    with open("data/temp.pdf", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        from ingest import ingest_pdf
        clear_collection(collection) 
        chunks = ingest_pdf("data/temp.pdf")
        embed_and_store(chunks, embedder, collection)
        return {"message": f"Stored {len(chunks)} chunks."}
    finally:
        os.remove("data/temp.pdf")
        

@app.post("/ask")
async def ask_question(request: dict):
    question = request.get("question")
    if not question:
        return {"error": "Question is required."}
    
    result = answer(question, embedder, collection, groq_client, model)
    return result