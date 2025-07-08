# import re
# import pandas as pd
# import numpy as np
# from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.impute import SimpleImputer

# def extract_numeric_value(s):
#     """Extract numeric values from strings with robust error handling"""
#     if s is None:
#         return 0
#     if isinstance(s, (int, float)):
#         return float(s)
#     if isinstance(s, str):
#         try:
#             # Remove commas and non-numeric characters
#             clean_str = re.sub(r'[^\d.]', '', s)
#             return float(clean_str) if clean_str else 0
#         except:
#             return 0
#     return 0

# def extract_features(listing):
#     """Extract features with comprehensive validation"""
#     specs = listing.get('specifications', {})
#     features = {}
    
#     # Numerical features with defaults
#     features['price'] = extract_numeric_value(listing.get('price', 0))
#     features['ram_gb'] = extract_numeric_value(specs.get('ram', 0))
#     features['storage_gb'] = extract_numeric_value(specs.get('storage', 0))
#     features['weight_kg'] = extract_numeric_value(specs.get('weight', 0))
    
#     # Categorical features with defaults
#     features['condition'] = listing.get('condition', 'unknown')
#     features['brand'] = specs.get('brand', 'unknown').split()[0].lower()  # First word
#     features['gpu_type'] = specs.get('gpuType', 'unknown').lower()
#     features['os'] = specs.get('os', 'unknown').lower()
#     features['type'] = specs.get('type', 'unknown').lower()
    
#     return features

# def preprocess_features(features_df):
#     """Preprocess features with robust error handling"""
#     # Define columns
#     num_cols = ['price', 'ram_gb', 'storage_gb', 'weight_kg']
#     cat_cols = ['condition', 'brand', 'gpu_type', 'os', 'type']
    
#     # Handle missing values
#     num_imputer = SimpleImputer(strategy='median')
#     cat_imputer = SimpleImputer(strategy='most_frequent')
    
#     features_df[num_cols] = num_imputer.fit_transform(features_df[num_cols])
#     features_df[cat_cols] = cat_imputer.fit_transform(features_df[cat_cols])
    
#     # Preprocessor pipeline
#     preprocessor = ColumnTransformer(
#         transformers=[
#             ('num', MinMaxScaler(), num_cols),
#             ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
#         ])
    
#     # Apply transformations
#     processed = preprocessor.fit_transform(features_df)
    
#     # Get feature names
#     feature_names = preprocessor.get_feature_names_out()
    
#     return pd.DataFrame(processed, columns=feature_names, index=features_df.index), preprocessor


import re
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

def extract_numeric_value(s):
    """Extract numeric values from strings with robust error handling"""
    if s is None:
        return 0
    if isinstance(s, (int, float)):
        return float(s)
    if isinstance(s, str):
        try:
            # Remove commas and non-numeric characters
            clean_str = re.sub(r'[^\d.]', '', s)
            return float(clean_str) if clean_str else 0
        except:
            return 0
    return 0

def extract_features(listing):
    """Extract features with comprehensive validation"""
    specs = listing.get('specifications', {})
    features = {}
    
    # Numerical features with defaults
    features['price'] = extract_numeric_value(listing.get('price', 0))
    features['ram_gb'] = extract_numeric_value(specs.get('ram', 0))
    features['storage_gb'] = extract_numeric_value(specs.get('storage', 0))
    features['weight_kg'] = extract_numeric_value(specs.get('weight', 0))
    
    # Categorical features with defaults
    features['condition'] = listing.get('condition', 'unknown')
    features['brand'] = specs.get('brand', 'unknown').split()[0].lower() if specs.get('brand') else 'unknown'
    features['gpu_type'] = specs.get('gpuType', 'unknown').lower()
    features['os'] = specs.get('os', 'unknown').lower()
    features['type'] = specs.get('type', 'unknown').lower()
    
    return features

def preprocess_features(features_df):
    """Preprocess features with robust error handling"""
    # Define columns
    num_cols = ['price', 'ram_gb', 'storage_gb', 'weight_kg']
    cat_cols = ['condition', 'brand', 'gpu_type', 'os', 'type']
    
    # Handle missing values
    num_imputer = SimpleImputer(strategy='median')
    cat_imputer = SimpleImputer(strategy='most_frequent')
    
    features_df[num_cols] = num_imputer.fit_transform(features_df[num_cols])
    features_df[cat_cols] = cat_imputer.fit_transform(features_df[cat_cols])
    
    # Preprocessor pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', Pipeline([
                ('imputer', SimpleImputer(strategy='median')),
                ('scaler', MinMaxScaler())
            ]), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
        ])
    
    # Apply transformations
    processed = preprocessor.fit_transform(features_df)
    
    # Get feature names
    feature_names = preprocessor.get_feature_names_out()
    
    return pd.DataFrame(processed, columns=feature_names, index=features_df.index), preprocessor