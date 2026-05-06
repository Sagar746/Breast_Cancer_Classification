from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Patient
from .schemas import PatientCreate, PatientUpdate, PatientResponse

router = APIRouter()

@router.get("/", response_model=List[PatientResponse])
async def get_patients(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all patients with pagination"""
    query = select(Patient).offset(skip).limit(limit)
    result = await db.execute(query)
    patients = result.scalars().all()
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific patient by ID"""
    query = select(Patient).where(Patient.id == patient_id)
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/", response_model=PatientResponse, status_code=201)
async def create_patient(
    patient: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new patient"""
    # Check if patient_code already exists
    query = select(Patient).where(Patient.patient_code == patient.patient_code)
    result = await db.execute(query)
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Patient code already exists")

    db_patient = Patient(**patient.model_dump(), created_by=current_user["id"])
    db.add(db_patient)
    await db.commit()
    await db.refresh(db_patient)
    return db_patient

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: str,
    patient_update: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a patient"""
    query = select(Patient).where(Patient.id == patient_id)
    result = await db.execute(query)
    db_patient = result.scalar_one_or_none()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Check if updating to an existing patient_code
    if patient_update.patient_code:
        code_query = select(Patient).where(
            Patient.patient_code == patient_update.patient_code,
            Patient.id != patient_id
        )
        code_result = await db.execute(code_query)
        if code_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Patient code already exists")

    update_data = patient_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_patient, field, value)

    await db.commit()
    await db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}")
async def delete_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a patient"""
    query = select(Patient).where(Patient.id == patient_id)
    result = await db.execute(query)
    db_patient = result.scalar_one_or_none()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    await db.delete(db_patient)
    await db.commit()
    return {"message": "Patient deleted successfully"}