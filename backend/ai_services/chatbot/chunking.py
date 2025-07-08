# from langchain_community.document_loaders.mongodb import MongodbLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from dotenv import load_dotenv
# import os

# load_dotenv("../.env")

# MONGODB_URI = os.getenv("MONGODB_URI")

# def create_chunks():
#     """
#     Load data from the laptops collection in MongoDB Atlas and create chunks.
#     """

#     loader = MongodbLoader(
#         connection_string=MONGODB_URI,
#         db_name="laptop_database",
#         collection_name="laptops",
#         field_names= ["brand", "model", "processor_brand", "processor_name", "processor_gnrtn", "ram_gb", "ram_type", "ssd", "hdd", "os", "os_bit", "graphic_card_gb", "weight", "display_size",  "warranty",  "Touchscreen", "latest_price", "star_rating"]
#     )

#     # docs = await loader.aload()  
#     docs = loader.load()
#     splitter = RecursiveCharacterTextSplitter(
#             chunk_size=300,  
#             chunk_overlap=20,  
#             length_function=len,
#             is_separator_regex=False
#         )

#     chunks = []
#     for page in docs:
#         # Splitting the text into smaller chunks
#         text = page.page_content
#         # split_texts = splitter.split_text(text)
#         pieces = splitter.create_documents([text])
#         chunks.extend(pieces)  # Add split texts to the chunks

#     return chunks

# # print("HELLO")





# laplocal
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

ROOT_ENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(dotenv_path=ROOT_ENV_PATH)

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def create_chunks():
    laptop_listings = list(db['laptoplistings'].find({'isAvailable': True}))
    print(f"[chunking] Total listings fetched: {len(laptop_listings)}")

    chunks = []

    for listing in laptop_listings:
        laptop = db['laptops'].find_one({'_id': listing['laptop']})
        if not laptop:
            print(f"[chunking] Laptop not found for listing: {listing['_id']}")
            continue

        combined_text = f"Brand: {laptop.get('brand')}\n"
        combined_text += f"Name: {laptop.get('name')}\n"
        combined_text += f"Price: {listing.get('price')}\n"
        combined_text += f"Condition: {listing.get('condition')}\n"
        combined_text += f"Available: {listing.get('quantityAvailable')}\n"

        specs = listing.get('specifications', {})
        if specs:
            for key, val in specs.items():
                combined_text += f"{key}: {val}\n"
        else:
            print(f"[chunking] No specifications found for listing: {listing['_id']}")

        chunks.append(combined_text)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False
    )

    split_docs = splitter.create_documents(chunks)
    print(f"[chunking] Total chunks created: {len(split_docs)}")
    return split_docs
