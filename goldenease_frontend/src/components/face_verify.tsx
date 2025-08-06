// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";
// import loader from "../assets/loader_.gif";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { FaCheck, FaEye, FaDownload, FaArrowLeft } from "react-icons/fa6";
// import { ImCross } from "react-icons/im";
// import { Camera, House } from "lucide-react";
// import { BsPassport } from "react-icons/bs";
// import { MdOutlineChurch } from "react-icons/md";

// // Interfaces
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   dob: string;
//   contact_number: string;
//   address: string;
//   gender: string;
//   image_url: string;
//   role: string;
// }

// interface VerificationDetail {
//   document_type: string;
//   is_valid: boolean;
//   message: string;
// }

// interface VerificationStatus {
//   message: string;
//   overall_status: 'approved' | 'rejected' | 'pending';
//   results: VerificationDetail[];
// }

// interface Conditions {
//   isSmiling: boolean;
//   leftEarVisible: boolean;
//   rightEarVisible: boolean;
//   eyesOpen: boolean;
//   whiteBackground: boolean;
//   shouldersIncluded: boolean;
//   teethNotVisible: boolean;
// }

// const FaceVerify: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>("photo-verification");
//   const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
//   const [faceApiLoaded, setFaceApiLoaded] = useState<boolean>(false);
//   const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [verificationStatus, setVerificationStatus] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isValidating, setIsValidating] = useState<boolean>(false);
//   const [conditions, setConditions] = useState<Conditions>({
//     isSmiling: false,
//     leftEarVisible: false,
//     rightEarVisible: false,
//     eyesOpen: false,
//     whiteBackground: false,
//     shouldersIncluded: false,
//     teethNotVisible: false,
//   });

//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const imageRef = useRef<HTMLImageElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const tabs = [
//     { id: "photo-verification", label: "Photo Verification", icon: <Camera size={18} /> },
//     { id: "passport", label: "Passport", icon: <BsPassport size={18} /> },
//     { id: "marriage_certificate", label: "Marriage Certificate", icon: <MdOutlineChurch size={18} /> },
//     { id: "emirates_id", label: "Emirates ID", icon: <House size={18} /> },
//     { id: "property_ownership", label: "Property Ownership", icon: <House size={18} /> },
//   ];

//   // Load face-api.js models
//   const loadModels = async () => {
//     const uri = "/models";
//     try {
//       await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
//       await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
//       await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
//       await faceapi.nets.faceExpressionNet.loadFromUri(uri);
//       setModelsLoaded(true);
//     } catch (error) {
//       console.error("Model loading error:", error);
//     }
//   };

//   useEffect(() => {
//     loadModels();

//     const fetchUserData = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         // Fetch user details
//         const userResponse = await fetch(`http://localhost:8000/admin/users/${id}`);
//         if (!userResponse.ok) throw new Error('Failed to fetch user data');
//         const userData = await userResponse.json();
//         setUser(userData);

//         // Set image for face detection
//         if (userData.image_url) {
//           const img = new Image();
//           img.crossOrigin = "anonymous";
          
//           // Check if the URL is absolute or relative
//           if (userData.image_url.startsWith('http')) {
//             img.src = userData.image_url;
//           } else {
//             img.src = `http://localhost:8000${userData.image_url}`;
//           }

//           img.onload = () => {
//             setUploadedImage(img);
//             setLoading(false);
//           };
//         }

//         // Get verification status from navigation
//         if (location.state?.verificationStatus) {
//           setVerificationStatus(location.state.verificationStatus);
//         }

//       } catch (error) {
//         console.error("Error loading user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [id, location.state]);

//   // Helper functions for face detection
//   const getDistance = (p1: faceapi.Point, p2: faceapi.Point): number => {
//     return Math.hypot(p2.x - p1.x, p2.y - p1.y);
//   };

//   const calculateEAR = (eye: faceapi.Point[]): number => {
//     if (eye.length < 6) return 0;
//     const [p1, p2, p3, p4, p5, p6] = eye;
//     const vertical1 = getDistance(p2, p6);
//     const vertical2 = getDistance(p3, p5);
//     const horizontal = getDistance(p1, p4);
//     return (vertical1 + vertical2) / (2.0 * horizontal);
//   };

//   const isBackgroundWhite = (img: HTMLImageElement, faceBox: faceapi.Box) => {
//     const offCanvas = document.createElement("canvas");
//     offCanvas.width = img.width;
//     offCanvas.height = img.height;
//     const ctx = offCanvas.getContext("2d");
//     if (!ctx) return false;
//     ctx.drawImage(img, 0, 0);
//     const imageData = ctx.getImageData(0, 0, img.width, img.height);
//     const data = imageData.data;
//     let totalR = 0, totalG = 0, totalB = 0, count = 0;
//     const sampleStep = 10;
//     for (let y = 0; y < img.height; y += sampleStep) {
//       for (let x = 0; x < img.width; x += sampleStep) {
//         if (
//           x < faceBox.x ||
//           x > faceBox.x + faceBox.width ||
//           y < faceBox.y ||
//           y > faceBox.y + faceBox.height
//         ) {
//           const index = (y * img.width + x) * 4;
//           totalR += data[index];
//           totalG += data[index + 1];
//           totalB += data[index + 2];
//           count++;
//         }
//       }
//     }
//     const avgR = totalR / count;
//     const avgG = totalG / count;
//     const avgB = totalB / count;
//     return avgR > 200 && avgG > 200 && avgB > 200;
//   };

