import fitz
from dotenv import load_dotenv
import os
load_dotenv()
chunk_size = int(os.getenv("MAX_CHUNK_SIZE"))
overlap    = int(os.getenv("CHUNK_OVERLAP"))
def load_pdf(file_path: str) -> fitz.Document:
    try:
        fitz_doc = fitz.open(file_path)
        return fitz_doc
    except Exception as e:
        print(f"Error loading PDF: {e}")
        return None

def extract_text(doc: fitz.Document) -> list[dict]:
    text_data = []
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        text = page.get_text()
        text_data.append({
            "page": page_num + 1,
            "text": text
        })
    return text_data

def chunk_text(text_data: list[dict], chunk_size: int, overlap:int) -> list[dict]:
    chunks = []
    chunk_id = 0
    for item in text_data:
        text = item["text"]
        page = item["page"]
        for i in range(0, len(text), chunk_size - overlap):
            chunk_id += 1
            chunk = text[i:i + chunk_size]
            chunks.append({
                'chunk_id': chunk_id,
                "page": page,
                "text": chunk
            })
    return chunks

def ingest_pdf(file_path: str) -> list[dict]:
    doc = load_pdf(file_path)
    if doc is None:
        return []
    
    text_data = extract_text(doc)
    chunks = chunk_text(text_data,chunk_size,overlap)
    
    return chunks

if __name__ == "__main__":
    file_path = "data/text.pdf"
    chunks = ingest_pdf(file_path)
    for chunk in chunks:
        print(f"Page: {chunk['page']}, Text: {chunk['text'][:100]}...")