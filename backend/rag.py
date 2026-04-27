from sentence_transformers import SentenceTransformer
from groq import Groq
import chromadb
import os
from dotenv import load_dotenv

def retrieve(query: str, embedder, collection, n_results: int = 3) -> list[dict]:
    query_embedding = embedder.encode(query).tolist()  # Convert to list for querying
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "metadatas"]
    )
    retrieved_chunks = []
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        retrieved_chunks.append({
            "text": doc,
            "page": meta["page"]
        })
    return retrieved_chunks


def build_prompt(query: str, context_chunks: list[dict]) -> str:

    prompt = "You are an assistant that answers questions based on the following document excerpts:\n\n"
    for chunk in context_chunks:
        prompt += f"[Page {chunk['page']}]: {chunk['text']}\n\n"
    prompt += f"Question: {query}\nAnswer (cite page numbers):"
    return prompt


def answer(query: str, embedder, collection, groq_client, model: str) -> dict:
    context_chunks = retrieve(query, embedder, collection)
    prompt = build_prompt(query, context_chunks)
    
    response = groq_client.chat.completions.create(
    model=model,
    messages=[{"role": "system", "content": "You are a helpful assistant that answers questions based on provided document excerpts."},
              {"role": "user", "content": prompt}],
    max_tokens=500
)
    answer_text = response.choices[0].message.content.strip()
    sources = list(set([chunk["page"] for chunk in context_chunks]))

    return {
        "answer": answer_text,
        "sources": sources
    }

def stream_answer(query: str, embedder, collection, groq_client, model: str):
    context_chunks = retrieve(query, embedder, collection)
    prompt = build_prompt(query, context_chunks)
    
    response = groq_client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": "You are a helpful assistant that answers questions based on provided document excerpts."},
                  {"role": "user", "content": prompt}],
        max_tokens=500,
        stream=True
    )

    for token_chunk in response:
        token = token_chunk.choices[0].delta.content or ""
        if token:
            yield token

    sources = list(set([c["page"] for c in context_chunks]))
    yield f"\n__SOURCES__{sources}"
        
if __name__ == "__main__":
    load_dotenv()
    from embed import load_embedder, get_chroma_collection

    embedder   = load_embedder(os.getenv("EMBEDDING_MODEL"))
    collection = get_chroma_collection(
                     os.getenv("CHROMA_PERSIST_DIR"), "documents")
    client     = Groq(api_key=os.getenv("GROQ_API_KEY"))
    model      = os.getenv("GROQ_MODEL")

    query  = "What are the steps to solve a binary search problem?"
    result = answer(query, embedder, collection, client, model)

    print(f"Answer  : {result['answer']}")
    print(f"Sources : {result['sources']}")