//   const processImage = async () => {
//     if (!modelsLoaded || !uploadedImage) return;

//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const detection = await faceapi
//       .detectSingleFace(uploadedImage)
//       .withFaceLandmarks()
//       .withFaceExpressions()
//       .withFaceDescriptor();

//     if (!detection) return;

//     canvas.width = uploadedImage.width;
//     canvas.height = uploadedImage.height;

//     const resizedDetections = faceapi.resizeResults(detection, {
//       width: uploadedImage.width,
//       height: uploadedImage.height,
//     });
//     faceapi.draw.drawDetections(canvas, resizedDetections);
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

//     const { box: faceBox } = detection.detection;
//     const landmarks = detection.landmarks;
//     const expressions = detection.expressions;

//     const isSmiling = expressions.happy > 0.5;
//     const jawline = landmarks.getJawOutline();
//     const leftJaw = jawline[0];
//     const rightJaw = jawline[jawline.length - 1];
//     const leftEarVisible = leftJaw.x - faceBox.x < faceBox.width * 0.15;
//     const rightEarVisible = faceBox.x + faceBox.width - rightJaw.x < faceBox.width * 0.15;
//     const leftEAR = calculateEAR(landmarks.getLeftEye());
//     const rightEAR = calculateEAR(landmarks.getRightEye());
//     const eyesOpen = leftEAR > 0.2 && rightEAR > 0.2;
//     const whiteBackground = isBackgroundWhite(uploadedImage, faceBox);
//     const gapBelowFace = uploadedImage.height - (faceBox.y + faceBox.height);
//     const shouldersIncluded = gapBelowFace > faceBox.height * 0.5;
//     const mouth = landmarks.getMouth();
//     const mouthYs = mouth.map((p) => p.y);
//     const mouthOpen = Math.max(...mouthYs) - Math.min(...mouthYs);
//     const teethNotVisible = mouthOpen < faceBox.height * 0.15;

//     setConditions({
//       isSmiling,
//       leftEarVisible,
//       rightEarVisible,
//       eyesOpen,
//       whiteBackground,
//       shouldersIncluded,
//       teethNotVisible,
//     });

//     if (!faceApiLoaded) setFaceApiLoaded(true);
//   };

//   useEffect(() => {
//     if (uploadedImage) {
//       processImage();
//     }
//   }, [uploadedImage, modelsLoaded]);

//   const handleTabClick = async (tabId: string) => {
//     setActiveTab(tabId);

//     // Only validate documents when clicking on a document tab (not photo verification)
//     // that is not the photo verification tab.
//     if (tabId !== 'photo-verification') {
//       try {
//         setIsValidating(true);
//         const response = await fetch(`http://localhost:8000/admin/validate/${id}`);

//         if (!response.ok) {
//           throw new Error('Document validation failed');
//         }

//         const validationData = await response.json();
//         setVerificationStatus(validationData);

//       } catch (error) {
//         console.error('Error validating document:', error);
//       } finally {
//         setIsValidating(false);
//       }
//     }
//   };

//   // Render Photo Verification Tab
//   const renderPhotoVerification = () => (
//     <div className="space-y-6">
//       <button
//         onClick={() => setActiveTab("")}
//         className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
//       >
//         <FaArrowLeft /> Back
//       </button>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="block text-gray-600 font-medium">Full Name</label>
//               <input
//                 type="text"
//                 defaultValue={user?.name}
//                 className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
//                 placeholder="Enter Full Name"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-gray-600 font-medium">Date of Birth</label>
//               <input
//                 type="date"
//                 defaultValue={user?.dob}
//                 className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="block text-gray-600 font-medium">E-mail ID</label>
//               <input
//                 type="email"
//                 defaultValue={user?.email}
//                 className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
//                 placeholder="Enter E-mail ID"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-gray-600 font-medium">Contact Number</label>
//               <input
//                 type="tel"
//                 defaultValue={user?.contact_number}
//                 className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
//                 placeholder="Enter Contact Number"
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="block text-gray-600 font-medium">Address</label>
//               <input
//                 type="text"
//                 defaultValue={user?.address}
//                 className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
//                 placeholder="Enter Address"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-gray-600 font-medium">Gender</label>
//               <select
//                 defaultValue={user?.gender}
//                 className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="block text-gray-600 font-medium">Role</label>
//             <input
//               type="text"
//               defaultValue={user?.role}
//               className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
//               placeholder="Enter Role"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col items-center space-y-6">
//           {uploadedImage && (
//             <div className="relative w-full max-w-md h-[272px] overflow-hidden rounded-lg">
//               <img
//                 ref={imageRef}
//                 src={uploadedImage.src}
//                 alt="Uploaded face"
//                 className="w-full h-full object-contain"
//               />
//               <canvas ref={canvasRef} className="absolute top-0 left-0 hidden" />
//             </div>
//           )}
//           <div className="w-full max-w-md border p-4 rounded">
//             <h3 className="text-lg font-semibold mb-2">Validation Criteria</h3>
//             {modelsLoaded ? (
//               <div className="space-y-2">
//                 {[
//                   { key: 'isSmiling', label: 'Smile Detected' },
//                   { key: 'leftEarVisible', label: 'Left Ear Visible' },
//                   { key: 'rightEarVisible', label: 'Right Ear Visible' },
//                   { key: 'eyesOpen', label: 'Eyes Open' },
//                   { key: 'whiteBackground', label: 'White Background' },
//                   { key: 'shouldersIncluded', label: 'Photo includes shoulders' },
//                   { key: 'teethNotVisible', label: 'Teeth should not be visible' },
//                 ].map(({ key, label }) => (
//                   <div key={key} className="flex items-center gap-2">
//                     <label
//                       className={`${
//                         conditions[key as keyof Conditions] ? "text-green-600" : "text-red-600"
//                       } flex items-center gap-1`}
//                     >
//                       {conditions[key as keyof Conditions] ? <FaCheck /> : <ImCross />} {label}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="mt-4 flex flex-col items-center">
//                 <img alt="Loading models illustration" src={loader} className="object-cover h-[272px]" />
//                 <p className="text-gray-600 mt-2">Please wait while verifying the conditions on photo...</p>
//               </div>
//             )}
//             <div className="mt-4">
//               {Object.values(conditions).every(Boolean) ? (
//                 <p className="text-green-600 font-bold">All conditions are fulfilled.</p>
//               ) : (
//                 <div className="text-rose-600 font-bold">{modelsLoaded ? "Photo Rejected" : ""}</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const DocumentValidationAnimation = () => {
//     const [dots, setDots] = useState('');
//     const [currentStep, setCurrentStep] = useState(0);
    
