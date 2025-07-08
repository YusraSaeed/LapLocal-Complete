

# import os
# import pandas as pd
# from pymongo import MongoClient
# from dotenv import load_dotenv

# # Load environment variables from root .env
# ROOT_ENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
# load_dotenv(dotenv_path=ROOT_ENV_PATH)

# # Read MongoDB URI and DB name
# MONGODB_URI = os.getenv("MONGODB_URI")
# DB_NAME = os.getenv("DB_NAME")  # Match how Node uses DB_NAME

# # Connect to MongoDB
# client = MongoClient(MONGODB_URI)
# db = client[DB_NAME]

# def load_data():
#     """Fetch buyers and listings collections from MongoDB."""
#     print("📡 Connecting to MongoDB and fetching data...")

#     buyers = list(db.buyers.find())
#     listings = list(db.laptoplistings.find())  # Optional: filter active only

#     print(f"✅ Loaded {len(buyers)} buyers and {len(listings)} listings")
#     return buyers, listings

# def prepare_interaction_matrix(buyers, listings):
#     """Create interaction matrix from viewed and engaged listings."""
#     listing_dict = {str(listing["_id"]): listing for listing in listings}
#     interactions = []

#     for buyer in buyers:
#         buyer_id = str(buyer["_id"])

#         # Viewed listings
#         for view in buyer.get("viewedListings", []):
#             listing_id = str(view.get("listing"))
#             if listing_id in listing_dict:
#                 interactions.append({
#                     "buyer_id": buyer_id,
#                     "listing_id": listing_id
#                 })

#         # Engaged listings
#         for engagement in buyer.get("engagedListings", []):
#             listing_id = str(engagement.get("listing"))
#             if listing_id in listing_dict:
#                 interactions.append({
#                     "buyer_id": buyer_id,
#                     "listing_id": listing_id
#                 })

#     df = pd.DataFrame(interactions)
#     print(f"🧾 Created {len(df)} interactions")
#     return df, listing_dict


import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from root .env
ROOT_ENV_PATH = os.path.join(os.path.dirname(__file__), '../../.env')
load_dotenv(dotenv_path=ROOT_ENV_PATH)

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def load_data():
    print("📡 Connecting to MongoDB and fetching data...")
    buyers = list(db.buyers.find())
    listings = list(db.laptoplistings.find())
    print(f"✅ Loaded {len(buyers)} buyers and {len(listings)} listings")
    return buyers, listings

def prepare_interaction_matrix(buyers, listings):
    """Create interaction matrix using 4 behavior types."""
    listing_dict = {str(listing["_id"]): listing for listing in listings}
    interactions = []

    for buyer in buyers:
        buyer_id = str(buyer["_id"])

        # Viewed Listings
        for view in buyer.get("viewedListings", []):
            listing_id = str(view.get("listing"))
            if listing_id in listing_dict:
                interactions.append({
                    "buyer_id": buyer_id,
                    "listing_id": listing_id,
                    "source": "view"
                })

        # Engaged Listings
        for engage in buyer.get("engagedListings", []):
            listing_id = str(engage.get("listing"))
            if listing_id in listing_dict:
                interactions.append({
                    "buyer_id": buyer_id,
                    "listing_id": listing_id,
                    "source": "engage"
                })

        # Recent Searches
        for search in buyer.get("recentSearches", []):
            keyword = search.get("keyword", "").lower()
            for lid, listing in listing_dict.items():
                title = str(listing.get("title", "")).lower()
                brand = str(listing.get("specifications", {}).get("brand", "")).lower()
                if keyword in title or keyword in brand:
                    interactions.append({
                        "buyer_id": buyer_id,
                        "listing_id": lid,
                        "source": "search"
                    })

        # Applied Filters
        for filt in buyer.get("appliedFilters", []):
            filters = filt.get("filters", {})
            for lid, listing in listing_dict.items():
                match = True
                specs = listing.get("specifications", {})
                for key, val in filters.items():
                    l_val = specs.get(key, "") if key in specs else listing.get(key, "")
                    if str(val).lower() not in str(l_val).lower():
                        match = False
                        break
                if match:
                    interactions.append({
                        "buyer_id": buyer_id,
                        "listing_id": lid,
                        "source": "filter"
                    })

    df = pd.DataFrame(interactions)
    print(f"🧾 Created {len(df)} interactions from all 4 behavior signals")
    return df, listing_dict
