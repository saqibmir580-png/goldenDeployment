import React, { useState } from "react";
import { PiScanSmileyFill } from "react-icons/pi";
import { FaEarListen, FaImage, FaUser } from "react-icons/fa6";
// import FaceVerify from "./face_verify";

const FaceScanRequirements: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [confirmRequirements, setConfirmRequirements] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  const requirements = [
    { text: "Please smile.", icon: <PiScanSmileyFill className="text-teal-600 text-2xl" /> },
    { text: "Both ears must be visible.", icon: <FaEarListen className="text-teal-600 text-2xl" /> },
    { text: "Background should be white.", icon: <FaImage className="text-teal-600 text-2xl" /> },
    { text: "Photo should be till shoulders.", icon: <FaUser className="text-teal-600 text-2xl" /> },
  ];

  const handleConfirmRequirements = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setConfirmRequirements(isChecked);
    setCheckedItems(requirements.reduce((acc, _, index) => ({ ...acc, [index]: isChecked }), {}));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div  className="w-full max-w-10xl bg-white rounded-2xl shadow-xl p-8">
      <div>
        <h1 className="text-3xl font-bold text-teal-700 text-center mb-8">Registration</h1>

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {["First Name", "Middle Name", "Last Name", "Date of Birth", "E-mail ID", "Disabilities", "Contact Number", "Address"].map((label, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-gray-600 font-medium">{label}</label>
              <input
                type="text"
                className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
                placeholder={`Enter ${label}`}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[["Blood Group", ["O+", "O-", "AB+", "AB-", "B+", "B-", "A+", "A-"]], ["Category", ["SC", "ST", "OBC"]], ["Gender", ["Male", "Female"]]].map(
            ([label, opts], i) => (
              <div key={i} className="space-y-2">
                <label className="block text-gray-600 font-medium">{label}</label>
                <select className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-gray-800">
                  <option>Select {label}</option>
                  {Array.isArray(opts) && opts.map((option: string, j: number) => <option key={j}>{option}</option>)}
                </select>
              </div>
            )
          )}
        </div>

        {/* Profile Picture & Face Scan Requirements */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <label
              htmlFor="profile-upload"
              className="cursor-pointer w-56 h-56 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition duration-300 flex items-center justify-center overflow-hidden"
            >
              <img src={profileImage ?? "/default-profile.png"} alt="Profile" className="w-full h-full object-cover rounded-xl" />
            </label>
            <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Face Scan Requirements */}
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Face Scan Requirements</h2>
            <ul className="space-y-4">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center space-x-4">
                  {req.icon}
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer accent-teal-600"
                    checked={checkedItems[index] || false}
                    onChange={() => setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }))}
                  />
                  <span className="text-gray-700 text-base">{req.text}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer accent-teal-600"
                checked={confirmRequirements}
                onChange={handleConfirmRequirements}
              />
              <label className="text-gray-700 text-base">I confirm I meet all the above requirements.</label>
            </div>
            <button
              className="w-full h-12 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
              disabled={!confirmRequirements}
            >
              Scan my face
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceScanRequirements;