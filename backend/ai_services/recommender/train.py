

# import pandas as pd
# import joblib
# import numpy as np
# import os
# import traceback
# from data_loader import load_data, prepare_interaction_matrix
# from feature_engineering import extract_features, preprocess_features
# from recommender_model import ContentBasedRecommender, UserProfileRecommender

# def train_recommender():
#     try:
#         print("Loading data...")
#         buyers, listings = load_data()
#         print(f"Loaded {len(buyers)} buyers and {len(listings)} listings")
        
#         print("Preparing interaction matrix...")
#         interactions, listing_features = prepare_interaction_matrix(buyers, listings)
#         print(f"Created {len(interactions)} interactions")
        
#         # Extract features - optimized to avoid fragmentation
#         print("Extracting features...")
#         features_list = []
#         valid_ids = []
        
#         for lid, lst in listing_features.items():
#             try:
#                 features = extract_features(lst)
#                 features_list.append(features)
#                 valid_ids.append(lid)
#             except Exception as e:
#                 print(f"Error processing listing {lid}: {str(e)}")
#                 continue
                
#         # Create DataFrame efficiently
#         listing_features_df = pd.DataFrame(features_list, index=valid_ids)
        
#         # Check if we have any data
#         if listing_features_df.empty:
#             raise ValueError("No valid listing features extracted")
        
#         print(f"Extracted features for {len(listing_features_df)} listings")
        
#         # Preprocess features
#         print("Preprocessing features...")
#         processed_features, preprocessor = preprocess_features(listing_features_df)
        
#         # Create user profiles
#         print("Creating user profiles...")
#         user_profiles = {}
        
#         for buyer_id, group in interactions.groupby('buyer_id'):
#             listing_ids = group['listing_id'].unique()
#             valid_ids = [lid for lid in listing_ids if lid in processed_features.index]
            
#             if valid_ids:
#                 # Use median to be robust to outliers
#                 user_profile = processed_features.loc[valid_ids].median()
#             else:
#                 user_profile = pd.Series(0, index=processed_features.columns)
                
#             user_profiles[buyer_id] = user_profile
        
#         user_profiles_df = pd.DataFrame(user_profiles).T.fillna(0)
        
#         # Train models
#         print("Training content-based model...")
#         content_model = ContentBasedRecommender()
#         content_model.fit(processed_features)
        
#         print("Training user profile model...")
#         user_model = UserProfileRecommender()
#         user_model.fit(user_profiles_df, processed_features)
        
#         # Create api directory if it doesn't exist
#         save_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../api/recommendation_model.pkl'))
#         os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
#         # Save models
#         print("Saving models...")
#         joblib.dump({
#             'content_model': content_model,
#             'user_model': user_model,
#             'preprocessor': preprocessor,
#             'user_profiles': user_profiles_df,
#             'listing_features': processed_features
#         }, save_path)
        
#         print(f"Models saved successfully to {save_path}")
#         return True
        
#     except Exception as e:
#         print(f"Training failed: {str(e)}")
#         traceback.print_exc()
#         return False

# if __name__ == "__main__":
#     train_recommender()


import pandas as pd
import joblib
import numpy as np
import os
import traceback
# from data_loader import load_data, prepare_interaction_matrix
# from feature_engineering import extract_features, preprocess_features



from recommender.data_loader import load_data, prepare_interaction_matrix
from recommender.feature_engineering import extract_features, preprocess_features
from recommender.recommender_model import ContentBasedRecommender, UserProfileRecommender



def train_recommender():
    try:
        print("🚀 Loading data...")
        buyers, listings = load_data()

        print("🛠️ Building interaction matrix...")
        interactions, listing_dict = prepare_interaction_matrix(buyers, listings)

        print("📦 Extracting features from listings...")
        features_list = []
        valid_ids = []

        for lid, listing in listing_dict.items():
            try:
                features = extract_features(listing)
                features_list.append(features)
                valid_ids.append(lid)
            except Exception as e:
                print(f"⚠️ Skipping listing {lid}: {str(e)}")

        listing_features_df = pd.DataFrame(features_list, index=valid_ids)
        if listing_features_df.empty:
            raise ValueError("No valid listing features extracted.")

        print(f"✅ Extracted features for {len(listing_features_df)} listings")

        print("🧼 Preprocessing features...")
        processed_features, preprocessor = preprocess_features(listing_features_df)

        # ✅ Weighting different behavior sources
        interaction_weights = {
            "view": 1.0,
            "engage": 2.0,
            "search": 0.7,
            "filter": 0.5
        }

        print("👤 Building weighted user profiles...")
        user_profiles = {}

        for buyer_id, group in interactions.groupby('buyer_id'):
            scores = []
            for _, row in group.iterrows():
                lid = row['listing_id']
                src = row.get('source', 'view')
                if lid in processed_features.index:
                    weight = interaction_weights.get(src, 1.0)
                    scores.append(processed_features.loc[lid] * weight)

            if scores:
                user_profile = pd.DataFrame(scores).mean()
            else:
                user_profile = pd.Series(0, index=processed_features.columns)

            user_profiles[buyer_id] = user_profile

        user_profiles_df = pd.DataFrame(user_profiles).T.fillna(0)

        print("🎯 Training content-based model...")
        content_model = ContentBasedRecommender()
        content_model.fit(processed_features)

        print("🎯 Training user-profile model...")
        user_model = UserProfileRecommender()
        user_model.fit(user_profiles_df, processed_features)

        print("💾 Saving model to disk...")
        save_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../api/recommendation_model.pkl'))
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        joblib.dump({
            'content_model': content_model,
            'user_model': user_model,
            'preprocessor': preprocessor,
            'user_profiles': user_profiles_df,
            'listing_features': processed_features
        }, save_path)

        print(f"✅ Training complete! Model saved at: {save_path}")
        return True

    except Exception as e:
        print(f"❌ Training failed: {str(e)}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    train_recommender()
