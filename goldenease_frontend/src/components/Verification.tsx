// import React, { useState } from "react";

// import { CheckCircle, ShieldCheck, Trash2 } from "lucide-react";

// const initialUsers = [
//   { id: 1, name: "Bilal Gumus", image: "https://randomuser.me/api/portraits/men/1.jpg" },
//   { id: 2, name: "Andrew Clark", image: "https://randomuser.me/api/portraits/men/2.jpg" },
//   { id: 3, name: "Amelia Miller", image: "https://randomuser.me/api/portraits/women/3.jpg" },
// ];

// const LoginPage = () => {
//   const [selectedUser, setSelectedUser] = useState<number | null>(null);
//   const [users, setUsers] = useState(initialUsers);
//   const [showForm, setShowForm] = useState(false);
//   const [newUser, setNewUser] = useState({ name: "", image: "" });
//   const [imageFile, setImageFile] = useState<File | null>(null);


//   const handleUserSelect = (id: number) => {
//     setSelectedUser(id); // ✅ Selecting user will update the tick mark
//   };



//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewUser({ ...newUser, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
//     }
//   };

//   const handleSaveUser = () => {
//     if (newUser.name && newUser.image) {
//       setUsers((prevUsers) => [...prevUsers, { id: prevUsers.length + 1, ...newUser }]);
//       setNewUser({ name: "", image: "" });
//       setImageFile(null);
//       setShowForm(false);
//     }
//   };

//   const handleRemoveUser = (id: number) => {
//     setUsers(users.filter((user) => user.id !== id));
//     if (selectedUser === id) setSelectedUser(null); // ✅ Deselect user if removed
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-200">
//       <div
//         className="relative bg-white p-6 w-full max-w-lg rounded-xl shadow-lg flex flex-col transition-all"
//         style={{ maxHeight: "90vh", minHeight: `${250 + users.length * 70}px` }} // ✅ Adjusting height dynamically
//       >
//         <button className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
//           <ShieldCheck size={18} /> Verified
//         </button>
//         <h1 className="text-2xl font-semibold text-center text-gray-800 mb-5">Select a User</h1>

//         <div className="space-y-3 overflow-y-auto">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
//                 selectedUser === user.id ? "bg-blue-100 border-blue-500 shadow-md" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
//               }`}
//               onClick={() => handleUserSelect(user.id)}
//             >
//               <div className="flex items-center gap-3">
//                 <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full border border-gray-400" />
//                 <span className="text-gray-700 font-medium">{user.name}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 {selectedUser === user.id && <CheckCircle className="text-blue-600" size={24} />} {/* ✅ Show tick only if user is selected */}
//                 <button onClick={(e) => { e.stopPropagation(); handleRemoveUser(user.id); }} className="text-red-500 hover:text-red-700">
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             </div>
//           ))}
//           <button className="w-full py-2 mt-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400" onClick={() => setShowForm(true)}>
//             + Add New User
//           </button>
//         </div>

//         <button
//           className={`w-full mt-4 py-2 rounded-xl text-lg font-semibold transition ${
//             selectedUser ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
//           }`}

//           disabled={!selectedUser}
//         >
//           Continue
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter Name"
//               className="w-full p-3 border rounded-lg mb-3"
//               value={newUser.name}
//               onChange={handleInputChange}
//             />
//             <input type="file" accept="image/*" className="w-full p-3 border rounded-lg mb-3" onChange={handleImageUpload} />
//             {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 rounded-full mx-auto mb-3 border" />}
//             <button className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600" onClick={handleSaveUser}>
//               Save User
//             </button>
//             <button className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600" onClick={() => setShowForm(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginPage;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, ShieldCheck, Trash2, UserPlus } from "lucide-react";

// const initialUsers = [
//   { id: 1, name: "Bilal Gumus", image: "https://randomuser.me/api/portraits/men/1.jpg" },
//   { id: 2, name: "Andrew Clark", image: "https://randomuser.me/api/portraits/men/2.jpg" },
//   { id: 3, name: "Amelia Miller", image: "https://randomuser.me/api/portraits/women/3.jpg" },
// ];

