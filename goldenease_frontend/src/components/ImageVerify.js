// this code is working perfectly fine 
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../assets/images/auth-idle.svg";
import AuthFace from "../assets/images/auth-face.svg";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function ImageLogin() {
  const [tempAccount, setTempAccount] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [conditions, setConditions] = useState({
    isSmiling: false,
    leftEarVisible: false,
    rightEarVisible: false,
    eyesOpen: false,
    whiteBackground: false,
    shouldersIncluded: false,
    teethNotVisible: false,
  });

  const imageRef = useRef();
  const canvasRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  if (!location?.state) {
    return <Navigate to="/" replace={true} />;
  }

  // Load face-api.js models (including expression net)
  const loadModels = async () => {
    const uri = "/models";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
    await faceapi.nets.faceExpressionNet.loadFromUri(uri);
    setModelsLoaded(true);
  };

  // Set account info from router state
  useEffect(() => {
    setTempAccount(location?.state?.account);
  }, [location]);

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, []);

  // Helper: Euclidean distance between two points
  const getDistance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  // Helper: Calculate Eye Aspect Ratio (EAR)
  const calculateEAR = (eye) => {
    if (eye.length < 6) return 0;
    const [p1, p2, p3, p4, p5, p6] = eye;
    const vertical1 = getDistance(p2, p6);
    const vertical2 = getDistance(p3, p5);
    const horizontal = getDistance(p1, p4);
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  // Helper: Check if background is white on the uploaded image
  const isBackgroundWhite = (img, faceBox) => {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = img.width;
    offCanvas.height = img.height;
    const ctx = offCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    let totalR = 0, totalG = 0, totalB = 0, count = 0;
    const sampleStep = 10;
    for (let y = 0; y < img.height; y += sampleStep) {
      for (let x = 0; x < img.width; x += sampleStep) {
        if (
          x < faceBox.x ||
          x > faceBox.x + faceBox.width ||
          y < faceBox.y ||
          y > faceBox.y + faceBox.height
        ) {
          const index = (y * img.width + x) * 4;
          totalR += data[index];
          totalG += data[index + 1];
          totalB += data[index + 2];
          count++;
        }
      }
    }
    const avgR = totalR / count;
    const avgG = totalG / count;
    const avgB = totalB / count;
    return avgR > 200 && avgG > 200 && avgB > 200;
  };

  // Function to process the uploaded image
  const processImage = async () => {
    if (!modelsLoaded || !uploadedImage) return;

    // Clear previous drawings
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Run face detection on the uploaded image
    const detection = await faceapi
      .detectSingleFace(uploadedImage)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptor();

    if (!detection) {
      setLoginResult("FAILED: No face detected.");
      return;
    }

    // Resize canvas to match image dimensions
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;

    // Draw detection results
    const resizedDetections = faceapi.resizeResults(detection, {
      width: uploadedImage.width,
      height: uploadedImage.height,
    });
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    const { detection: { box: faceBox }, landmarks, expressions } = detection;

    // Check smile using expression analysis
    const isSmiling = expressions.happy > 0.5;

    // For ears, use jawline endpoints relative to face box
    const jawline = landmarks.getJawOutline();
    const leftJaw = jawline[0];
    const rightJaw = jawline[jawline.length - 1];
    // Left ear visible if the left jaw point is within the left 15% of the face box width.
    const leftEarVisible = (leftJaw.x - faceBox.x) < faceBox.width * 0.15;
    // Right ear visible if the right jaw point is within the right 15% of the face box width.
    const rightEarVisible = ((faceBox.x + faceBox.width) - rightJaw.x) < faceBox.width * 0.15;

    // Check eyes open condition
    const leftEAR = calculateEAR(landmarks.getLeftEye());
    const rightEAR = calculateEAR(landmarks.getRightEye());
    const eyesOpen = leftEAR > 0.2 && rightEAR > 0.2;

    // Check for white background
    const whiteBackground = isBackgroundWhite(uploadedImage, faceBox);

    // Check if shoulders (or upper body) are included.
    const gapBelowFace = uploadedImage.height - (faceBox.y + faceBox.height);
    const shouldersIncluded = gapBelowFace > faceBox.height * 0.5;

    // Check that teeth are not visible using mouth landmarks.
    // Calculate the vertical span of the mouth.
    const mouth = landmarks.getMouth();
    const mouthYs = mouth.map((p) => p.y);
    const mouthOpen = Math.max(...mouthYs) - Math.min(...mouthYs);
    // If mouthOpen is less than 10% of face height, we assume teeth are not visible.
    const teethNotVisible = mouthOpen < faceBox.height * 0.1;

    // Update conditions state to show status on the UI
    setConditions({
      isSmiling,
      leftEarVisible,
      rightEarVisible,
      eyesOpen,
      whiteBackground,
      shouldersIncluded,
      teethNotVisible,
    });

    // Overall condition: all checks must pass.
    if (
      isSmiling &&
      leftEarVisible &&
      rightEarVisible &&
      eyesOpen &&
      whiteBackground &&
      shouldersIncluded &&
      teethNotVisible
    ) {
      setLoginResult("SUCCESS");
      localStorage.setItem(
        "faceAuth",
        JSON.stringify({ status: true, account: tempAccount })
      );
      setTimeout(() => navigate("/protected", { replace: true }), 3000);
    } else {
      const reasons = [];
      if (!isSmiling) reasons.push("Smile Detected");
      if (!leftEarVisible) reasons.push("Left Ear Not Visible");
      if (!rightEarVisible) reasons.push("Right Ear Not Visible");
      if (!eyesOpen) reasons.push("Eyes Open");
      if (!whiteBackground) reasons.push("White Background");
      if (!shouldersIncluded) reasons.push("Photo includes shoulders");
      if (!teethNotVisible) reasons.push("Teeth should not be visible");
      setLoginResult("FAILED: " + reasons.join(", "));
    }

    if (!faceApiLoaded) setFaceApiLoaded(true);
  };

  // Handle file input change
  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setUploadedImage(img);
      };
    }
  };

  // Run face detection when the uploaded image is ready
  useEffect(() => {
    if (uploadedImage) {
      processImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImage, modelsLoaded]);

  // Determine missing conditions for UI display
  const missingConditions = [];
  if (!conditions.isSmiling) missingConditions.push("Smile Detected");
  if (!conditions.leftEarVisible) missingConditions.push("Left Ear Not Visible");
  if (!conditions.rightEarVisible) missingConditions.push("Right Ear Not Visible");
  if (!conditions.eyesOpen) missingConditions.push("Eyes Open");
  if (!conditions.whiteBackground) missingConditions.push("White Background");
  if (!conditions.shouldersIncluded) missingConditions.push("Photo includes shoulders");
  if (!conditions.teethNotVisible) missingConditions.push("Teeth should not be visible");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 max-w-xl mx-auto p-4">
      <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900">
        Upload Your Image for Face Authentication
      </h2>

      <div className="w-full flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border border-gray-300 p-2 rounded"
        />
        {!uploadedImage && (
          <img
            alt="Face scan illustration"
            src={AuthFace}
            className="object-cover h-[272px]"
          />
        )}
        {uploadedImage && (
          <div className="relative">
            <img
              ref={imageRef}
              src={uploadedImage.src}
              alt="Uploaded face"
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>
        )}
      </div>

      {/* Show checkboxes for each validation criterion */}
      <div className="w-full max-w-md border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Validation Criteria</h3>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.isSmiling} />
          <label>Smile Detected</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.leftEarVisible} />
          <label>Left Ear Visible</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.rightEarVisible} />
          <label>Right Ear Visible</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.eyesOpen} />
          <label>Eyes Open</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.whiteBackground} />
          <label>White Background</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.shouldersIncluded} />
          <label>Photo includes shoulders</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={conditions.teethNotVisible} />
          <label>Teeth not visible</label>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4">
        {Object.values(conditions).every(Boolean) ? (
          <p className="text-green-600 font-bold">
            All conditions are fulfilled.
          </p>
        ) : (
          <div className="text-rose-600">
            <p className="font-bold">Missing Conditions:</p>
            <ul className="list-disc ml-5">
              {missingConditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4">
        {loginResult === "PENDING" && (
          <p className="text-gray-600">Awaiting image processing...</p>
        )}
        {loginResult === "SUCCESS" && (
          <p className="text-green-600">
            Face recognized! Redirecting to your account...
          </p>
        )}
        {loginResult.startsWith("FAILED") && (
          <p className="text-rose-600">{loginResult}</p>
        )}
      </div>

      {!modelsLoaded && (
        <div className="mt-4 flex flex-col items-center">
          <img
            alt="Loading models illustration"
            src={AuthIdle}
            className="object-cover h-[272px]"
          />
          <p className="text-gray-600 mt-2">
            Please wait while models are loading...
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageLogin;
