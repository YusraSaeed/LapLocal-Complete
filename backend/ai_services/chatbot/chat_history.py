from pymongo import MongoClient, ASCENDING
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
ROOT_ENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(dotenv_path=ROOT_ENV_PATH)

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def save_chat(data: dict):
    data['timestamp'] = datetime.now()
    db['ChatbotChats'].insert_one(data)  # ✅ Correct collection

def fetch_chat(userid: str):
    return list(db['ChatbotChats'].find({'user_id': userid}).sort('timestamp', ASCENDING))