//     const validationSteps = [
//       "🔍 Scanning document structure...",
//       "🤖 Running OCR analysis...", 
//       "📋 Extracting document data...",
//       "✅ Validating information...",
//       "🔒 Verifying authenticity..."
//     ];

//     useEffect(() => {
//       // Animate dots
//       const dotsInterval = setInterval(() => {
//         setDots(prev => prev.length >= 3 ? '' : prev + '.');
//       }, 500);

//       // Animate steps
//       const stepInterval = setInterval(() => {
//         setCurrentStep(prev => (prev + 1) % validationSteps.length);
//       }, 1200);

//       return () => {
//         clearInterval(dotsInterval);
//         clearInterval(stepInterval);
//       };
//     }, []);

//     return (
//       <div className="flex flex-col items-center justify-center min-h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
//         <div className="text-center space-y-6">
//           {/* Robot/AI Icon */}
//           <div className="relative">
//             <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
//               <div className="text-3xl text-white">🤖</div>
//             </div>
//             <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-blue-400 animate-spin opacity-30"></div>
//           </div>

//           {/* Main Title */}
//           <div className="space-y-2">
//             <h3 className="text-2xl font-bold text-gray-800">
//               🔍 Document Validation in Progress{dots}
//             </h3>
//             <p className="text-gray-600">AI is analyzing your document</p>
//           </div>

//           {/* Current Step */}
//           <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500 min-h-16 flex items-center">
//             <div className="text-left w-full">
//               <div className="text-sm text-gray-500 mb-1">Current Process:</div>
//               <div className="text-lg font-medium text-gray-800">
//                 {validationSteps[currentStep]}
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full max-w-md">
//             <div className="flex justify-between text-xs text-gray-500 mb-2">
//               <span>Processing</span>
//               <span>{Math.round(((currentStep + 1) / validationSteps.length) * 100)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
//                 style={{ width: `${((currentStep + 1) / validationSteps.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Animated Data Points */}
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div className="bg-white rounded-lg p-3 shadow-sm">
//               <div className="text-2xl animate-bounce">📄</div>
//               <div className="text-xs text-gray-600 mt-1">Document</div>
//             </div>
//             <div className="bg-white rounded-lg p-3 shadow-sm">
//               <div className="text-2xl animate-pulse">🔍</div>
//               <div className="text-xs text-gray-600 mt-1">Scanning</div>
//             </div>
//             <div className="bg-white rounded-lg p-3 shadow-sm">
//               <div className="text-2xl animate-spin">⚙️</div>
//               <div className="text-xs text-gray-600 mt-1">Processing</div>
//             </div>
//           </div>

//           {/* Status Messages */}
//           <div className="text-sm text-gray-500 space-y-1">
//             <div className="flex items-center justify-center space-x-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span>AI Engine: Active</span>
//             </div>
//             <div className="flex items-center justify-center space-x-2">
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//               <span>OCR Module: Running</span>
//             </div>
//             <div className="flex items-center justify-center space-x-2">
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//               <span>Validation Engine: Processing</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderDocument = (docType: string, title: string) => {
//     if (isValidating) return <DocumentValidationAnimation />;
//     if (!verificationStatus || !verificationStatus.results) return <div className="text-center p-10">No verification data found. Please click a document tab to validate.</div>;

//     const docData = verificationStatus.results.find((r: any) => r.document_type === docType);

//     if (!docData) return <div className="text-center p-10">{title} data not available.</div>;

//     const isPdf = docData.file_path && docData.file_path.toLowerCase().endsWith('.pdf');
//     // Use the file path directly from backend since uploads folder uses user_1 format
//     const fileUrl = docData.file_path ? `http://localhost:8000/${docData.file_path.replace(/\\/g, '/')}` : '';

