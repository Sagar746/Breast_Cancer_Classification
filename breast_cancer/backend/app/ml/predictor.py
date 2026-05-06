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

        # Evaluate the model
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)

        print(f"Model trained successfully!")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Feature names: {list(self.feature_names)}")

        # Save the model and scaler
        self.save_model()

        return accuracy


    def save_model(self):
        """Save the trained model and scaler"""
        if self.model:
            joblib.dump(self.model, self.model_path)
        if self.scaler:
            joblib.dump(self.scaler, self.scaler_path)

    def load_model(self):
        """Load the trained model and scaler"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            if os.path.exists(self.scaler_path):
                self.scaler = joblib.load(self.scaler_path)
            return True
        except:
            return False

    def predict(self, features):
        """
        Make prediction using the trained model

        Args:
            features: List or array of 30 features in the correct order

        Returns:
            dict: Prediction results with probabilities and confidence
        """
        if not self.model or not self.scaler:
            if not self.load_model():
                raise ValueError("Model not trained or loaded")

        # Ensure features is a numpy array
        features_array = np.array(features).reshape(1, -1)

        # Scale the features
        features_scaled = self.scaler.transform(features_array)

        # Make prediction
        prediction = self.model.predict(features_scaled)[0]
        probabilities = self.model.predict_proba(features_scaled)[0]

        # Convert prediction (0 = malignant, 1 = benign) to match our schema
        prediction_label = "Benign" if prediction == 1 else "Malignant"
        malignant_prob = float(probabilities[0])  # probability of malignant (class 0)
        benign_prob = float(probabilities[1])     # probability of benign (class 1)

        # Confidence is the higher probability
        confidence = max(malignant_prob, benign_prob)

        return {
            "prediction": prediction_label,
            "confidence": confidence,
            "malignant_prob": malignant_prob,
            "benign_prob": benign_prob,
            "model_version": "v1.0",
            "threshold_used": 0.5
        }

    def get_feature_names(self):
        """Get the expected feature names"""
        if not self.feature_names:
            # Load default Wisconsin dataset feature names
            data = load_breast_cancer()
            self.feature_names = data.feature_names
        return list(self.feature_names)

# Global predictor instance
predictor = BreastCancerPredictor()

def get_predictor():
    """Get the global predictor instance"""
    return predictor