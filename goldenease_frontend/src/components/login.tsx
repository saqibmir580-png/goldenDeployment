import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, CheckCircle, XCircle, Pencil, User, Search, X } from "lucide-react";
import Sidebar from "./layout/sidebar";

import { initialUsers } from "../data.ts";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  image: string;
  isVerified: boolean;
  dob: String;
  address: String;
  gender: String;
  role: String;
}

const Input = ({ type = "text", name, value, onChange, placeholder, className = "" }: any) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm ${className}`}
  />
);

const Button = ({ onClick, children, className = "" }: any) => (
  <button onClick={onClick} className={`rounded-lg transition-all duration-200 ${className}`}>
    {children}
  </button>
);

const LoginPage = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", phoneNumber: "", image: "", isVerified: false });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) =>
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const toggleVerification = (id: number) =>
    setUsers(users.map((user) => (user.id === id ? { ...user, isVerified: !user.isVerified } : user)));

  const startEdit = (user: User) => {
    setEditUserId(user.id);
    setEditUser({ ...user });
  };

  const saveEdit = () => {
    if (editUser) {
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setEditUserId(null);
      setEditUser(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)
  );



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <div
        className={`${sidebarOpen ? "w-64" : "w-20"} 
        bg-gradient-to-b from-teal-700 to-teal-800 text-white 
        transition-all duration-300 ease-in-out flex flex-col
        shadow-xl`}
      >
        <div className="p-4 flex items-center justify-between border-b border-teal-600/30">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Singpass</h1>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CiUser size={24} />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-teal-600/20 transition-colors ${!sidebarOpen && 'mx-auto'}`}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center mb-2 px-3 py-2.5 rounded-lg transition-all cursor-pointer
                ${item.active ? 'bg-teal-600/30 text-white' : 'text-teal-100 hover:bg-teal-600/20 hover:text-white'}
                ${!sidebarOpen && 'justify-center'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-teal-600/30">
          <div className={`flex items-center ${sidebarOpen ? "gap-3" : "justify-center"}`}>
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
              <User size={18} />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm">Admin User</p>
                <p className="text-xs text-teal-200 truncate">admin@singpass.com</p>
              </div>
            )}
          </div>
        </div>
      </div> */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Officers Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and monitor officer accounts</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-teal-600 text-white hover:bg-teal-700 shadow-sm text-sm font-medium"
            >
              + Add Officer
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-4 bg-white border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search officers by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Officer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={user.image} 
                          alt={user.fullName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                        />
                        <div className="ml-4">
                          {editUserId === user.id ? (
                            <Input 
                              name="fullName" 
                              value={editUser?.fullName || ""} 
                              onChange={(e: any) => handleChange(e, setEditUser)} 
                              className="max-w-xs"
                            />
                          ) : (
                            <>
                              <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                              <p className="text-xs text-gray-500">ID: #{user.id}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editUserId === user.id ? (
                        <div className="space-y-2">
                          <Input 
                            type="email" 
                            name="email" 
                            value={editUser?.email || ""} 
                            onChange={(e: any) => handleChange(e, setEditUser)}
                            className="max-w-xs" 
                          />
                          <Input 
                            name="phoneNumber" 
                            value={editUser?.phoneNumber || ""} 
                            onChange={(e: any) => handleChange(e, setEditUser)}
                            className="max-w-xs" 
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleVerification(user.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors
                          ${user.isVerified 
                            ? "bg-teal-100 text-teal-700 hover:bg-teal-200" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        {user.isVerified ? (
                          <>
                            <CheckCircle size={14} className="mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle size={14} className="mr-1" />
                            Unverified
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          onClick={() => navigate(`/${user.id}`)} 
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 border border-gray-200"
                        >
                          View Details
                        </Button>
                        <Button 
                          onClick={() => (editUserId === user.id ? saveEdit() : startEdit(user))} 
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          onClick={() => setUsers(users.filter((u) => u.id !== user.id))} 
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Add New Officer</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <Input 
                name="fullName" 
                value={newUser.fullName} 
                onChange={(e: any) => handleChange(e, setNewUser)} 
                placeholder="Full Name" 
              />
              <Input 
                type="email" 
                name="email" 
                value={newUser.email} 
                onChange={(e: any) => handleChange(e, setNewUser)} 
                placeholder="Email Address" 
              />
              <Input 
                name="phoneNumber" 
                value={newUser.phoneNumber} 
                onChange={(e: any) => handleChange(e, setNewUser)} 
                placeholder="Phone Number" 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {imageFile && (
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full mt-4 object-cover border-2 border-teal-200" 
                  />
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-xl">
              <Button 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Add logic to save user
                  setShowForm(false);
                }} 
                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 text-sm font-medium"
              >
                Add Officer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
