# from langchain_chroma import Chroma
# from langchain_openai import OpenAIEmbeddings
# from dotenv import load_dotenv

# load_dotenv("../.env")

# def store_chunks(chunks):
#     embeddings = OpenAIEmbeddings(
#         model='text-embedding-ada-002'
#     )

#     vectorstore = Chroma(
#         persist_directory="../chromadb",  
#         embedding_function=embeddings,
#         collection_name="laptop_collection"  
#     )

#     print("Adding documents to vectorstore...")

#     # Chroma.add_documents(vectorstore, chunks)
#     # Chroma.add_texts(vectorstore, chunks)
#     vectorstore.add_documents(chunks) 

#     print("Documents added to vectorstore!")

# def retrieve_chunks(question, top_k=2):
#     embeddings = OpenAIEmbeddings(
#         model='text-embedding-ada-002'
#     )

#     vectorstore = Chroma(
#         persist_directory="../chromadb",  
#         embedding_function=embeddings,
#         collection_name="laptop_collection"
#     )

#     print("Retrieving documents...")
#     relevant_docs = vectorstore.similarity_search(question, top_k)
#     print("Retrieved")

#     return relevant_docs



# 

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma


def store_chunks(chunks):
    if not chunks:
        print("[embeddings] ❌ No chunks to embed — skipping vectorstore update.")
        return

    print("[embeddings] Initializing embedding model...")
    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')

    vectorstore = Chroma(
        persist_directory="./chromadb",
        embedding_function=embeddings,
        collection_name="laptop_collection"
    )

    print("[embeddings] Adding documents to ChromaDB...")
    vectorstore.add_documents(chunks)
    print("[embeddings] ✅ Documents added successfully!")

def retrieve_chunks(question, top_k=2):
    embeddings = OpenAIEmbeddings(
        model='text-embedding-ada-002'
    )

    vectorstore = Chroma(
        persist_directory="./chromadb",
        embedding_function=embeddings,
        collection_name="laptop_collection"
    )

    print("Retrieving documents...")
    relevant_docs = vectorstore.similarity_search(question, top_k)
    print("Retrieved")

    return relevant_docs
