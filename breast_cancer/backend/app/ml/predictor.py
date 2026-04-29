import joblib
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import os 

class BreastCancerPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.model_path = "breast_cancer_model.pkl"
        self.scaler_path = "breast_cancer_scaler.pkl"

    def train_model(self):
        """Train the model using Wisconsin breast cancer dataset"""
        # Load the Wisconsin breast cancer dataset
        data = load_breast_cancer()
        X, y = data.data, data.target
        self.feature_names = data.feature_names

        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale the features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        self.model.fit(X_train_scaled, y_train)

        