//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
//           <p className="text-gray-600">Required for visa processing. View {title.toLowerCase()} document information and validity status.</p>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Document Image */}
//           <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center min-h-96">
//             {docData.file_path ? (
//               isPdf ? (
//                 <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
//                   <div className="text-6xl text-gray-400 mb-4">📄</div>
//                   <p className="text-gray-500 font-medium">PDF Document</p>
//                   <p className="text-sm text-gray-400 mt-2">Click "View Full Size" to open</p>
//                 </div>
//               ) : (
//                 <img 
//                   src={fileUrl}
//                   alt={`${title} Document`}
//                   className="max-w-full max-h-80 rounded-lg shadow-md object-contain"
//                 />
//               )
//             ) : (
//               <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
//                 <div className="text-6xl text-gray-400 mb-4">📄</div>
//                 <p className="text-gray-500 font-medium">Document Image</p>
//                 <p className="text-sm text-gray-400 mt-2">No image available</p>
//               </div>
//             )}
            
//             {/* Action Buttons */}
//             <div className="flex gap-3 mt-6">
//               <button 
//                 onClick={() => fileUrl && window.open(fileUrl, '_blank')}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 disabled={!fileUrl}
//               >
//                 <FaEye size={16} />
//                 View Full Size
//               </button>
//               <a
//                 href={fileUrl}
//                 download
//                 className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 <FaDownload size={16} />
//                 Download
//               </a>
//             </div>
//           </div>

//           {/* Right Column - Document Information */}
//           <div className="space-y-6">
//             {/* Document Status */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Document Status</h3>
//                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
//                   docData.is_valid 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {docData.is_valid ? <FaCheck size={14} /> : <ImCross size={14} />} {docData.is_valid ? 'VALID' : 'INVALID'}
//                 </div>
//               </div>
              
//               {/* Document Details */}
//               {docType === 'property_document' ? (
//                 <div className="space-y-4">
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Document Number:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.document_number || 'DLD-2021-001234'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Holder Name:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.holder_name || user?.name || 'John Smith'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Issued Date:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.issued_date || '5/20/2021'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Expiry Date:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.expiry_date || 'N/A'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Issuer:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.issuer || 'Dubai Land Department'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Property Type:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.property_type || 'Apartment'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Property Address:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.property_address || '123 Main St, Dubai'}
//                     </span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Document Number:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.document_number || 'AE1234567'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Holder Name:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.holder_name || user?.name || 'John Smith'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Issued Date:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.issued_date || '3/15/2019'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-100">
//                     <span className="text-gray-600">Expiry Date:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.expiry_date || '3/15/2029'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Issuer:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.issuer || 'Government of UAE'}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Additional Information */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
//               <div className="space-y-4">
//                 {docType === 'property_document' ? (
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Property Value:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.property_value || 'AED 1,000,000'}
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Nationality:</span>
//                     <span className="font-medium text-gray-900">
//                       {docData.details?.nationality || 'Emirati'}
//                     </span>
//                   </div>
//                 )}
//                 {docData.message && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <p className="text-sm text-blue-800">
//                       <strong>Validation Message:</strong> {docData.message}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderVerificationOverview = () => (
//     <div className="max-w-4xl  mx-auto space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Overview</h2>
//         <p className="text-gray-600">All listed documents are required for visa processing. Please ensure all documents are valid.</p>
//       </div>
//       <div className="bg-white border rounded-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Document Status Summary</h3>
//         {loading ? (
//           <div className="space-y-4">
//             {tabs
//               .filter(tab => tab.id !== 'photo-verification')
//               .map(({ id, label }) => (
//                 <div key={id} className="flex items-center justify-between border-b pb-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-400">{label}</span>
//                   </div>
//                   <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                     Loading...
//                   </span>
//                 </div>
//               ))}
//             <div className="mt-6">
//               <p className="text-gray-600">Loading document statuses. Please wait...</p>
//             </div>
//           </div>
//         ) : verificationStatus ? (
//           <div className="space-y-4">
//             {tabs
//               .filter(tab => tab.id !== 'photo-verification')
//               .map(({ id, label }) => {
//                 const result = verificationStatus.results.find(result => result.document_type === id);
//                 return (
//                   <div key={id} className="flex items-center justify-between border-b pb-2">
//                     <div className="flex items-center gap-2">
//                       {result ? (
//                         <>
//                           {result.is_valid ? (
//                             <FaCheck className="text-green-600" />
//                           ) : (
//                             <ImCross className="text-red-600" />
//                           )}
//                           <span>{label}</span>
//                         </>
//                       ) : (
//                         <>
//                           <ImCross className="text-gray-400" />
//                           <span>{label}</span>
//                         </>
//                       )}
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       result ? (result.is_valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {result ? (result.is_valid ? 'Valid' : 'Invalid') : 'Required for Visa'}
//                     </span>
//                   </div>
//                 );
//               })}
//             <div className="mt-6">
//               <p className="text-gray-600">
//                 Click on a tab to view detailed information. All documents must be valid for visa processing.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {tabs
//               .filter(tab => tab.id !== 'photo-verification')
//               .map(({ id, label }) => (
//                 <div key={id} className="flex items-center justify-between border-b pb-2">
//                   <div className="flex items-center gap-2">
//                     <ImCross className="text-gray-400" />
//                     <span>{label}</span>
//                   </div>
//                   <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                     Required for Visa
//                   </span>
//                 </div>
//               ))}
//             <div className="mt-6">
//               <p className="text-gray-600">No documents found. All listed documents are required for visa processing. Please upload or verify.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderContent = () => {
//     switch (activeTab) {
//       case "photo-verification":
//         return renderPhotoVerification();
//       case "passport":
//         return renderDocument("passport", "Passport");
//       case "emirates_id":
//         return renderDocument("emirates_id", "Emirates ID");
//       case "marriage_certificate":
//         return renderDocument("marriage_certificate", "Marriage Certificate");
//       case "property_ownership":
//         return renderDocument("property_document", "Property Ownership");
//       case "verification-overview":
//         return renderVerificationOverview();
//       default:
//         return renderPhotoVerification();
//     }
//   };

//   return (
//     <div className="w-full max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//       <div className="justify-center items-center">
//       <h1 className="text-2xl font-bold text-blue-700 text-center mb-10">
//         Document Verification Center
//       </h1>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="lg:w-1/4">
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Verification Options</h2>
//             <nav className="flex flex-col space-y-2">
//               {tabs.map((tab) => {
//                 const result = verificationStatus?.results.find(result => result.document_type === tab.id);
//                 const isValid = result?.is_valid;

//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => handleTabClick(tab.id)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
//                       activeTab === tab.id
//                         ? 'bg-blue-100 text-blue-600'
//                         : 'text-gray-600 hover:bg-gray-100'
//                     } relative`}
//                   >
//                     <span className="text-lg">{tab.icon}</span>
//                     <span>{tab.label}</span>
//                     {tab.id !== 'photo-verification' && (
//                       <span className="absolute right-4">
//                         {result ? (
//                           isValid ? (
//                             <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                           ) : (
//                             <span className="w-3 h-3 bg-red-500 rounded-full"></span>
//                           )
//                         ) : (
//                           <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
//                         )}
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>

//         <div className="lg:w-3/4 min-h-96">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceVerify;








import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import loader from "../assets/loader_.gif";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaEye, FaDownload, FaArrowLeft } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { Camera, House } from "lucide-react";
import { BsPassport } from "react-icons/bs";
import { MdOutlineChurch } from "react-icons/md";