// const LoginPage = () => {
//   const [selectedUser, setSelectedUser] = useState<number | null>(null);
//   const [users, setUsers] = useState(initialUsers);
//   const [showForm, setShowForm] = useState(false);
//   const [newUser, setNewUser] = useState({ name: "", image: "" });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const navigate = useNavigate();

//   const handleUserSelect = (id: number) => setSelectedUser(id);
//   const handleContinue = () => selectedUser && navigate("/otp");

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setNewUser({ ...newUser, [e.target.name]: e.target.value });

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
//     }
//   };

//   const handleSaveUser = () => {
//     if (newUser.name && newUser.image) {
//       setUsers([...users, { id: users.length + 1, ...newUser }]);
//       setNewUser({ name: "", image: "" });
//       setImageFile(null);
//       setShowForm(false);
//     }
//   };

//   const handleRemoveUser = (id: number) => {
//     setUsers(users.filter((user) => user.id !== id));
//     if (selectedUser === id) setSelectedUser(null);
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500  p-10">
//       {/* Verified Button (Fixed at the top-right) */}
//       <div className="absolute top-5 right-5">
//         <button className="bg-green-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md">
//           <ShieldCheck size={18} /> Verified
//         </button>
//       </div>

//       {/* Header Section */}
//       <div className="text-center mb-6">
//         <h1 className="text-4xl font-bold">SecureFace Login</h1>
//         <p className="mt-2 text-lg text-gray-200">Select your profile to continue</p>
//       </div>

//       {/* Full-Screen User Selection Container */}
//       <div className="flex flex-col items-center w-full h-full">
//         {/* User List */}
//         <div className="w-full max-w-4xl bg-white text-gray-900 rounded-2xl shadow-lg p-6 flex flex-col">
//           {/* Scrollable List */}
//           <div className="overflow-y-auto max-h-[400px] space-y-3">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                   selectedUser === user.id ? "bg-blue-100 border-blue-500 shadow-md" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
//                 }`}
//                 onClick={() => handleUserSelect(user.id)}
//               >
//                 <div className="flex items-center gap-4">
//                   <img src={user.image} alt={user.name} className="w-14 h-14 rounded-full border border-gray-400 object-cover" />
//                   <span className="text-gray-800 font-medium text-lg">{user.name}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {selectedUser === user.id && <CheckCircle className="text-blue-600" size={28} />}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRemoveUser(user.id);
//                     }}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={22} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Button Section - Fixed Below List */}
//           <div className="mt-4 flex flex-col space-y-2">
//             <button
//               className="w-full py-3 bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-400"
//               onClick={() => setShowForm(true)}
//             >
//               <UserPlus size={22} /> Add New User
//             </button>

//             <button
//               className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
//                 selectedUser ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
//               }`}
//               onClick={handleContinue}
//               disabled={!selectedUser}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter Name"
//               className="w-full p-3 border rounded-lg mb-3"
//               value={newUser.name}
//               onChange={handleInputChange}
//             />
//             <input type="file" accept="image/*" className="w-full p-3 border rounded-lg mb-3" onChange={handleImageUpload} />
//             {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 rounded-full mx-auto mb-3 border" />}
//             <button className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600" onClick={handleSaveUser}>
//               Save User
//             </button>
//             <button className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600" onClick={() => setShowForm(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginPage;



// import React, { useState, useEffect } from "react"; // Add useEffect for animation
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, ShieldCheck, Trash2, UserPlus } from "lucide-react";

// const initialUsers = [
//   { id: 1, name: "Bilal Gumus", image: "https://randomuser.me/api/portraits/men/1.jpg" },
//   { id: 2, name: "Andrew Clark", image: "https://randomuser.me/api/portraits/men/2.jpg" },
//   { id: 3, name: "Amelia Miller", image: "https://randomuser.me/api/portraits/women/3.jpg" },
// ];

// const LoginPage = () => {
//   const [selectedUser, setSelectedUser] = useState<number | null>(null);
//   const [users, setUsers] = useState(initialUsers);
//   const [showForm, setShowForm] = useState(false);
//   const [newUser, setNewUser] = useState({ name: "", image: "" });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isEntering, setIsEntering] = useState(true); // State to control fade-in animation
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Trigger fade-in animation when the component mounts
//     setIsEntering(true);
//   }, []);

