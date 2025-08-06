import React from 'react';

const IdCardManagement: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ID Card Management</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Issue New ID
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ID Card Item */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">National ID Card</h3>
              <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Card Number</p>
                <p className="text-white font-mono">ID-2023-001</p>
              </div>
              <div className="text-right">
                <p className="text-teal-100 text-sm">Expires</p>
                <p className="text-white">12/25</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-medium">JD</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">John Doe</h4>
                <p className="text-sm text-gray-500">Issued: Jan 15, 2023</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">View Details</button>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add more ID cards or empty state */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No ID cards</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by issuing a new ID card.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Issue New ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdCardManagement;
