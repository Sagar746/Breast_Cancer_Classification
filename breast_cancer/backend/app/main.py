from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Breast Cnacer API is starting up...')
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

@app.get("/health")
async def health():
    return {"status":"ok", "service":"Breast Cancer API"}