//   const handleUserSelect = (id: number) => setSelectedUser(id);
//   const handleContinue = () => selectedUser && navigate("/otp");

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setNewUser({ ...newUser, [e.target.name]: e.target.value });

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
//     }
//   };

//   const handleSaveUser = () => {
//     if (newUser.name && newUser.image) {
//       setUsers([...users, { id: users.length + 1, ...newUser }]);
//       setNewUser({ name: "", image: "" });
//       setImageFile(null);
//       setShowForm(false);
//     }
//   };

//   const handleRemoveUser = (id: number) => {
//     setUsers(users.filter((user) => user.id !== id));
//     if (selectedUser === id) setSelectedUser(null);
//   };

//   return (
//     <div
//       className={`h-screen w-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 p-10 transition-opacity duration-300 ${
//         isEntering ? "opacity-100" : "opacity-0"
//       }`}
//     >
//       {/* Verified Button (Fixed at the top-right) */}
//       <div className="absolute top-5 right-5">
//         <button className="bg-green-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md">
//           <ShieldCheck size={18} /> Verified
//         </button>
//       </div>

//       {/* Header Section */}
//       <div className="text-center mb-6">
//         <h1 className="text-4xl font-bold">SecureFace Login</h1>
//         <p className="mt-2 text-lg text-gray-200">Select your profile to continue</p>
//       </div>

//       {/* Full-Screen User Selection Container */}
//       <div className="flex flex-col items-center w-full h-full">
//         {/* User List */}
//         <div className="w-full max-w-4xl bg-white text-gray-900 rounded-2xl shadow-lg p-6 flex flex-col">
//           {/* Scrollable List */}
//           <div className="overflow-y-auto max-h-[400px] space-y-3">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                   selectedUser === user.id ? "bg-blue-100 border-blue-500 shadow-md" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
//                 }`}
//                 onClick={() => handleUserSelect(user.id)}
//               >
//                 <div className="flex items-center gap-4">
//                   <img src={user.image} alt={user.name} className="w-14 h-14 rounded-full border border-gray-400 object-cover" />
//                   <span className="text-gray-800 font-medium text-lg">{user.name}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {selectedUser === user.id && <CheckCircle className="text-blue-600" size={28} />}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRemoveUser(user.id);
//                     }}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={22} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Button Section - Fixed Below List */}
//           <div className="mt-4 flex flex-col space-y-2">
//             <button
//               className="w-full py-3 bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-400"
//               onClick={() => setShowForm(true)}
//             >
//               <UserPlus size={22} /> Add New User
//             </button>

//             <button
//               className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
//                 selectedUser ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-600 cursor-not-allowed"
//               }`}
//               onClick={handleContinue}
//               disabled={!selectedUser}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter Name"
//               className="w-full p-3 border rounded-lg mb-3"
//               value={newUser.name}
//               onChange={handleInputChange}
//             />
//             <input type="file" accept="image/*" className="w-full p-3 border rounded-lg mb-3" onChange={handleImageUpload} />
//             {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 rounded-full mx-auto mb-3 border" />}
//             <button className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600" onClick={handleSaveUser}>
//               Save User
//             </button>
//             <button className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600" onClick={() => setShowForm(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginPage;












// import React, { useState } from "react";
// import { PiScanSmileyFill } from "react-icons/pi";
// import { FaEarListen, FaImage, FaUser } from "react-icons/fa6";

// const FaceScanRequirements: React.FC = () => {
//   const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
//   const [confirmRequirements, setConfirmRequirements] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   const requirements = [
//     { text: "Please smile.", icon: <PiScanSmileyFill className="text-blue-500" /> },
//     { text: "Both ears must be visible.", icon: <FaEarListen className="text-blue-500" /> },
//     { text: "Background should be white.", icon: <FaImage className="text-blue-500" /> },
//     { text: "Photo should be till shoulders.", icon: <FaUser className="text-blue-500" /> },
//   ];

