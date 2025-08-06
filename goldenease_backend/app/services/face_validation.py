import os
import requests
import base64
from typing import Dict, Any, Optional
import cv2
import numpy as np
from PIL import Image
import io

class FaceValidationService:
    def __init__(self):
        # Azure Face API configuration
        self.azure_endpoint = os.getenv('AZURE_FACE_ENDPOINT')
        self.azure_key = os.getenv('AZURE_FACE_KEY')
        
        # AWS Rekognition configuration (alternative)
        self.aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
        self.aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        self.aws_region = os.getenv('AWS_REGION', 'us-east-1')
        
    def validate_photo_azure(self, image_data: bytes) -> Dict[str, Any]:
        """
        Validate photo using Azure Face API
        Returns detailed face analysis including emotions, pose, etc.
        """
        if not self.azure_endpoint or not self.azure_key:
            return {"error": "Azure Face API not configured"}
        
        try:
            # Azure Face API endpoint
            url = f"{self.azure_endpoint}/face/v1.0/detect"
            
            headers = {
                'Ocp-Apim-Subscription-Key': self.azure_key,
                'Content-Type': 'application/octet-stream'
            }
            
            params = {
                'returnFaceId': 'true',
                'returnFaceLandmarks': 'true',
                'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
            }
            
            response = requests.post(url, headers=headers, params=params, data=image_data)
            
            if response.status_code == 200:
                faces = response.json()
                if faces:
                    face = faces[0]  # Use first detected face
                    return self._process_azure_response(face)
                else:
                    return {"error": "No face detected"}
            else:
                return {"error": f"Azure API error: {response.status_code}"}
                
        except Exception as e:
            return {"error": f"Azure validation failed: {str(e)}"}
    
    def validate_photo_aws(self, image_data: bytes) -> Dict[str, Any]:
        """
        Validate photo using AWS Rekognition
        """
        try:
            import boto3
            
            if not self.aws_access_key or not self.aws_secret_key:
                return {"error": "AWS credentials not configured"}
            
            client = boto3.client(
                'rekognition',
                aws_access_key_id=self.aws_access_key,
                aws_secret_access_key=self.aws_secret_key,
                region_name=self.aws_region
            )
            
            response = client.detect_faces(
                Image={'Bytes': image_data},
                Attributes=['ALL']
            )
            
            if response['FaceDetails']:
                face = response['FaceDetails'][0]
                return self._process_aws_response(face)
            else:
                return {"error": "No face detected"}
                
        except Exception as e:
            return {"error": f"AWS validation failed: {str(e)}"}
    
    def validate_photo_opencv(self, image_data: bytes) -> Dict[str, Any]:
        """
        Validate photo using OpenCV (local processing, no API required)
        """
        try:
            # Convert bytes to OpenCV image
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return {"error": "Invalid image data"}
            
            # Load OpenCV face cascade
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
            eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) == 0:
                return {"error": "No face detected"}
            
            # Analyze first detected face
            (x, y, w, h) = faces[0]
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = img[y:y+h, x:x+w]
            
            # Detect smile
            smiles = smile_cascade.detectMultiScale(roi_gray, 1.8, 20)
            has_smile = len(smiles) > 0
            
            # Detect eyes
            eyes = eye_cascade.detectMultiScale(roi_gray)
            eyes_open = len(eyes) >= 2
            
            # Check image quality
            blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
            is_blurry = blur_score < 100
            
            # Check brightness
            brightness = np.mean(gray)
            is_well_lit = 50 < brightness < 200
            
            # Check if face is centered
            img_center_x = img.shape[1] // 2
            face_center_x = x + w // 2
            is_centered = abs(face_center_x - img_center_x) < img.shape[1] * 0.2
            
            return {
                "face_detected": True,
                "smile_detected": has_smile,
                "eyes_open": eyes_open,
                "is_blurry": is_blurry,
                "is_well_lit": is_well_lit,
                "is_centered": is_centered,
                "face_count": len(faces),
                "blur_score": blur_score,
                "brightness": brightness,
                "validation_score": self._calculate_opencv_score(has_smile, eyes_open, not is_blurry, is_well_lit, is_centered),
                "method": "opencv"
            }
            
        except Exception as e:
            return {"error": f"OpenCV validation failed: {str(e)}"}
    
    def validate_photo(self, image_data: bytes, preferred_method: str = "auto") -> Dict[str, Any]:
        """
        Main validation method that tries different APIs in order of preference
        """
        results = {"timestamp": "2025-01-05", "validations": []}
        
        if preferred_method == "azure" or preferred_method == "auto":
            azure_result = self.validate_photo_azure(image_data)
            results["validations"].append({"method": "azure", "result": azure_result})
            if "error" not in azure_result:
                results["primary_result"] = azure_result
                return results
        
        if preferred_method == "aws" or preferred_method == "auto":
            aws_result = self.validate_photo_aws(image_data)
            results["validations"].append({"method": "aws", "result": aws_result})
            if "error" not in aws_result:
                results["primary_result"] = aws_result
                return results
        
        # Fallback to OpenCV (always available)
        opencv_result = self.validate_photo_opencv(image_data)
        results["validations"].append({"method": "opencv", "result": opencv_result})
        results["primary_result"] = opencv_result
        
        return results
    
    def _process_azure_response(self, face_data: Dict) -> Dict[str, Any]:
        """Process Azure Face API response"""
        attributes = face_data.get('faceAttributes', {})
        emotion = attributes.get('emotion', {})
        
        # Calculate overall happiness/smile score
        happiness_score = emotion.get('happiness', 0)
        smile_score = attributes.get('smile', 0)
        
        return {
            "face_detected": True,
            "smile_detected": smile_score > 0.5,
            "happiness_score": happiness_score,
            "smile_score": smile_score,
            "age": attributes.get('age'),
            "gender": attributes.get('gender'),
            "emotions": emotion,
            "glasses": attributes.get('glasses'),
            "blur": attributes.get('blur', {}).get('blurLevel'),
            "exposure": attributes.get('exposure', {}).get('exposureLevel'),
            "noise": attributes.get('noise', {}).get('noiseLevel'),
            "head_pose": attributes.get('headPose', {}),
            "validation_score": self._calculate_azure_score(smile_score, happiness_score, attributes),
            "method": "azure"
        }
    
    def _process_aws_response(self, face_data: Dict) -> Dict[str, Any]:
        """Process AWS Rekognition response"""
        emotions = {e['Type']: e['Confidence'] for e in face_data.get('Emotions', [])}
        
        happiness_score = emotions.get('HAPPY', 0) / 100
        smile_detected = face_data.get('Smile', {}).get('Value', False)
        
        return {
            "face_detected": True,
            "smile_detected": smile_detected,
            "happiness_score": happiness_score,
            "smile_confidence": face_data.get('Smile', {}).get('Confidence', 0),
            "age_range": face_data.get('AgeRange', {}),
            "gender": face_data.get('Gender', {}),
            "emotions": emotions,
            "eyeglasses": face_data.get('Eyeglasses', {}).get('Value', False),
            "sunglasses": face_data.get('Sunglasses', {}).get('Value', False),
            "eyes_open": face_data.get('EyesOpen', {}).get('Value', True),
            "mouth_open": face_data.get('MouthOpen', {}).get('Value', False),
            "pose": face_data.get('Pose', {}),
            "quality": face_data.get('Quality', {}),
            "validation_score": self._calculate_aws_score(smile_detected, happiness_score, face_data),
            "method": "aws"
        }
    
    def _calculate_azure_score(self, smile_score: float, happiness_score: float, attributes: Dict) -> float:
        """Calculate validation score for Azure results"""
        score = 0
        
        # Smile/happiness (40% weight)
        if smile_score > 0.7 or happiness_score > 0.7:
            score += 40
        elif smile_score > 0.4 or happiness_score > 0.4:
            score += 25
        
        # Image quality (30% weight)
        blur_level = attributes.get('blur', {}).get('blurLevel', 'medium')
        if blur_level == 'low':
            score += 30
        elif blur_level == 'medium':
            score += 20
        
        # Exposure (15% weight)
        exposure_level = attributes.get('exposure', {}).get('exposureLevel', 'goodExposure')
        if exposure_level == 'goodExposure':
            score += 15
        
        # Head pose (15% weight)
        head_pose = attributes.get('headPose', {})
        if abs(head_pose.get('yaw', 0)) < 15 and abs(head_pose.get('pitch', 0)) < 15:
            score += 15
        
        return min(score, 100)
    
    def _calculate_aws_score(self, smile_detected: bool, happiness_score: float, face_data: Dict) -> float:
        """Calculate validation score for AWS results"""
        score = 0
        
        # Smile/happiness (40% weight)
        if smile_detected and happiness_score > 0.7:
            score += 40
        elif smile_detected or happiness_score > 0.4:
            score += 25
        
        # Eyes open (20% weight)
        if face_data.get('EyesOpen', {}).get('Value', True):
            score += 20
        
        # Image quality (25% weight)
        quality = face_data.get('Quality', {})
        brightness = quality.get('Brightness', 50)
        sharpness = quality.get('Sharpness', 50)
        
        if brightness > 30 and sharpness > 30:
            score += 25
        elif brightness > 20 and sharpness > 20:
            score += 15
        
        # Pose (15% weight)
        pose = face_data.get('Pose', {})
        if abs(pose.get('Yaw', 0)) < 15 and abs(pose.get('Pitch', 0)) < 15:
            score += 15
        
        return min(score, 100)
    
    def _calculate_opencv_score(self, has_smile: bool, eyes_open: bool, not_blurry: bool, well_lit: bool, centered: bool) -> float:
        """Calculate validation score for OpenCV results"""
        score = 0
        
        if has_smile:
            score += 30
        if eyes_open:
            score += 25
        if not_blurry:
            score += 20
        if well_lit:
            score += 15
        if centered:
            score += 10
        
        return score
