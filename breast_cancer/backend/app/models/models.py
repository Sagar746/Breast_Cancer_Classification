from sqlalchemy import (
    Column, String, Boolean, Double, Text,
    Date, DateTime, JSON, Enum, Integer, ForeignKey,
)
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
from datetime import datetime, timezone

def new_uuid(): return str(uuid.uuid4())
def now():      return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id              = Column(CHAR(36), primary_key=True, default=new_uuid)
    email           = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name       = Column(String(150), nullable=False)
    role            = Column(Enum("admin","doctor","researcher"), default="doctor")
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime, default=now)
    updated_at      = Column(DateTime, default=now, onupdate=now)
    patients        = relationship("Patient", back_populates="creator",
                                   foreign_keys="Patient.created_by")
    predictions     = relationship("Prediction", back_populates="predictor",
                                   foreign_keys="Prediction.predicted_by")

class Patient(Base):
    __tablename__ = "patients"
    id            = Column(CHAR(36), primary_key=True, default=new_uuid)
    patient_code  = Column(String(20), unique=True, nullable=False)
    full_name     = Column(String(150), nullable=False)
    date_of_birth = Column(Date)
    gender        = Column(Enum("Male","Female","Other"))
    phone         = Column(String(20))
    email         = Column(String(255))
    address       = Column(Text)
    notes         = Column(Text)
    created_by    = Column(CHAR(36), ForeignKey("users.id", ondelete="SET NULL"))
    created_at    = Column(DateTime, default=now)
    updated_at    = Column(DateTime, default=now, onupdate=now)
    creator       = relationship("User", back_populates="patients",
                                  foreign_keys=[created_by])
    predictions   = relationship("Prediction", back_populates="patient",
                                  cascade="all, delete")




class Prediction(Base):
    __tablename__ = "predictions"
    id                      = Column(CHAR(36), primary_key=True, default=new_uuid)
    patient_id              = Column(CHAR(36),
                                     ForeignKey("patients.id", ondelete="CASCADE"),
                                     nullable=False)
    predicted_by            = Column(CHAR(36),
                                     ForeignKey("users.id", ondelete="SET NULL"))
    # 30 features
    mean_radius             = Column(Double)
    mean_texture            = Column(Double)
    mean_perimeter          = Column(Double)
    mean_area               = Column(Double)
    mean_smoothness         = Column(Double)
    mean_compactness        = Column(Double)
    mean_concavity          = Column(Double)
    mean_concave_points     = Column(Double)
    mean_symmetry           = Column(Double)
    mean_fractal_dimension  = Column(Double)
    radius_error            = Column(Double)
    texture_error           = Column(Double)
    perimeter_error         = Column(Double)
    area_error              = Column(Double)
    smoothness_error        = Column(Double)
    compactness_error       = Column(Double)
    concavity_error         = Column(Double)
    concave_points_error    = Column(Double)
    symmetry_error          = Column(Double)
    fractal_dimension_error = Column(Double)
    worst_radius            = Column(Double)
    worst_texture           = Column(Double)
    worst_perimeter         = Column(Double)
    worst_area              = Column(Double)
    worst_smoothness        = Column(Double)
    worst_compactness       = Column(Double)
    worst_concavity         = Column(Double)
    worst_concave_points    = Column(Double)
    worst_symmetry          = Column(Double)
    worst_fractal_dimension = Column(Double)
    # ML output
    prediction              = Column(Enum("Malignant","Benign"), nullable=False)
    confidence              = Column(Double, nullable=False)
    malignant_prob          = Column(Double, nullable=False)
    benign_prob             = Column(Double, nullable=False)
    model_version           = Column(String(50), default="v1.0")
    threshold_used          = Column(Double, default=0.5)
    actual_diagnosis        = Column(Enum("Malignant","Benign"))
    diagnosis_confirmed     = Column(Boolean, default=False)
    notes                   = Column(Text)
    predicted_at            = Column(DateTime, default=now)
    updated_at              = Column(DateTime, default=now, onupdate=now)
    patient                 = relationship("Patient", back_populates="predictions")
    predictor               = relationship("User", back_populates="predictions",
                                            foreign_keys=[predicted_by])
