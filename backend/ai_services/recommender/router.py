# ai_services/recommender/router.py

import os
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from recommender.feature_engineering import extract_features
from recommender.data_loader import load_data, prepare_interaction_matrix


router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load trained models
model_path = os.path.join(os.path.dirname(__file__), "../api/recommendation_model.pkl")

model_data = joblib.load(model_path)

content_model = model_data['content_model']
user_model = model_data['user_model']
preprocessor = model_data['preprocessor']
listing_features = model_data['listing_features']
user_profiles = model_data['user_profiles']

buyers, listings = load_data()
_, listing_dict = prepare_interaction_matrix(buyers, listings)

class RecommendationRequest(BaseModel):
    buyer_id: str = None
    listing_ids: list[str] = None
    n_recommendations: int = 20

def build_user_profile_on_the_fly(buyer_id):
    buyer = next((b for b in buyers if str(b["_id"]) == buyer_id), None)
    if not buyer:
        return None

    interacted_ids = set()

    for view in buyer.get("viewedListings", []):
        lid = str(view.get("listing"))
        if lid in listing_features.index:
            interacted_ids.add(lid)

    for engage in buyer.get("engagedListings", []):
        lid = str(engage.get("listing"))
        if lid in listing_features.index:
            interacted_ids.add(lid)

    for search in buyer.get("recentSearches", []):
        keyword = search.get("keyword", "").lower()
        for lid, listing in listing_dict.items():
            title = str(listing.get("title", "")).lower()
            brand = str(listing.get("specifications", {}).get("brand", "")).lower()
            if keyword in title or keyword in brand:
                if lid in listing_features.index:
                    interacted_ids.add(lid)

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
            if match and lid in listing_features.index:
                interacted_ids.add(lid)

    if not interacted_ids:
        return None

    return listing_features.loc[list(interacted_ids)].median()

@router.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    try:
        user_recs = []
        if request.buyer_id:
            if request.buyer_id in user_profiles.index:
                user_recs = user_model.recommend(request.buyer_id, request.n_recommendations)
            else:
                profile = build_user_profile_on_the_fly(request.buyer_id)
                if profile is not None:
                    user_vec = profile.values.reshape(1, -1)
                    sims = cosine_similarity(user_vec, listing_features.values)[0]
                    top_indices = np.argsort(sims)[::-1][:request.n_recommendations]
                    user_recs = listing_features.iloc[top_indices].index.tolist()

        content_recs = []
        if request.listing_ids:
            content_recs = content_model.recommend(request.listing_ids, request.n_recommendations)

        combined = list(dict.fromkeys(user_recs + content_recs))[:request.n_recommendations]
        return {"recommendations": combined, "count": len(combined)}

    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
