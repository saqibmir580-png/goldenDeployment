from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas, database
from .ocr.extractor import extract_text_from_file
from .ocr import extract_fields_for
from .validator.passport import validate_passport_expiry
from .validator.emirates_id import validate_emirates_id
from .validator.marriage import validate_marriage_certificate
from .validator.property import validate_property_document
import os

router = APIRouter()

# 1. Admin dashboard stats
@router.get("/stats", response_model=schemas.Stats)
def get_stats(db: Session = Depends(database.get_db)):
    total_users = db.query(func.count(models.User.id)).scalar()
    total_apps = db.query(func.count(models.Application.id)).scalar()
    approved = db.query(func.count(models.Application.id)).filter_by(overall_status="approved").scalar()
    rejected = db.query(func.count(models.Application.id)).filter_by(overall_status="rejected").scalar()
    pending = db.query(func.count(models.Application.id)).filter_by(overall_status="pending").scalar()

    return {
        "total_users": total_users,
        "total_applications": total_apps,
        "approved": approved,
        "rejected": rejected,
        "pending": pending
    }

# 2. Admin: Validate documents for one user
@router.get("/validate/{user_id}")
def validate_user_documents(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    documents = db.query(models.Document).filter_by(user_id=user_id).all()
    if not documents:
        raise HTTPException(status_code=404, detail="No documents found")

    results = []
    all_valid = True

    for doc in documents:
        if not os.path.exists(doc.file_path):
            results.append({
                "document_type": doc.document_type,
                "is_valid": False,
                "message": "File not found",
                "file_path": doc.file_path
            })
            all_valid = False
            continue

        with open(doc.file_path, "rb") as f:
            content = f.read()

        # OCR extract text
        text = extract_text_from_file(doc.file_path, content)

        # Run appropriate validator
        if doc.document_type == "passport":
            extracted_data = extract_fields_for("passport", text)
            validation = validate_passport_expiry(extracted_data.get("expiry_date"))
            result = {
                "document_number": extracted_data.get("document_number") or "N/A",
                "holder_name": extracted_data.get("holder_name") or "N/A",
                "issued_date": extracted_data.get("issued_date") or "N/A",
                "expiry_date": extracted_data.get("expiry_date") or "N/A",
                "issuer": extracted_data.get("issuer") or "N/A",
                "nationality": extracted_data.get("nationality") or "N/A",
                "is_valid": validation["is_valid"],
                "message": validation["message"]
            }
        elif doc.document_type == "emirates_id":
            extracted_data = extract_fields_for("emirates_id", text)
            validation = validate_emirates_id(extracted_data)
            result = {
                "document_number": extracted_data.get("document_number") or "N/A",
                "holder_name": extracted_data.get("holder_name") or "N/A",
                "date_of_birth": extracted_data.get("date_of_birth") or "N/A",
                "expiry_date": extracted_data.get("expiry_date") or "N/A",
                "nationality": extracted_data.get("nationality") or "N/A",
                "is_valid": validation["is_valid"],
                "message": validation["message"]
            }
        elif doc.document_type == "marriage_certificate":
            extracted_data = extract_fields_for("marriage_certificate", text)
            validation = validate_marriage_certificate(extracted_data)
            result = {
                "document_number": extracted_data.get("document_number") or "N/A",
                "bride_name": extracted_data.get("bride_name") or "N/A",
                "groom_name": extracted_data.get("groom_name") or "N/A",
                "marriage_date": extracted_data.get("marriage_date") or "N/A",
                "issued_date": extracted_data.get("issued_date") or "N/A",
                "is_valid": validation["is_valid"],
                "message": validation["message"]
            }
        elif doc.document_type == "property_document":
            extracted_data = extract_fields_for("property_document", text)
            validation = validate_property_document(extracted_data)
            result = {
                "document_number": extracted_data.get("document_number") or "N/A",
                "owner_name": extracted_data.get("owner_name") or "N/A",
                "property_type": extracted_data.get("property_type") or "N/A",
                "registration_date": extracted_data.get("registration_date") or "N/A",
                "is_valid": validation["is_valid"],
                "message": validation["message"]
            }
        else:
            result = {"is_valid": False, "message": "Unknown document type"}

        doc.validation_result = result
        doc.status = "validated" if result.get("is_valid") else "rejected"
        db.commit()

        results.append({
            "document_type": doc.document_type,
            **result,
            "file_path": doc.file_path
        })

        if not result.get("is_valid"):
            all_valid = False

    # Update application status
    application = db.query(models.Application).filter_by(user_id=user_id).first()
    if application:
        application.overall_status = "approved" if all_valid else "rejected"
        db.commit()
    
    # Update user status based on validation results
    user = db.query(models.User).filter_by(id=user_id).first()
    if user:
        user.status = "approved" if all_valid else "rejected"
        db.commit()

    return {
        "user_id": user_id,
        "application_status": "approved" if all_valid else "rejected",
        "results": results
    }

@router.get("/applications")
def get_all_applications(db: Session = Depends(database.get_db)):
    applications = db.query(models.Application).order_by(models.Application.created_at.desc()).all()

    if not applications:
        return []

    result = []
    for app in applications:
        user = app.user
        if not user:
            continue

        result.append({
            "id": app.id,
            "submitted_date": app.created_at.strftime("%Y-%m-%d"),
            "submitted_time": app.created_at.strftime("%H:%M:%S"),
            "status": app.overall_status,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "dob": user.dob.strftime("%Y-%m-%d") if user.dob else None,
                "contact_number": user.contact_number,
                "address": user.address,
            }
        })

    return result

@router.get("/users", response_model=list[schemas.User])
def get_all_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    return users

@router.get("/users/{user_id}", response_model=schemas.User)
def get_user_by_id(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users/{user_id}/verify-documents")
def verify_user_documents_sequentially(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    application = db.query(models.Application).filter_by(user_id=user_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found for this user")

    # Define the verification sequence
    verification_sequence = ["photo", "passport", "marriage_certificate", "emirates_id"]
    all_valid = True
    verification_results = []

    for doc_type in verification_sequence:
        result = {"is_valid": False, "message": "Document not found"}

        if doc_type == "photo":
            if user.image and os.path.exists(user.image):
                result = {"is_valid": True, "message": "Photo exists"}
            else:
                result = {"is_valid": False, "message": "Photo not found"}
                all_valid = False
        else:
            document = db.query(models.Document).filter_by(user_id=user_id, document_type=doc_type).first()
            if document and os.path.exists(document.file_path):
                with open(document.file_path, "rb") as f:
                    content = f.read()
                text = extract_text_from_file(document.file_path, content)

                if doc_type == "passport":
                    result = validate_passport_expiry(text)
                elif doc_type == "marriage_certificate":
                    result = validate_marriage_certificate(text)
                elif doc_type == "emirates_id":
                    result = validate_emirates_id(text)
                
                document.status = "approved" if result.get("is_valid") else "rejected"
                document.validation_result = result
                db.commit()

                if not result.get("is_valid"): 
                    all_valid = False
            else:
                all_valid = False
        
        verification_results.append({"document_type": doc_type, **result})
        # If one document fails, we can decide to stop or continue
        # For now, we continue to validate all, and just track the overall validity

    # Update overall application status
    application.overall_status = "approved" if all_valid else "rejected"
    db.commit()

    return {
        "message": "Verification process completed.",
        "overall_status": application.overall_status,
        "results": verification_results
    }