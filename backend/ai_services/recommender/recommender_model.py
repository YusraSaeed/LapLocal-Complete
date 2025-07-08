import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class ContentBasedRecommender:
    def __init__(self, n_neighbors=20):
        self.model = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        self.feature_matrix = None
        
    def fit(self, feature_matrix):
        self.feature_matrix = feature_matrix
        self.model.fit(feature_matrix.values)
        
    def recommend(self, listing_ids, n_recommendations=10):
        """Get recommendations based on item features"""
        if not listing_ids or self.feature_matrix is None:
            return []
            
        # Get indices of valid listing IDs
        valid_indices = []
        for lid in listing_ids:
            if lid in self.feature_matrix.index:
                idx = self.feature_matrix.index.get_loc(lid)
                valid_indices.append(idx)
        
        if not valid_indices:
            return []
            
        # Get similar items
        _, indices = self.model.kneighbors(
            self.feature_matrix.iloc[valid_indices].values, 
            n_neighbors=n_recommendations+1  # +1 to exclude self
        )
        
        # Flatten and deduplicate
        all_indices = np.unique(np.hstack(indices))
        
        # Convert indices to listing IDs
        recommendations = []
        for idx in all_indices:
            lid = self.feature_matrix.index[idx]
            if lid not in listing_ids:  # Exclude original items
                recommendations.append(lid)
            if len(recommendations) >= n_recommendations:
                break
                
        return recommendations

class UserProfileRecommender:
    def __init__(self):
        self.user_profiles = None
        self.feature_matrix = None
        
    def fit(self, user_profiles, feature_matrix):
        self.user_profiles = user_profiles
        self.feature_matrix = feature_matrix
        
    def recommend(self, user_id, n_recommendations=10):
        """Get recommendations based on user profile"""
        if (self.user_profiles is None or self.feature_matrix is None or 
            user_id not in self.user_profiles.index):
            return []
            
        user_vec = self.user_profiles.loc[user_id].values.reshape(1, -1)
        item_matrix = self.feature_matrix.values
        
        # Calculate cosine similarity
        similarities = cosine_similarity(user_vec, item_matrix)[0]
        
        # Get top N recommendations
        top_indices = np.argsort(similarities)[::-1][:n_recommendations]
        return self.feature_matrix.iloc[top_indices].index.tolist()