//   const handleConfirmRequirements = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isChecked = e.target.checked;
//     setConfirmRequirements(isChecked);
//     setCheckedItems(requirements.reduce((acc, _, index) => ({ ...acc, [index]: isChecked }), {}));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setProfileImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 p-6">
//       <div className="w-full max-w-8xl bg-white rounded-lg shadow-xl p-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Face Scan Registration</h1>

//         {/* Personal Information Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {["First Name", "Middle Name", "Last Name", "Date of Birth", "E-mail ID", "Disabilities", "Contact Number", "Address"].map((label, i) => (
//             <div key={i}>
//               <label className="block text-gray-700 font-medium mb-1">{label}</label>
//               <input
//                 type="text"
//                 className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
//                 placeholder={`Enter ${label}`}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Dropdowns Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {[ ["Blood Group", ["O+", "O-", "AB+", "AB-", "B+", "B-", "A+", "A-"]],
//             ["Category", ["SC", "ST", "OBC"]],
//             ["Gender", ["Male", "Female"]],
//           ].map(([label, opts], i) => (
//             <div key={i}>
//               <label className="block text-gray-700 font-medium mb-1">{label}</label>
//               <select className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm shadow-sm">
//                 <option>Select {label}</option>
//                 {Array.isArray(opts) && opts.map((option: string, j: number) => <option key={j}>{option}</option>)}
//               </select>
//             </div>
//           ))}
//         </div>

//         {/* Profile Picture & Face Scan Requirements */}
//         <div className="bg-gray-100 rounded-lg p-6 flex flex-col md:flex-row gap-6">
//           {/* Profile Picture */}
//           <div className="w-full md:w-1/3 flex flex-col items-center">
//             <label htmlFor="profile-upload" className="cursor-pointer w-[200px] h-[200px] border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg hover:border-blue-500">
//               {profileImage ? (
//                 <img src={profileImage} alt="Profile" className="w-full h-full rounded-lg object-cover" />
//               ) : (
//                 <span className="text-gray-600 text-sm">Upload Photo</span>
//               )}
//             </label>
//             <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
//           </div>

//           {/* Face Scan Requirements */}
//           <div className="w-full md:w-2/3">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Face Scan Requirements</h2>
//             <ul className="space-y-3 text-sm">
//               {requirements.map((req, index) => (
//                 <li key={index} className="flex items-center space-x-3">
//                   {req.icon}
//                   <input
//                     type="checkbox"
//                     className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
//                     checked={checkedItems[index] || false}
//                     onChange={() => setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }))}
//                   />
//                   <span className="text-gray-700">{req.text}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4 flex items-center text-sm">
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
//                 checked={confirmRequirements}
//                 onChange={handleConfirmRequirements}
//               />
//               <label className="ml-2 text-gray-700">I confirm I meet all the above requirements.</label>
//             </div>
//             <button className="mt-6 w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
//               Scan my face
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceScanRequirements;



// import React, { useState } from "react";
// import { PiScanSmileyFill } from "react-icons/pi";
// import { FaEarListen, FaImage, FaUser } from "react-icons/fa6";

// const FaceScanRequirements: React.FC = () => {
//   const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
//   const [confirmRequirements, setConfirmRequirements] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

//   const requirements = [
//     { text: "Please smile.", icon: <PiScanSmileyFill className="text-blue-500" /> },
//     { text: "Both ears must be visible.", icon: <FaEarListen className="text-blue-500" /> },
//     { text: "Background should be white.", icon: <FaImage className="text-blue-500" /> },
//     { text: "Photo should be till shoulders.", icon: <FaUser className="text-blue-500" /> },
//   ];

//   const handleConfirmRequirements = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isChecked = e.target.checked;
//     setConfirmRequirements(isChecked);
//     setCheckedItems(requirements.reduce((acc, _, index) => ({ ...acc, [index]: isChecked }), {}));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setProfileImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 p-6">
//       <div className="w-full max-w-8xl bg-white rounded-lg shadow-xl p-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Face Scan Registration</h1>