// Interfaces
interface User {
  id: number;
  name: string;
  email: string;
  dob: string;
  contact_number: string;
  address: string;
  gender: string;
  image_url: string;
  role: string;
}

interface VerificationDetail {
  document_type: string;
  is_valid: boolean;
  message: string;
}

interface VerificationStatus {
  message: string;
  overall_status: 'approved' | 'rejected' | 'pending';
  results: VerificationDetail[];
}

interface Conditions {
  isSmiling: boolean;
  leftEarVisible: boolean;
  rightEarVisible: boolean;
  eyesOpen: boolean;
  whiteBackground: boolean;
  shouldersIncluded: boolean;
  teethNotVisible: boolean;
}

const FaceVerify: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("photo-verification");
  const [showTabs, setShowTabs] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [conditions, setConditions] = useState<Conditions>({
    isSmiling: false,
    leftEarVisible: false,
    rightEarVisible: false,
    eyesOpen: false,
    whiteBackground: false,
    shouldersIncluded: false,
    teethNotVisible: false,
  });

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tabs = [
    { id: "photo-verification", label: "Photo Verification", icon: <Camera size={18} /> },
    { id: "passport", label: "Passport", icon: <BsPassport size={18} /> },
    { id: "marriage_certificate", label: "Marriage Certificate", icon: <MdOutlineChurch size={18} /> },
    { id: "emirates_id", label: "Emirates ID", icon: <House size={18} /> },
    { id: "property_ownership", label: "Property Ownership", icon: <House size={18} /> },
  ];

  // Load face-api.js models
   const loadModels = async () => {
    const uri = "/models";
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
      await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
      await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
      await faceapi.nets.faceExpressionNet.loadFromUri(uri);
      setModelsLoaded(true);
    } catch (error) {
      console.error("Model loading error:", error);
    }
  };

  useEffect(() => {
    loadModels();

    const fetchUserData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch user details
        const userResponse = await fetch(`http://localhost:8000/admin/users/${id}`);
       
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        console.log(userData)
        setUser(userData);

        // Set image for face detection
        if (userData.image) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          
          // Check if the URL is absolute or relative
          if (userData.image.startsWith('http')) {
            img.src = userData.image;
          } else {
            img.src = `http://localhost:8000${userData.image}`;
          }

          img.onload = () => {
            setUploadedImage(img);
            setLoading(false);
          };
        }

        // Get verification status from navigation
        if (location.state?.verificationStatus) {
          setVerificationStatus(location.state.verificationStatus);
        }

      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, location.state]);

  // Helper functions for face detection
  const getDistance = (p1: faceapi.Point, p2: faceapi.Point): number => {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  };

  const calculateEAR = (eye: faceapi.Point[]): number => {
    if (eye.length < 6) return 0;
    const [p1, p2, p3, p4, p5, p6] = eye;
    const vertical1 = getDistance(p2, p6);
    const vertical2 = getDistance(p3, p5);
    const horizontal = getDistance(p1, p4);
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  const isBackgroundWhite = (img: HTMLImageElement, faceBox: faceapi.Box) => {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = img.width;
    offCanvas.height = img.height;
    const ctx = offCanvas.getContext("2d");
    if (!ctx) return false;
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

  const processImage = async () => {
    if (!modelsLoaded || !uploadedImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const detection = await faceapi
      .detectSingleFace(uploadedImage)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptor();

    if (!detection) return;

    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;

    const resizedDetections = faceapi.resizeResults(detection, {
      width: uploadedImage.width,
      height: uploadedImage.height,
    });
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    const { box: faceBox } = detection.detection;
    const landmarks = detection.landmarks;
    const expressions = detection.expressions;

    const isSmiling = expressions.happy > 0.5;
    const jawline = landmarks.getJawOutline();
    const leftJaw = jawline[0];
    const rightJaw = jawline[jawline.length - 1];
    const leftEarVisible = leftJaw.x - faceBox.x < faceBox.width * 0.15;
    const rightEarVisible = faceBox.x + faceBox.width - rightJaw.x < faceBox.width * 0.15;
    const leftEAR = calculateEAR(landmarks.getLeftEye());
    const rightEAR = calculateEAR(landmarks.getRightEye());
    const eyesOpen = leftEAR > 0.2 && rightEAR > 0.2;
    const whiteBackground = isBackgroundWhite(uploadedImage, faceBox);
    const gapBelowFace = uploadedImage.height - (faceBox.y + faceBox.height);
    const shouldersIncluded = gapBelowFace > faceBox.height * 0.5;
    const mouth = landmarks.getMouth();
    const mouthYs = mouth.map((p) => p.y);
    const mouthOpen = Math.max(...mouthYs) - Math.min(...mouthYs);
    const teethNotVisible = mouthOpen < faceBox.height * 0.15;

    setConditions({
      isSmiling,
      leftEarVisible,
      rightEarVisible,
      eyesOpen,
      whiteBackground,
      shouldersIncluded,
      teethNotVisible,
    });

    if (!faceApiLoaded) setFaceApiLoaded(true);
  };

  useEffect(() => {
    if (uploadedImage) {
      processImage();
    }
  }, [uploadedImage, modelsLoaded]);

  const handleTabClick = async (tabId: string) => {
    setActiveTab(tabId);

    // Only validate documents when clicking on a document tab
    if (tabId !== 'photo-verification') {
      try {
        setIsValidating(true);
        const response = await fetch(`http://localhost:8000/admin/validate/${id}`);

        if (!response.ok) {
          throw new Error('Document validation failed');
        }

        const validationData = await response.json();
        console.log('Validation data received:', validationData);
        console.log('Document results:', validationData.results);
        setVerificationStatus(validationData);

      } catch (error) {
        console.error('Error validating document:', error);
      } finally {
        setIsValidating(false);
      }
    }
  };



  // Render Photo Verification Tab
  const renderPhotoVerification = () => (
    <div className="space-y-6 min-h-screen w-full">
      <button
        onClick={() => setShowTabs(false)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <FaArrowLeft /> Back
      </button>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Photo */}
        <div className="flex-1 flex justify-center">
          {uploadedImage ? (
            <div className="relative w-full max-w-md h-[272px] overflow-hidden rounded-lg">
              <img
                ref={imageRef}
                src={uploadedImage.src}
                alt="Uploaded face"
                className="w-full h-full object-contain"
              />
              <canvas ref={canvasRef} className="absolute top-0 left-0 hidden" />
            </div>
          ) : (
            <div className="w-full max-w-md h-[272px] bg-gray-100 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No image uploaded</p>
            </div>
          )}
        </div>
        {/* Right Side: Validation Criteria and User Details */}
        <div className="flex-1">
          <div className="w-full max-w-md border p-4 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Full Name</p>
                <p className="text-gray-800">{user?.name || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Date of Birth</p>
                <p className="text-gray-800">{user?.dob || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">E-mail ID</p>
                <p className="text-gray-800">{user?.email || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Contact Number</p>
                <p className="text-gray-800">{user?.contact_number || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Address</p>
                <p className="text-gray-800">{user?.address || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Gender</p>
                <p className="text-gray-800">{user?.gender || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Role</p>
                <p className="text-gray-800">{user?.role || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md border p-4 rounded-lg bg-white mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Validation Criteria</h3>
            {modelsLoaded ? (
              <div className="space-y-2">
                {[
                  { key: 'isSmiling', label: 'Smile Detected' },
                  { key: 'leftEarVisible', label: 'Left Ear Visible' },
                  { key: 'rightEarVisible', label: 'Right Ear Visible' },
                  { key: 'eyesOpen', label: 'Eyes Open' },
                  { key: 'whiteBackground', label: 'White Background' },
                  { key: 'shouldersIncluded', label: 'Photo includes shoulders' },
                  { key: 'teethNotVisible', label: 'Teeth should not be visible' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <label
                      className={`${
                        conditions[key as keyof Conditions] ? "text-green-600" : "text-red-600"
                      } flex items-center gap-1`}
                    >
                      {conditions[key as keyof Conditions] ? <FaCheck /> : <ImCross />} {label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center">
                <img alt="Loading models illustration" src={loader} className="object-cover h-[272px]" />
                <p className="text-gray-600 mt-2">Please wait while verifying the conditions on photo...</p>
              </div>
            )}
            <div className="mt-4">
              {Object.values(conditions).every(Boolean) ? (
                <p className="text-green-600 font-bold">All conditions are fulfilled.</p>
              ) : (
                <div className="text-rose-600 font-bold">{modelsLoaded ? "Photo Rejected" : ""}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentValidationAnimation = () => {
    const [dots, setDots] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    
    const validationSteps = [
      "🔍 Scanning document structure...",
      "🤖 Running OCR analysis...", 
      "📋 Extracting document data...",
      "✅ Validating information...",
      "🔒 Verifying authenticity..."
    ];

    useEffect(() => {
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % validationSteps.length);
      }, 1200);

      return () => {
        clearInterval(dotsInterval);
        clearInterval(stepInterval);
      };
    }, []);

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Validation in Progress{dots}</h2>
          <p className="text-gray-600">AI is analyzing your document</p>
        </div>
        <div className="bg-white border rounded-lg p-6 flex flex-col items-center justify-center min-h-96">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
              <div className="text-3xl text-white">🤖</div>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-blue-400 animate-spin opacity-30"></div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500 min-h-16 flex items-center w-full max-w-md">
            <div className="text-left w-full">
              <div className="text-sm text-gray-500 mb-1">Current Process:</div>
              <div className="text-lg font-medium text-gray-800">
                {validationSteps[currentStep]}
              </div>
            </div>
          </div>
          <div className="w-full max-w-md mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Processing</span>
              <span>{Math.round(((currentStep + 1) / validationSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + 1) / validationSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-6">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl animate-bounce">📄</div>
              <div className="text-xs text-gray-600 mt-1">Document</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl animate-pulse">🔍</div>
              <div className="text-xs text-gray-600 mt-1">Scanning</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl animate-spin">⚙️</div>
              <div className="text-xs text-gray-600 mt-1">Processing</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 space-y-1 mt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Engine: Active</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>OCR Module: Running</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Validation Engine: Processing</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocument = (docType: string, title: string) => {
    if (isValidating) return <DocumentValidationAnimation />;
    if (!verificationStatus || !verificationStatus.results) return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">Required for visa processing. View {title.toLowerCase()} document information and validity status.</p>
        </div>
        <div className="text-center bg-gray-50 rounded-lg p-12">
          <div className="text-gray-400 mb-4">
            <BsPassport className="mx-auto text-6xl mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Missing {title}</h3>
          <p className="text-gray-500">This document is required for visa processing. Please upload or verify this document.</p>
        </div>
      </div>
    );

    const docData = verificationStatus.results.find((r: any) => r.document_type === docType);

    if (!docData) return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">Required for visa processing. View {title.toLowerCase()} document information and validity status.</p>
        </div>
        <div className="text-center bg-gray-50 rounded-lg p-12">
          <div className="text-gray-400 mb-4">
            <BsPassport className="mx-auto text-6xl mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Missing {title}</h3>
          <p className="text-gray-500">This document is required for visa processing. Please upload or verify this document.</p>
        </div>
      </div>
    );

    const isPdf = docData.file_path && docData.file_path.toLowerCase().endsWith('.pdf');
    const fileUrl = docData.file_path ? `http://localhost:8000/${docData.file_path.replace(/\\/g, '/')}` : '';

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => setShowTabs(false)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">Required for visa processing. View {title.toLowerCase()} document information and validity status.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="h-80 bg-gray-100 flex items-center justify-center relative">
                {docData.file_path ? (
                  isPdf ? (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="text-4xl mb-2">📄</div>
                      <p>PDF Document</p>
                    </div>
                  ) : (
                    <img
                      src={fileUrl}
                      alt={`${title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="flex flex-col items-center justify-center h-full text-gray-400">
                            <div class="text-4xl mb-2">📄</div>
                            <p>Document Image</p>
                          </div>
                        `;
                      }}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="text-4xl mb-2">📄</div>
                    <p>Document Image</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 flex gap-2 justify-center">
                <button 
                  onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  disabled={!fileUrl}
                >
                  <FaEye /> View Full Size
                </button>
                <a
                  href={fileUrl}
                  download
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Document Status</h3>
                <div className="flex items-center gap-2">
                  {docData.is_valid ? (
                    <FaCheck className="text-green-600" />
                  ) : (
                    <ImCross className="text-red-600" />
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    docData.is_valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {docData.is_valid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Document Number:</span>
                  <span className="text-gray-800 font-mono">{docData.document_number || 'N/A'}</span>
                </div>
                
                {/* Passport Fields */}
                {docType === 'passport' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Holder Name:</span>
                      <span className="text-gray-800">{docData.holder_name || user?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued Date:</span>
                      <span className="text-gray-800">{docData.issued_date || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="text-gray-800">{docData.expiry_date || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issuer:</span>
                      <span className="text-gray-800">{docData.issuer || 'N/A'}</span>
                    </div>
                  </>
                )}
                
                {/* Emirates ID Fields */}
                {docType === 'emirates_id' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Holder Name:</span>
                      <span className="text-gray-800">{docData.holder_name || user?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="text-gray-800">{docData.date_of_birth || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="text-gray-800">{docData.expiry_date || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="text-gray-800">{docData.nationality || 'N/A'}</span>
                    </div>
                  </>
                )}
                
                {/* Marriage Certificate Fields */}
                {docType === 'marriage_certificate' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bride Name:</span>
                      <span className="text-gray-800">{docData.bride_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Groom Name:</span>
                      <span className="text-gray-800">{docData.groom_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marriage Date:</span>
                      <span className="text-gray-800">{docData.marriage_date || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued Date:</span>
                      <span className="text-gray-800">{docData.issued_date || 'N/A'}</span>
                    </div>
                  </>
                )}
                
                {/* Property Document Fields */}
                {docType === 'property_document' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner Name:</span>
                      <span className="text-gray-800">{docData.owner_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="text-gray-800">{docData.property_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Date:</span>
                      <span className="text-gray-800">{docData.registration_date || 'N/A'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information</h3>
              <div className="space-y-2">
                {docType === 'property_document' ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Value:</span>
                    <span className="text-gray-800">{docData.property_value || 'N/A'}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nationality:</span>
                    <span className="text-gray-800">{docData.nationality || 'N/A'}</span>
                  </div>
                )}
                {docData.message && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Validation Message:</strong> {docData.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* <div className={`border rounded-lg p-6 ${
              docData.is_valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Validity Summary</h3>
              <p className={`${
                docData.is_valid ? 'text-green-700' : 'text-red-700'
              }`}>
                {docData.is_valid 
                  ? '✅ This document is valid and can be used for visa processing.'
                  : '❌ This document is invalid and cannot be used for visa processing.'
                }
              </p>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  const renderVerificationOverview = () => (
    <div className="max-w-7xl mx-auto space-y-6 relative min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Overview</h2>
        <p className="text-gray-600">All listed documents are required for visa processing. Please ensure all documents are valid.</p>
      </div>
<div className="flex-1 flex justify-start">
  <div className=" h-[400px] border p-6 rounded-lg bg-white shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">User Details</h3>
    <div className="grid grid-cols-2 gap-4 overflow-y-auto h-[calc(100%-2.5rem)]">
      <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">Full Name</p>
        <p className="text-gray-800">{user?.name || "N/A"}</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">Date of Birth</p>
        <p className="text-gray-800">{user?.dob || "N/A"}</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">E-mail ID</p>
        <p className="text-gray-800">{user?.email || "N/A"}</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">Contact Number</p>
        <p className="text-gray-800">{user?.contact_number || "N/A"}</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">Address</p>
        <p className="text-gray-800">{user?.address || "N/A"}</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">Gender</p>
        <p className="text-gray-800">{user?.gender || "N/A"}</p>
      </div>
      {/* <div className="space-y-1">
        <p className="text-gray-600 font-medium text-sm">Role</p>
        <p className="text-gray-800">{user?.role || "N/A"}</p>
      </div> */}
    </div>
  </div>
  <div className=" h-[400px] border p-6 rounded-lg bg-white shadow-sm ml-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">Document Status Summary</h3>
    {loading ? (
      <div className="space-y-3 overflow-y-auto h-[calc(100%-2.5rem)]">
        {tabs
          .filter(tab => tab.id !== 'photo-verification')
          .map(({ id, label }) => (
            <div key={id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{label}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Loading...
              </span>
            </div>
          ))}
        <div className="mt-4">
          <p className="text-gray-600 text-sm">Loading document statuses. Please wait...</p>
        </div>
      </div>
    ) : verificationStatus ? (
      <div className="space-y-3 overflow-y-auto h-[calc(100%-2.5rem)]">
        {tabs
          .filter(tab => tab.id !== 'photo-verification')
          .map(({ id, label }) => {
            const result = verificationStatus.results.find((result: { document_type: string; }) => result.document_type === id);
            return (
              <div key={id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  {result ? (
                    <>
                      {result.is_valid ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <ImCross className="text-red-600" />
                      )}
                      <span className="text-sm">{label}</span>
                    </>
                  ) : (
                    <>
                      <ImCross className="text-gray-400" />
                      <span className="text-sm">{label}</span>
                    </>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result ? (result.is_valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800'
                }`}>
                  {result ? (result.is_valid ? 'Valid' : 'Invalid') : 'Required for Visa'}
                </span>
              </div>
            );
          })}
        <div className="mt-4">
          <p className="text-gray-600 text-sm">
            Click the Verification Details button to view detailed document information.
          </p>
        </div>
      </div>
    ) : (
      <div className="space-y-3 overflow-y-auto h-[calc(100%-2.5rem)]">
        {tabs
          .filter(tab => tab.id !== 'photo-verification')
          .map(({ id, label }) => (
            <div key={id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <ImCross className="text-gray-400" />
                <span className="text-sm">{label}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Required for Visa
              </span>
            </div>
          ))}
        <div className="mt-6">
          <p className="text-gray-600 text-sm">No documents found. All listed documents are required for visa processing. Please upload or verify.</p>
        </div>
      </div>
    )}
  </div>
  
</div>
     <div className="flex justify-center mt-10">
  <button
    onClick={() => setShowTabs(true)}
    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-end justify-end gap-2 shadow-lg"
  >
    <FaEye className="text-lg" /> Verify Documents
  </button>
</div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-5">
          Document Verification 
        </h1>

{showTabs ? (
  <div className="flex flex-col gap-8">
    <nav className="rounded-lg p-4 flex flex-wrap justify-center gap-4">
      {tabs.map((tab) => {
        const result = verificationStatus?.results.find((result: { document_type: string; }) => result.document_type === tab.id);
        const hasDocument = result !== undefined;
        const isValid = result?.is_valid;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-blue-500 hover:text-white'
            } relative`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id !== 'photo-verification' && (
              <span className="ml-2">
                {hasDocument ? (
                  isValid ? (
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                  ) : (
                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                  )
                ) : (
                  <span className="w-3 h-3 bg-gray-400 rounded-full inline-block"></span>
                )}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    <div className="min-h-96">
      {activeTab === "photo-verification" && renderPhotoVerification()}
      {activeTab === "passport" && renderDocument("passport", "Passport")}
      {activeTab === "emirates_id" && renderDocument("emirates_id", "Emirates ID")}
      {activeTab === "marriage_certificate" && renderDocument("marriage_certificate", "Marriage Certificate")}
      {activeTab === "property_ownership" && renderDocument("property_document", "Property Ownership")}
    </div>
  </div>
) : (
  renderVerificationOverview()
)}
      </div>
    </div>
  );
};

export default FaceVerify;