#!/usr/bin/env python3
"""
Train the breast cancer prediction model using Wisconsin dataset
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ml.predictor import predictor

def main():
    print("Training Breast Cancer Prediction Model...")
    print("Using Wisconsin Breast Cancer Dataset from scikit-learn")
    print()

    try:
        accuracy = predictor.train_model()
        print()
        print("Model training completed!")
        print(".4f")
        print("Model saved as: breast_cancer_model.pkl")
        print("Scaler saved as: breast_cancer_scaler.pkl")

    except Exception as e:
        print(f"Error training model: {e}")
        return 1

    return 0

if __name__ == "__main__":
    exit(main())