//         {/* Personal Information Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {["First Name", "Middle Name", "Last Name", "Date of Birth", "E-mail ID", "Disabilities", "Contact Number", "Address"].map((label, i) => (
//             <div key={i}>
//               <label className="block text-gray-700 font-medium mb-1">{label}</label>
//               <input
//                 type="text"
//                 className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
//                 placeholder={`Enter ${label}`}
//               />
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {[["Blood Group", ["O+", "O-", "AB+", "AB-", "B+", "B-", "A+", "A-"]],
//           ["Category", ["SC", "ST", "OBC"]],
//           ["Gender", ["Male", "Female"]],
//           ].map(([label, opts], i) => (
//             <div key={i}>
//               <label className="block text-gray-700 font-medium mb-1">{label}</label>
//               <select className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm shadow-sm">
//                 <option>Select {label}</option>
//                 {Array.isArray(opts) && opts.map((option: string, j: number) => <option key={j}>{option}</option>)}
//               </select>
//             </div>
//           ))}
//         </div>

//         {/* Profile Picture & Face Scan Requirements */}
//         <div className="bg-gray-100 rounded-lg p-6 flex flex-col md:flex-row gap-6">
//           {/* Profile Picture */}
//           <div className="w-full md:w-1/3 flex flex-col items-center">
//             <label htmlFor="profile-upload" className="cursor-pointer w-[200px] h-[200px] border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg hover:border-blue-500">
//               <img src={profileImage ?? "/default-profile.png"} alt="Profile" className="w-full h-full rounded-lg object-cover" />
//             </label>
//             <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
//           </div>

//           {/* Face Scan Requirements */}
//           <div className="w-full md:w-2/3">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Face Scan Requirements</h2>
//             <ul className="space-y-3 text-sm">
//               {requirements.map((req, index) => (
//                 <li key={index} className="flex items-center space-x-3">
//                   {req.icon}
//                   <input
//                     type="checkbox"
//                     className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
//                     checked={checkedItems[index] || false}
//                     onChange={() => setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }))}
//                   />
//                   <span className="text-gray-700">{req.text}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4 flex items-center text-sm">
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
//                 checked={confirmRequirements}
//                 onChange={handleConfirmRequirements}
//               />
//               <label className="ml-2 text-gray-700">I confirm I meet all the above requirements.</label>
//             </div>
//             <button className="mt-6 w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
//               Scan my face
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceScanRequirements;









// import React, { useState } from "react";
// import { UserPlus, Trash2, CheckCircle, XCircle } from "lucide-react";

// interface User {
//   id: number;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   image: string;
//   isVerified: boolean;
// }

// const initialUsers: User[] = [
//   { id: 1, fullName: "Bilal Gumus", email: "bilal.gumus@example.com", phoneNumber: "+1234567890", image: "https://randomuser.me/api/portraits/men/1.jpg", isVerified: true },
//   { id: 2, fullName: "Andrew Clark", email: "andrew.clark@example.com", phoneNumber: "+0987654321", image: "https://randomuser.me/api/portraits/men/2.jpg", isVerified: false },
//   { id: 3, fullName: "Amelia Miller", email: "amelia.miller@example.com", phoneNumber: "+1122334455", image: "https://randomuser.me/api/portraits/women/3.jpg", isVerified: true },
// ];

// const LoginPage = () => {
//   const [users, setUsers] = useState<User[]>(initialUsers);
//   const [showForm, setShowForm] = useState(false);
//   const [newUser, setNewUser] = useState({ fullName: "", email: "", phoneNumber: "", image: "", isVerified: false });
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, [e.target.name]: e.target.value });
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
//     }
//   };
//   const handleSaveUser = () => {
//     if (newUser.fullName && newUser.email && newUser.phoneNumber && newUser.image) {
//       setUsers([...users, { ...newUser, id: users.length + 1 }]);
//       setNewUser({ fullName: "", email: "", phoneNumber: "", image: "", isVerified: false });
//       setImageFile(null);
//       setShowForm(false);
//     }
//   };
//   const toggleVerification = (id: number) => setUsers(users.map((user) => (user.id === id ? { ...user, isVerified: !user.isVerified } : user)));
//   const handleLinkClick = (userId: number) => console.log(`Navigating to next page for user ${userId}`);

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
//       <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-900">SecureFace Login</h1>
//           <p className="mt-2 text-lg text-gray-600">Select your profile to continue</p>
//         </div>

