import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Trash2, CheckCircle, XCircle, Pencil, User, Search, X, MoreVertical, Info ,Eye,Edit,Delete } from "lucide-react";
import Marquee from "../components/Marquee.tsx";

// Define the User interface to match the backend schema
interface User {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  image: string;
  is_verified: boolean;
  dob: string;
  address: string;
  gender: string;
  role: string;
  status: string; // pending, approved, rejected
}

const Input = ({ type = "text", name, value, onChange, placeholder, className = "" }: any) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${className}`}
  />
);

const Button = ({ onClick, children, className = "" }: any) => (
  <button onClick={onClick} className={`rounded-lg transition-all duration-200 ${className}`}>
    {children}
  </button>
);

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", contact_number: "", image: "", is_verified: false });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) =>
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setNewUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };



  const startEdit = (user: User) => {
    setEditUserId(user.id);
    setEditUser({ ...user });
    setActionMenuOpen(null);
  };

  const saveEdit = () => {
    if (editUser) {
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setEditUserId(null);
      setEditUser(null);
    }
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    setActionMenuOpen(null);
  };

  const handleVerification = async (id: number) => {
    setIsVerifying(id);
    try {
      const response = await fetch(`http://localhost:8000/admin/validate/${id}/verify-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("Verification response:", data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify documents.');
      }
      setVerificationStatus(data);
      navigate(`/${id}`, { state: { verificationStatus: data } });
    } catch (error) {
      console.error('Verification failed:', error);
      // If verification fails, still navigate but without status
      navigate(`/${id}`);
    } finally {
      setIsVerifying(null);
    }
  };

  const viewDetails = (id: number) => {
    handleVerification(id);
  };

  const toggleActionMenu = (id: number) => {
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contact_number.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py- sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1> */}
              <p className="text-xl sm:text-2xl font-bold text-gray-800">Manage and monitor user accounts</p>
            </div>
            {/* <Button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm font-medium self-start sm:self-auto"
            >
              + Add User
            </Button> */}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white border-b border-gray-100">
          <div className="relative max-w-full border border-gray-200 rounded-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Users Table - Desktop Version (Hidden on small screens) */}
        <div className="hidden md:block flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
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
                            alt={user.name} 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200" 
                          />
                          <div className="ml-4">
                            {editUserId === user.id ? (
                              <Input 
                                name="name" 
                                value={editUser?.name || ""} 
                                onChange={(e: any) => handleChange(e, setEditUser)} 
                                className="max-w-xs"
                              />
                            ) : (
                              <>
                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
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
                              name="contact_number" 
                              value={editUser?.contact_number || ""} 
                              onChange={(e: any) => handleChange(e, setEditUser)}
                              className="max-w-xs" 
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.contact_number}</p>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${user.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : user.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'}`}
                        >
                          {user.status === 'approved' && <CheckCircle size={14} className="mr-1" />}
                          {user.status === 'rejected' && <XCircle size={14} className="mr-1" />}
                          {user.status === 'pending' && <Info size={14} className="mr-1" />}
                          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            onClick={() => viewDetails(user.id)} 
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 border border-gray-200"
                          >
                            View Details
                          </Button>
                          <Button 
                            onClick={() => (editUserId === user.id ? saveEdit() : startEdit(user))} 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            onClick={() => deleteUser(user.id)} 
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
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

        {/* Users Cards - Mobile Version (Shown only on small screens) */}
        <div className="md:hidden flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-500">No users found matching your search.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {editUserId === user.id ? (
                    // Edit mode
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <img 
                            src={user.image} 
                            alt={user.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                          />
                          <div className="ml-3 flex-1">
                            <Input 
                              name="name" 
                              value={editUser?.name || ""} 
                              onChange={(e: any) => handleChange(e, setEditUser)} 
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                          <Input 
                            type="email" 
                            name="email" 
                            value={editUser?.email || ""} 
                            onChange={(e: any) => handleChange(e, setEditUser)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                          <Input 
                            name="contact_number" 
                            value={editUser?.contact_number || ""} 
                            onChange={(e: any) => handleChange(e, setEditUser)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          onClick={() => setEditUserId(null)} 
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 border border-gray-200"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveEdit} 
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <img 
                              src={user.image} 
                              alt={user.name} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                            />
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">ID: #{user.id}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <button 
                              onClick={() => toggleActionMenu(user.id)} 
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical size={18} className="text-gray-500" />
                            </button>
                            
                            {actionMenuOpen === user.id && (
                              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button 
                                  onClick={() => viewDetails(user.id)} 
                                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                >
                                  <Info size={16} className="mr-2" /> View Details
                                </button>
                                <button 
                                  onClick={() => startEdit(user)} 
                                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                >
                                  <Pencil size={16} className="mr-2" /> Edit
                                </button>
                                <button 
                                  onClick={() => deleteUser(user.id)} 
                                  className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} className="mr-2" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm text-gray-800">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm text-gray-800">{user.contact_number}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-center items-center mb-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            ${user.status === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : user.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'}`}
                          >
                            {user.status === 'approved' && <CheckCircle size={14} className="mr-1" />}
                            {user.status === 'rejected' && <XCircle size={14} className="mr-1" />}
                            {user.status === 'pending' && <Info size={14} className="mr-1" />}
                            {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Pending'}
                          </span>
                        </div>
                        
                        <Button 
                          onClick={() => viewDetails(user.id)} 
                          className="w-full px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 border border-gray-200"
                        >
                          View Details
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <Input 
                name="name" 
                value={newUser.name} 
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
                name="contact_number" 
                value={newUser.contact_number} 
                onChange={(e: any) => handleChange(e, setNewUser)} 
                placeholder="Phone Number" 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageFile && (
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full mt-4 object-cover border-2 border-blue-200" 
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
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
              >
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="flex justify-center  fixed bottom-0 w-full">
      <Marquee />
      </div> */}
      
    </div>
  );
};

export default UserManagement;
