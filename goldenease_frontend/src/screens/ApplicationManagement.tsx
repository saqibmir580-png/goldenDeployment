import React, { useState, useEffect } from 'react';

const ApplicationManagement: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        
        const statusColorMap: { [key: string]: string } = {
          pending: 'yellow',
          approved: 'green',
          rejected: 'red',
        };

        const formattedData = data.map((app: any) => ({
          id: `#APP-2023-${String(app.id).padStart(3, '0')}`,
          applicant: {
            name: app.user.name,
            email: app.user.email,
            initials: app.user.name.split(' ').map((n: string) => n[0]).join(''),
          },
          type: 'Document Verification',
          submitted: { date: app.submitted_date, time: app.submitted_time },
          status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
          statusColor: statusColorMap[app.status.toLowerCase()] || 'gray',
          originalId: app.id
        }));
        setApplications(formattedData);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  // Status badge renderer
  const renderStatusBadge = (status: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, color: string) => {
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[color]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Application Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
          New Application
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Mobile Filters Toggle */}
        <div className="sm:hidden p-3 border-b">
          <button 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-700">
              {activeTab === 'all' ? 'All Applications' : 
               activeTab === 'pending' ? 'Pending' : 
               activeTab === 'approved' ? 'Approved' : 'Rejected'}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${mobileFiltersOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Mobile Filter Options */}
          {mobileFiltersOpen && (
            <div className="mt-3 space-y-2 py-2 border-t">
              <button 
                className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => {
                  setActiveTab('all');
                  setMobileFiltersOpen(false);
                }}
              >
                All Applications
              </button>
              <button 
                className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => {
                  setActiveTab('pending');
                  setMobileFiltersOpen(false);
                }}
              >
                Pending
              </button>
              <button 
                className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'approved' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => {
                  setActiveTab('approved');
                  setMobileFiltersOpen(false);
                }}
              >
                Approved
              </button>
              <button 
                className={`block w-full text-left px-3 py-2 rounded ${activeTab === 'rejected' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => {
                  setActiveTab('rejected');
                  setMobileFiltersOpen(false);
                }}
              >
                Rejected
              </button>
            </div>
          )}
        </div>

        {/* Desktop Tabs & Search Section */}
        <div className="hidden sm:block p-4 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex space-x-1 md:space-x-2">
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('all')}
              >
                All Applications
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'approved' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('approved')}
              >
                Approved
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected
              </button>
            </div>
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Search for Mobile */}
        <div className="sm:hidden p-3 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-200">
          {applications.map((app, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{app.applicant.initials}</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{app.applicant.name}</div>
                    <div className="text-xs text-gray-500">{app.applicant.email}</div>
                  </div>
                </div>
                {renderStatusBadge(app.status, app.statusColor)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Application ID</div>
                  <div className="font-medium">{app.id}</div>
                </div>
                <div>
                  <div className="text-gray-500">Type</div>
                  <div>{app.type}</div>
                </div>
                <div>
                  <div className="text-gray-500">Submitted</div>
                  <div>{app.submitted.date}</div>
                </div>
                <div>
                  <div className="text-gray-500">Time</div>
                  <div>{app.submitted.time}</div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-2">
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium">
                  View
                </button>
                <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{app.applicant.initials}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{app.applicant.name}</div>
                        <div className="text-sm text-gray-500">{app.applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{app.submitted.date}</div>
                    <div className="text-gray-400">{app.submitted.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(app.status, app.statusColor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Section */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                <span className="font-medium">24</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          <div className="flex justify-between items-center w-full sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <span className="text-sm text-gray-500">Page 2 of 10</span>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManagement;
