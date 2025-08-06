import React, { useState, useRef, useCallback } from 'react';
import { FaCamera, FaUpload, FaCheck, FaTimes, FaSpinner, FaEye, FaSmile, FaImage, FaExclamationTriangle } from 'react-icons/fa';

interface ValidationResult {
  face_detected: boolean;
  smile_detected: boolean;
  eyes_open: boolean;
  validation_score: number;
  method: string;
  recommendations: string[];
  is_blurry?: boolean;
  is_well_lit?: boolean;
  is_centered?: boolean;
  happiness_score?: number;
  emotions?: Record<string, number>;
}

interface FaceValidationResponse {
  primary_result: ValidationResult;
  overall_status: {
    is_valid: boolean;
    score: number;
    status: string;
    recommendations: string[];
  };
  validations: Array<{
    method: string;
    result: ValidationResult;
  }>;
}

interface Props {
  userId?: number;
  onValidationComplete?: (result: FaceValidationResponse) => void;
  validationMethod?: 'auto' | 'azure' | 'aws' | 'opencv';
}

const EnhancedFaceValidation: React.FC<Props> = ({ 
  userId, 
  onValidationComplete, 
  validationMethod = 'auto' 
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<FaceValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setValidationResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
            setSelectedImage(file);
            setImagePreview(canvas.toDataURL());
            stopCamera();
            setError(null);
            setValidationResult(null);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const validatePhoto = async () => {
    if (!selectedImage) {
      setError('Please select or capture a photo first.');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('method', validationMethod);
      if (userId) {
        formData.append('user_id', userId.toString());
      }

      const response = await fetch('http://localhost:8000/api/face/validate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const result: FaceValidationResponse = await response.json();
      setValidationResult(result);
      
      if (onValidationComplete) {
        onValidationComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enhanced Face Validation</h2>
        <p className="text-gray-600">
          Upload or capture a photo for advanced face validation including smile detection, 
          image quality analysis, and liveness verification.
        </p>
      </div>

      {/* Photo Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Upload Photo</h3>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
            <p className="text-gray-600">Click to upload a photo</p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP (max 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Camera Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Take Photo</h3>
          <div className="text-center">
            {!showCamera ? (
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <FaCamera /> Start Camera
              </button>
            ) : (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-sm mx-auto rounded-lg border"
                />
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={capturePhoto}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Photo</h3>
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt="Selected photo"
              className="max-w-sm max-h-64 object-contain rounded-lg border"
            />
          </div>
        </div>
      )}

      {/* Validation Button */}
      {selectedImage && (
        <div className="text-center mb-6">
          <button
            onClick={validatePhoto}
            disabled={isValidating}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isValidating ? (
              <>
                <FaSpinner className="animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <FaEye />
                Validate Photo
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Validation Results */}
      {validationResult && (
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Validation Results</h3>
              <div className={`px-4 py-2 rounded-full ${getScoreBackground(validationResult.overall_status.score)}`}>
                <span className={`font-bold ${getScoreColor(validationResult.overall_status.score)}`}>
                  {validationResult.overall_status.score}% Score
                </span>
              </div>
            </div>

            {/* Overall Status */}
            <div className="mb-6">
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                validationResult.overall_status.is_valid ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {validationResult.overall_status.is_valid ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
                <span className={`font-semibold ${
                  validationResult.overall_status.is_valid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.overall_status.status}
                </span>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Detection Results</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Face Detected:</span>
                  <div className="flex items-center gap-1">
                    {validationResult.primary_result.face_detected ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                    <span>{validationResult.primary_result.face_detected ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Smile Detected:</span>
                  <div className="flex items-center gap-1">
                    {validationResult.primary_result.smile_detected ? (
                      <FaSmile className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                    <span>{validationResult.primary_result.smile_detected ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Eyes Open:</span>
                  <div className="flex items-center gap-1">
                    {validationResult.primary_result.eyes_open ? (
                      <FaEye className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                    <span>{validationResult.primary_result.eyes_open ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Image Quality</h4>
                
                {validationResult.primary_result.is_blurry !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Image Clarity:</span>
                    <div className="flex items-center gap-1">
                      {!validationResult.primary_result.is_blurry ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-red-600" />
                      )}
                      <span>{!validationResult.primary_result.is_blurry ? 'Clear' : 'Blurry'}</span>
                    </div>
                  </div>
                )}

                {validationResult.primary_result.is_well_lit !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lighting:</span>
                    <div className="flex items-center gap-1">
                      {validationResult.primary_result.is_well_lit ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-red-600" />
                      )}
                      <span>{validationResult.primary_result.is_well_lit ? 'Good' : 'Poor'}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Method Used:</span>
                  <span className="capitalize font-medium">{validationResult.primary_result.method}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {validationResult.overall_status.recommendations.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {validationResult.overall_status.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-700 text-sm">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default EnhancedFaceValidation;