//         <div className="space-y-4 overflow-y-auto max-h-[500px]">
//           {users.map((user) => (
//             <div key={user.id} className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
//               <div className="flex items-center gap-6">
//                 <img src={user.image} alt={user.fullName} className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover" />
//                 <div className="flex flex-col">
//                   <span className="text-lg font-semibold text-gray-800">{user.fullName}</span>
//                   <span className="text-gray-500 text-sm">{user.email}</span>
//                   <span className="text-gray-500 text-sm">{user.phoneNumber}</span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <button onClick={() => toggleVerification(user.id)} className={`p-2 rounded-full shadow ${user.isVerified ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
//                   {user.isVerified ? <CheckCircle size={22} /> : <XCircle size={22} />}
//                 </button>
//                 <button onClick={() => setUsers(users.filter((u) => u.id !== user.id))} className="text-red-500 hover:text-red-700">
//                   <Trash2 size={22} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <button onClick={() => setShowForm(true)} className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-blue-700">
//           <UserPlus size={22} /> Add New User
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New User</h2>
//             <input type="text" name="fullName" placeholder="Enter Full Name" className="w-full p-3 border rounded-lg mb-3" value={newUser.fullName} onChange={handleInputChange} />
//             <input type="email" name="email" placeholder="Enter Email" className="w-full p-3 border rounded-lg mb-3" value={newUser.email} onChange={handleInputChange} />
//             <input type="text" name="phoneNumber" placeholder="Enter Phone Number" className="w-full p-3 border rounded-lg mb-3" value={newUser.phoneNumber} onChange={handleInputChange} />
//             <input type="file" accept="image/*" className="w-full p-3 border rounded-lg mb-3" onChange={handleImageUpload} />
//             {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 rounded-full mx-auto mb-3 border" />}
//             <div className="flex items-center gap-2 mb-3">
//               <input type="checkbox" name="isVerified" checked={newUser.isVerified} onChange={(e) => setNewUser({ ...newUser, isVerified: e.target.checked })} />
//               <label className="text-gray-700">Verified</label>
//             </div>
//             <button onClick={handleSaveUser} className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600">Save User</button>
//             <button onClick={() => setShowForm(false)} className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600">Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginPage;




// import React, { useState } from "react";
// import { UserPlus, Trash2, CheckCircle, XCircle } from "lucide-react";

// interface User {
//   id: number;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   image: string;
//   isVerified: boolean;
// }

// const initialUsers: User[] = [
//   {
//     id: 1,
//     fullName: "Bilal Gumus",
//     email: "bilal.gumus@example.com",
//     phoneNumber: "+1234567890",
//     image: "https://randomuser.me/api/portraits/men/1.jpg",
//     isVerified: true,
//   },
//   {
//     id: 2,
//     fullName: "Andrew Clark",
//     email: "andrew.clark@example.com",
//     phoneNumber: "+0987654321",
//     image: "https://randomuser.me/api/portraits/men/2.jpg",
//     isVerified: false,
//   },
//   {
//     id: 3,
//     fullName: "Amelia Miller",
//     email: "amelia.miller@example.com",
//     phoneNumber: "+1122334455",
//     image: "https://randomuser.me/api/portraits/women/3.jpg",
//     isVerified: true,
//   },
// ];

