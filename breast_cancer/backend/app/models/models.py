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
