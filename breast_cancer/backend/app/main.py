from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.auth import router as auth_router
from app.api.patients import router as patients_router
from app.api.predictions import router as predictions_router
from app.core.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Breast Cancer API is starting up...')
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title = "Breast Cancer API",
    description = "An API for breast cancer diagnosis and prognosis",
    version = "0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(patients_router, prefix="/patients", tags=["Patients"])
app.include_router(predictions_router, prefix="/predictions", tags=["Predictions"])

@app.get("/health")
async def health():
    return {"status":"ok", "service":"Breast Cancer API"}