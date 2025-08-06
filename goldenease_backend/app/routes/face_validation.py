from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import base64
from typing import Optional
import os

from ..database import get_db
from ..services.face_validation import FaceValidationService
from ..models import User

router = APIRouter(prefix="/face", tags=["face_validation"])

@router.post("/validate")
async def validate_face_photo(
    file: UploadFile = File(...),
    user_id: Optional[int] = None,
    method: str = "auto",
    db: Session = Depends(get_db)
):
    """
    Validate a face photo using advanced face recognition APIs
    
    Parameters:
    - file: Image file to validate
    - user_id: Optional user ID for storing validation results
    - method: Validation method ("auto", "azure", "aws", "opencv")
    """
    
    try:
        # Read image data
        image_data = await file.read()
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Initialize face validation service
        face_service = FaceValidationService()
        
        # Perform validation
        validation_result = face_service.validate_photo(image_data, method)
        
        # Add file information to result
        validation_result["file_info"] = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(image_data)
        }
        
        # If user_id provided, optionally store results in database
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                validation_result["user_info"] = {
                    "user_id": user_id,
                    "user_name": user.name
                }
        
        # Determine overall validation status
        primary_result = validation_result.get("primary_result", {})
        validation_score = primary_result.get("validation_score", 0)
        
        validation_result["overall_status"] = {
            "is_valid": validation_score >= 70,  # 70% threshold
            "score": validation_score,
            "status": "PASSED" if validation_score >= 70 else "FAILED",
            "recommendations": _get_recommendations(primary_result)
        }
        
        return validation_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Face validation failed: {str(e)}")

@router.post("/validate-base64")
async def validate_face_base64(
    image_base64: str,
    user_id: Optional[int] = None,
    method: str = "auto",
    db: Session = Depends(get_db)
):
    """
    Validate a face photo from base64 encoded image data
    """
    
    try:
        # Decode base64 image
        if image_base64.startswith('data:image'):
            # Remove data URL prefix
            image_base64 = image_base64.split(',')[1]
        
        image_data = base64.b64decode(image_base64)
        
        # Initialize face validation service
        face_service = FaceValidationService()
        
        # Perform validation
        validation_result = face_service.validate_photo(image_data, method)
        
        # If user_id provided, get user info
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                validation_result["user_info"] = {
                    "user_id": user_id,
                    "user_name": user.name
                }
        
        # Determine overall validation status
        primary_result = validation_result.get("primary_result", {})
        validation_score = primary_result.get("validation_score", 0)
        
        validation_result["overall_status"] = {
            "is_valid": validation_score >= 70,
            "score": validation_score,
            "status": "PASSED" if validation_score >= 70 else "FAILED",
            "recommendations": _get_recommendations(primary_result)
        }
        
        return validation_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Face validation failed: {str(e)}")

@router.get("/config")
async def get_face_validation_config():
    """
    Get current face validation configuration and available methods
    """
    
    config = {
        "available_methods": ["auto", "azure", "aws", "opencv"],
        "default_method": "auto",
        "validation_threshold": 70,
        "api_status": {
            "azure": {
                "configured": bool(os.getenv('AZURE_FACE_ENDPOINT') and os.getenv('AZURE_FACE_KEY')),
                "endpoint": os.getenv('AZURE_FACE_ENDPOINT', 'Not configured')
            },
            "aws": {
                "configured": bool(os.getenv('AWS_ACCESS_KEY_ID') and os.getenv('AWS_SECRET_ACCESS_KEY')),
                "region": os.getenv('AWS_REGION', 'us-east-1')
            },
            "opencv": {
                "configured": True,
                "note": "Local processing, always available"
            }
        },
        "validation_criteria": {
            "smile_detection": "Detects genuine smile/happiness",
            "eyes_open": "Ensures eyes are open and visible",
            "image_quality": "Checks blur, brightness, and exposure",
            "face_pose": "Validates proper head position and angle",
            "liveness": "Advanced APIs can detect if photo is live vs printed"
        }
    }
    
    return config

def _get_recommendations(validation_result: dict) -> list:
    """
    Generate recommendations based on validation results
    """
    recommendations = []
    
    if not validation_result.get("face_detected", False):
        recommendations.append("No face detected. Please ensure your face is clearly visible in the photo.")
        return recommendations
    
    if not validation_result.get("smile_detected", False):
        recommendations.append("Please smile naturally for the photo.")
    
    if not validation_result.get("eyes_open", True):
        recommendations.append("Please keep your eyes open and looking at the camera.")
    
    # Image quality recommendations
    if validation_result.get("is_blurry", False) or validation_result.get("blur", "low") == "high":
        recommendations.append("Image appears blurry. Please take a clearer photo.")
    
    if not validation_result.get("is_well_lit", True) or validation_result.get("exposure") == "underExposure":
        recommendations.append("Image is too dark. Please ensure good lighting.")
    elif validation_result.get("exposure") == "overExposure":
        recommendations.append("Image is too bright. Please reduce lighting or avoid direct flash.")
    
    if not validation_result.get("is_centered", True):
        recommendations.append("Please center your face in the photo.")
    
    # Head pose recommendations
    head_pose = validation_result.get("head_pose", {})
    if abs(head_pose.get("yaw", 0)) > 15:
        recommendations.append("Please face the camera directly (avoid turning your head left or right).")
    if abs(head_pose.get("pitch", 0)) > 15:
        recommendations.append("Please look straight at the camera (avoid tilting your head up or down).")
    
    # Multiple faces
    if validation_result.get("face_count", 1) > 1:
        recommendations.append("Multiple faces detected. Please ensure only one person is in the photo.")
    
    if not recommendations:
        recommendations.append("Great photo! All validation criteria passed.")
    
    return recommendations
