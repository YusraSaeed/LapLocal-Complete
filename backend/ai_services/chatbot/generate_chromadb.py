from .chunking import create_chunks
from .embeddings import store_chunks

if __name__ == "__main__":
    print("Creating chunks from MongoDB...")
    chunks = create_chunks()
    print(f"Total chunks created: {len(chunks)}")

    print("Storing chunks in ChromaDB...")
    store_chunks(chunks)

    print("✅ ChromaDB regeneration completed!")