// const LoginPage = () => {
//   const [users, setUsers] = useState<User[]>(initialUsers);
//   const [showForm, setShowForm] = useState(false);
//   const [newUser, setNewUser] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     image: "",
//     isVerified: false,
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewUser({ ...newUser, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
//     }
//   };

//   const handleSaveUser = () => {
//     if (
//       newUser.fullName &&
//       newUser.email &&
//       newUser.phoneNumber &&
//       newUser.image
//     ) {
//       const newUserWithId: User = {
//         id: users.length + 1,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         phoneNumber: newUser.phoneNumber,
//         image: newUser.image,
//         isVerified: newUser.isVerified,
//       };
//       setUsers([...users, newUserWithId]);
//       setNewUser({ fullName: "", email: "", phoneNumber: "", image: "", isVerified: false });
//       setImageFile(null);
//       setShowForm(false);
//     }
//   };

//   const toggleVerification = (id: number) => {
//     setUsers(
//       users.map((user) =>
//         user.id === id ? { ...user, isVerified: !user.isVerified } : user
//       )
//     );
//   };

//   const handleLinkClick = (userId: number) => {
//     console.log(`Navigating to next page for user ${userId}`);
//     // Example with react-router: navigate(`/user/${userId}`);
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center m-0 p-1 bg-gray-100">
//       <div className="w-full h-full max-w-10xl bg-white text-gray-900 rounded-2xl shadow-lg p-5 flex flex-col">
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold">SecureFace Login</h1>
//           <p className="mt-2 text-lg text-gray-600">Select your profile to continue</p>
//         </div>

//         <div className="overflow-y-auto max-h-[400px] space-y-3">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center justify-between p-4 rounded-xl border-2 bg-gray-50 border-gray-300"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={user.image}
//                   alt={user.fullName}
//                   className="w-14 h-14 rounded-full border border-gray-400 object-cover"
//                 />
//                 <div className="flex items-center gap-2">
//                   <div className="bg-white px-3 py-1 rounded-md border border-gray-200">
//                     <span className="text-gray-800 font-medium text-lg">{user.fullName}</span>
//                   </div>
//                   <div className="bg-white px-3 py-1 rounded-md border border-gray-200">
//                     <span className="text-gray-600 text-sm">{user.email}</span>
//                   </div>
//                   <div className="bg-white px-3 py-1 rounded-md border border-gray-200">
//                     <span className="text-gray-600 text-sm">{user.phoneNumber}</span>
//                   </div>
//                   <div 
//                     className="bg-blue-100 px-3 py-1 rounded-md border border-blue-200 cursor-pointer hover:bg-blue-200"
//                     onClick={() => handleLinkClick(user.id)}
//                   >
//                     <span className="text-blue-600 text-sm">Link</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => toggleVerification(user.id)}
//                   className={`p-2 rounded-full ${
//                     user.isVerified ? "bg-green-100" : "bg-gray-100"
//                   }`}
//                 >
//                   {user.isVerified ? (
//                     <CheckCircle className="text-green-500" size={22} />
//                   ) : (
//                     <XCircle className="text-gray-500" size={22} />
//                   )}
//                 </button>
//                 <button
//                   className="text-red-500 hover:text-red-700"
//                   onClick={() => setUsers(users.filter((u) => u.id !== user.id))}
//                 >
//                   <Trash2 size={22} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 flex flex-col space-y-2">
//           <button
//             className="w-full py-3 bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-400"
//             onClick={() => setShowForm(true)}
//           >
//             <UserPlus size={22} /> Add New User
//           </button>
//         </div>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Enter Full Name"
//               className="w-full p-3 border rounded-lg mb-3"
//               value={newUser.fullName}
//               onChange={handleInputChange}
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter Email"
//               className="w-full p-3 border rounded-lg mb-3"
//               value={newUser.email}
//               onChange={handleInputChange}
//             />
//             <input
//               type="text"
//               name="phoneNumber"
//               placeholder="Enter Phone Number"
//               className="w-full p-3 border rounded-lg mb-3"
//               value={newUser.phoneNumber}
//               onChange={handleInputChange}
//             />
//             <input
//               type="file"
//               accept="image/*"
//               className="w-full p-3 border rounded-lg mb-3"
//               onChange={handleImageUpload}
//             />
//             {imageFile && (
//               <img
//                 src={URL.createObjectURL(imageFile)}
//                 alt="Preview"
//                 className="w-20 h-20 rounded-full mx-auto mb-3 border"
//               />
//             )}
//             <div className="flex items-center gap-2 mb-3">
//               <input
//                 type="checkbox"
//                 name="isVerified"
//                 checked={newUser.isVerified}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, isVerified: e.target.checked })
//                 }
//               />
//               <label className="text-gray-700">Verified</label>
//             </div>
//             <button
//               className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
//               onClick={handleSaveUser}
//             >
//               Save User
//             </button>
//             <button
//               className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginPage;





// import React, { useState } from "react";
// import { PiScanSmileyFill } from "react-icons/pi";
// import { FaEarListen, FaImage, FaUser } from "react-icons/fa6";

// const FaceScanRequirements: React.FC = () => {
//   const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
//   const [confirmRequirements, setConfirmRequirements] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(
//     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//   );

//   const requirements = [
//     { text: "Please smile.", icon: <PiScanSmileyFill className="text-blue-500 text-xl" /> },
//     { text: "Both ears must be visible.", icon: <FaEarListen className="text-blue-500 text-xl" /> },
//     { text: "Background should be white.", icon: <FaImage className="text-blue-500 text-xl" /> },
//     { text: "Photo should be till shoulders.", icon: <FaUser className="text-blue-500 text-xl" /> },
//   ];

//   const handleConfirmRequirements = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isChecked = e.target.checked;
//     setConfirmRequirements(isChecked);
//     setCheckedItems(requirements.reduce((acc, _, index) => ({ ...acc, [index]: isChecked }), {}));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setProfileImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div>
//       <div className="w-full max-w-10xl bg-white rounded-xl shadow-2xl p-8">
//         <h1 className="text-4xl font-semibold text-teal-700 text-center mb-6">Registration</h1>

//         {/* Personal Information Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {["First Name", "Middle Name", "Last Name", "Date of Birth", "E-mail ID", "Disabilities", "Contact Number", "Address"].map((label, i) => (
//             <div key={i}>
//               <label className="block text-gray-700 font-medium mb-2">{label}</label>
//               <input
//                 type="text"
//                 className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-blue-500 text-sm shadow-md focus:outline-none"
//                 placeholder={`Enter ${label}`}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           {[["Blood Group", ["O+", "O-", "AB+", "AB-", "B+", "B-", "A+", "A-"]], ["Category", ["SC", "ST", "OBC"]], ["Gender", ["Male", "Female"]]].map(
//             ([label, opts], i) => (
//               <div key={i}>
//                 <label className="block text-gray-700 font-medium mb-2">{label}</label>
//                 <select className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-blue-500 text-sm shadow-md focus:outline-none">
//                   <option>Select {label}</option>
//                   {Array.isArray(opts) && opts.map((option: string, j: number) => <option key={j}>{option}</option>)}
//                 </select>
//               </div>
//             )
//           )}
//         </div>

//         {/* Profile Picture & Face Scan Requirements */}
//         <div className="bg-gray-100 rounded-xl p-8 flex flex-col md:flex-row gap-6">
//           {/* Profile Picture */}
//           <div className="w-full md:w-1/3 flex flex-col items-center">
//             <label
//               htmlFor="profile-upload"
//               className="cursor-pointer w-48 h-48 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg hover:border-blue-500 transition"
//             >
//               <img src={profileImage ?? "/default-profile.png"} alt="Profile" className="w-full h-full rounded-lg object-cover" />
//             </label>
//             <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
//           </div>

//           {/* Face Scan Requirements */}
//           <div className="w-full md:w-2/3">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Face Scan Requirements</h2>
//             <ul className="space-y-4 text-sm">
//               {requirements.map((req, index) => (
//                 <li key={index} className="flex items-center space-x-3">
//                   {req.icon}
//                   <input
//                     type="checkbox"
//                     className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
//                     checked={checkedItems[index] || false}
//                     onChange={() => setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }))}
//                   />
//                   <span className="text-gray-700">{req.text}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-6 flex items-center text-sm">
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
//                 checked={confirmRequirements}
//                 onChange={handleConfirmRequirements}
//               />
//               <label className="ml-2 text-gray-700">I confirm I meet all the above requirements.</label>
//             </div>
//             <button
//               className="mt-6 w-full bg-teal-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-teal-700 transition"
//               disabled={!confirmRequirements}
//             >
//               Scan my face
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceScanRequirements;