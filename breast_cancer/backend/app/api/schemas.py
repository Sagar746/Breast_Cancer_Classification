from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import date, datetime
from uuid import UUID

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Literal["admin", "doctor", "researcher"] = "doctor"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[Literal["admin", "doctor", "researcher"]] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Patient schemas
class PatientBase(BaseModel):
    patient_code: str
    full_name: str
    date_of_birth: Optional[date] = None
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    patient_code: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class PatientResponse(PatientBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Prediction schemas
class PredictionBase(BaseModel):
    patient_id: str
    mean_radius: Optional[float] = None
    mean_texture: Optional[float] = None
    mean_perimeter: Optional[float] = None
    mean_area: Optional[float] = None
    mean_smoothness: Optional[float] = None
    mean_compactness: Optional[float] = None
    mean_concavity: Optional[float] = None
    mean_concave_points: Optional[float] = None
    mean_symmetry: Optional[float] = None
    mean_fractal_dimension: Optional[float] = None
    radius_error: Optional[float] = None
    texture_error: Optional[float] = None
    perimeter_error: Optional[float] = None
    area_error: Optional[float] = None
    smoothness_error: Optional[float] = None
    compactness_error: Optional[float] = None
    concavity_error: Optional[float] = None
    concave_points_error: Optional[float] = None
    symmetry_error: Optional[float] = None
    fractal_dimension_error: Optional[float] = None
    worst_radius: Optional[float] = None
    worst_texture: Optional[float] = None
    worst_perimeter: Optional[float] = None
    worst_area: Optional[float] = None
    worst_smoothness: Optional[float] = None
    worst_compactness: Optional[float] = None
    worst_concavity: Optional[float] = None
    worst_concave_points: Optional[float] = None
    worst_symmetry: Optional[float] = None
    worst_fractal_dimension: Optional[float] = None
    prediction: Literal["Malignant", "Benign"]
    confidence: float
    malignant_prob: float
    benign_prob: float
    model_version: str = "v1.0"
    threshold_used: float = 0.5
    actual_diagnosis: Optional[Literal["Malignant", "Benign"]] = None
    diagnosis_confirmed: bool = False
    notes: Optional[str] = None

class PredictionCreate(PredictionBase):
    pass

class PredictionUpdate(BaseModel):
    mean_radius: Optional[float] = None
    mean_texture: Optional[float] = None
    mean_perimeter: Optional[float] = None
    mean_area: Optional[float] = None
    mean_smoothness: Optional[float] = None
    mean_compactness: Optional[float] = None
    mean_concavity: Optional[float] = None
    mean_concave_points: Optional[float] = None
    mean_symmetry: Optional[float] = None
    mean_fractal_dimension: Optional[float] = None
    radius_error: Optional[float] = None
    texture_error: Optional[float] = None
    perimeter_error: Optional[float] = None
    area_error: Optional[float] = None
    smoothness_error: Optional[float] = None
    compactness_error: Optional[float] = None
    concavity_error: Optional[float] = None
    concave_points_error: Optional[float] = None
    symmetry_error: Optional[float] = None
    fractal_dimension_error: Optional[float] = None
    worst_radius: Optional[float] = None
    worst_texture: Optional[float] = None
    worst_perimeter: Optional[float] = None
    worst_area: Optional[float] = None
    worst_smoothness: Optional[float] = None
    worst_compactness: Optional[float] = None
    worst_concavity: Optional[float] = None
    worst_concave_points: Optional[float] = None
    worst_symmetry: Optional[float] = None
    worst_fractal_dimension: Optional[float] = None
    prediction: Optional[Literal["Malignant", "Benign"]] = None
    confidence: Optional[float] = None
    malignant_prob: Optional[float] = None
    benign_prob: Optional[float] = None
    model_version: Optional[str] = None
    threshold_used: Optional[float] = None
    actual_diagnosis: Optional[Literal["Malignant", "Benign"]] = None
    diagnosis_confirmed: Optional[bool] = None
    notes: Optional[str] = None

class PredictionResponse(PredictionBase):
    id: str
    predicted_by: Optional[str] = None
    predicted_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True