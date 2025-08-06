import os
from fastapi import FastAPI
from app import models, admin, auth
from app.routes import face_validation
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Create database tables
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database initialization warning: {e}")

app = FastAPI(
    title="Document Validator API",
    description="API for document validation and verification",
    version="1.0.0"
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Serve static files from the 'uploads' directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS origins - include your deployed frontend URL
origins = [
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://document-validation-app.windsurf.build",  # Your deployed frontend
    "https://singpass.maskantech.in",
    "*"  # Remove this in production for security
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root
@app.get("/")
def root():
    return {"message": "Welcome to the Document Validator API "}

# Routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(face_validation.router, prefix="/api", tags=["Face Validation"])
