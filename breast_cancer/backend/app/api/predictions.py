from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Prediction
from .schemas import PredictionCreate, PredictionUpdate, PredictionResponse
from app.ml.predictor import get_predictor

router = APIRouter()

@router.get("/", response_model=List[PredictionResponse])
async def get_predictions(
    skip: int = 0,
    limit: int = 100,
    patient_id: str = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all predictions with optional filtering by patient"""
    query = select(Prediction)
    if patient_id:
        query = query.where(Prediction.patient_id == patient_id)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    predictions = result.scalars().all()
    return predictions

@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific prediction by ID"""
    query = select(Prediction).where(Prediction.id == prediction_id)
    result = await db.execute(query)
    prediction = result.scalar_one_or_none()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction

@router.post("/", response_model=PredictionResponse, status_code=201)
async def create_prediction(
    prediction: PredictionCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new prediction"""
    # Verify patient exists
    from app.models.models import Patient
    patient_query = select(Patient).where(Patient.id == prediction.patient_id)
    patient_result = await db.execute(patient_query)
    if not patient_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Patient not found")

    # If features are provided, use ML model for prediction
    prediction_data = prediction.model_dump()

    if any(prediction_data.get(feature) is not None for feature in [
        'mean_radius', 'mean_texture', 'mean_perimeter', 'mean_area',
        'mean_smoothness', 'mean_compactness', 'mean_concavity',
        'mean_concave_points', 'mean_symmetry', 'mean_fractal_dimension'
    ]):
        # Use ML model to make prediction
        predictor = get_predictor()

        # Extract features in correct order for Wisconsin dataset
        features = [
            prediction_data.get('mean_radius'),
            prediction_data.get('mean_texture'),
            prediction_data.get('mean_perimeter'),
            prediction_data.get('mean_area'),
            prediction_data.get('mean_smoothness'),
            prediction_data.get('mean_compactness'),
            prediction_data.get('mean_concavity'),
            prediction_data.get('mean_concave_points'),
            prediction_data.get('mean_symmetry'),
            prediction_data.get('mean_fractal_dimension'),
            prediction_data.get('radius_error'),
            prediction_data.get('texture_error'),
            prediction_data.get('perimeter_error'),
            prediction_data.get('area_error'),
            prediction_data.get('smoothness_error'),
            prediction_data.get('compactness_error'),
            prediction_data.get('concavity_error'),
            prediction_data.get('concave_points_error'),
            prediction_data.get('symmetry_error'),
            prediction_data.get('fractal_dimension_error'),
            prediction_data.get('worst_radius'),
            prediction_data.get('worst_texture'),
            prediction_data.get('worst_perimeter'),
            prediction_data.get('worst_area'),
            prediction_data.get('worst_smoothness'),
            prediction_data.get('worst_compactness'),
            prediction_data.get('worst_concavity'),
            prediction_data.get('worst_concave_points'),
            prediction_data.get('worst_symmetry'),
            prediction_data.get('worst_fractal_dimension'),
        ]

        # Check if all features are provided
        if None in features:
            raise HTTPException(
                status_code=400,
                detail="All 30 features must be provided for ML prediction"
            )

        try:
            ml_result = predictor.predict(features)
            # Update prediction data with ML results
            prediction_data.update(ml_result)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"ML prediction failed: {str(e)}"
            )

    db_prediction = Prediction(**prediction_data, predicted_by=current_user["id"])
    db.add(db_prediction)
    await db.commit()
    await db.refresh(db_prediction)
    return db_prediction

@router.put("/{prediction_id}", response_model=PredictionResponse)
async def update_prediction(
    prediction_id: str,
    prediction_update: PredictionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a prediction"""
    query = select(Prediction).where(Prediction.id == prediction_id)
    result = await db.execute(query)
    db_prediction = result.scalar_one_or_none()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    update_data = prediction_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_prediction, field, value)

    await db.commit()
    await db.refresh(db_prediction)
    return db_prediction

@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a prediction"""
    query = select(Prediction).where(Prediction.id == prediction_id)
    result = await db.execute(query)
    db_prediction = result.scalar_one_or_none()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    await db.delete(db_prediction)
    await db.commit()
    return {"message": "Prediction deleted successfully"}