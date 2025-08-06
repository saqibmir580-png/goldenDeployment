from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from . import schemas, models, database

router = APIRouter()
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    return database.get_db()

@router.post("/signup")
def signup(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=data.email).first():
        raise HTTPException(status_code=400, detail="Email exists")
    user = models.User(
        name=data.name,
        email=data.email,
        password=pwd_context.hash(data.password),
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.add(models.Application(user_id=user.id))  # create empty application
    db.commit()
    return {"message": "Signup successful"}

@router.post("/login")
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    payload = {
        "sub": user.email,
        "id": user.id,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "role": user.role}
