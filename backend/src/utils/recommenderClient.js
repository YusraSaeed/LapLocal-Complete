import axios from "axios";
import { ApiError } from "./ApiError.js";

// Environment-based FastAPI URL (e.g. http://localhost:8000)
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export const fetchRecommendationsFromFastAPI = async ({ buyerId, listingIds = [], n = 20 }) => {
    try {
        const payload = {};
        if (buyerId) payload.buyer_id = buyerId;
        if (Array.isArray(listingIds) && listingIds.length > 0) {
        payload.listing_ids = listingIds;
        }
        payload.n_recommendations = n;

        // const { data } = await axios.post(`${FASTAPI_URL}/recommend`, payload);
        const { data } = await axios.post(`${FASTAPI_URL}/recommender/recommend`, payload);

        return data.recommendations;
    } catch (error) {
        console.error("FastAPI recommendation error:", error?.response?.data || error.message);
        throw new ApiError(500, "Failed to fetch recommendations from AI system");
    }
};
