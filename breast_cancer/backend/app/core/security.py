from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.config import settings
from app.core.database import get_db

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# # def verify_password(plain: str, hashed: str) -> bool:
# #     return pwd_context.verify(plain, hashed)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     try:
#         # Ensure we are passing strings, and truncate if someone 
#         # accidentally sends a massive payload (security best practice)
#         return pwd_context.verify(plain_password[:72], hashed_password)
#     except ValueError:
#         return False




import bcrypt

def hash_password(password: str) -> str:
    # Convert string to bytes, generate salt, and hash
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Bcrypt handles the salt automatically during checkpw
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False








def create_access_token(data: dict) -> str:
    payload      = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)



async def get_current_user(
    token: str            = Depends(oauth2_scheme),
    db:    AsyncSession   = Depends(get_db),
):
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise exc
    except JWTError:
        raise exc
    result = await db.execute(
        text("SELECT id, email, full_name, role, is_active FROM users WHERE id = :id"),
        {"id": user_id},
    )
    user = result.mappings().first()
    # if not user or not user["is_active"]:
    #     raise exc
    return dict(user)
