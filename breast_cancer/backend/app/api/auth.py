from sqlalchemy.ext.asyncio import (
    create_async_engine, async_sessionmaker, AsyncSession,
)
from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
from app.core.config import settings
from pydantic import BaseModel,EmailStr
from fastapi import APIRouter, Depends, HTTPException
from typing import Literal
from app.core.database import get_db
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import get_current_user

from app.core.security import (
    hash_password, 
    verify_password,      # Added this
    create_access_token,   # Added this
    get_current_user
)


router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user_id:      int # Changed from str to int for SQLite IDs
    role:         str
    full_name:    str


class RegisterRequest(BaseModel):
    email:     EmailStr
    password:  str
    full_name: str
    role:      Literal["admin", "doctor", "researcher"] = "doctor"

@router.post("/login", response_model=TokenResponse)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db:   AsyncSession = Depends(get_db),
):
    # is_active = 1 is the SQLite way for True
    result = await db.execute(
        text("SELECT id, email, hashed_password, role, full_name, is_active FROM users WHERE email = :e AND is_active = 1"),
        {"e": form.username},
    )
    user = result.mappings().first()
    
    if not user or not verify_password(form.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # sub must be a string for JWT
    token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    
    return TokenResponse(
        access_token=token,
        user_id=user["id"],
        role=user["role"],
        full_name=user["full_name"],
    )

@router.post("/register", status_code=201)
async def register(
    body: RegisterRequest,
    db:   AsyncSession = Depends(get_db),
    cu    = Depends(get_current_user),
):
    if cu["role"] != "admin":
        raise HTTPException(403, "Only admins can register new users")
    print(f"DEBUG: Registering user {body.email} by admin {cu['email']}")
        
    ex = await db.execute(
        text("SELECT id FROM users WHERE email = :e"), {"e": body.email}
    )
    if ex.first():
        raise HTTPException(400, "Email already registered")

    # SQLite INSERT
    await db.execute(
        text("""INSERT INTO users (email, hashed_password, full_name, role, is_active) 
                VALUES (:e, :p, :n, :r, 1)"""),
        {"e": body.email, "p": hash_password(body.password),
         "n": body.full_name, "r": body.role},
    )
    await db.commit() # Ensure the insert is saved!
    return {"message": "User registered successfully"}