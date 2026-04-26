from sentence_transformers import SentenceTransformer
import chromadb
import os
from dotenv import load_dotenv

def load_embedder(model_name: str):
    try:
        embedder = SentenceTransformer(model_name)
        return embedder
    except Exception as e:
        print(f"Error loading embedder: {e}")
        return None

def get_chroma_collection(persist_dir: str, collection_name: str):
    client = chromadb.PersistentClient(path=persist_dir)
    collection = client.get_or_create_collection(name=collection_name)
    return collection

def embed_and_store(chunks: list[dict], embedder, collection):
    for chunk in chunks:
        text = chunk["text"]
        page = chunk["page"]
        chunk_id = str(chunk["chunk_id"])

        embedding = embedder.encode(text).tolist()  # Convert to list for storage

        collection.add(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"page": page}]
        )
        
if __name__ == "__main__":
    load_dotenv()

    model_name      = os.getenv("EMBEDDING_MODEL")
    persist_dir     = os.getenv("CHROMA_PERSIST_DIR")
    collection_name = "documents"

    from ingest import ingest_pdf
    file_path = "data/text.pdf"
    chunks = ingest_pdf(file_path)
    embedder = load_embedder(model_name)
    collection = get_chroma_collection(persist_dir, collection_name)
    embed_and_store(chunks, embedder, collection)

    print(f"Stored {len(chunks)} chunks into ChromaDB.")