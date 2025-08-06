import React from 'react';

const Integration: React.FC = () => {
  const integrations = [
    {
      id: 1,
      name: 'Payment Gateway',
      description: 'Connect with popular payment processors',
      icon: '💳',
      connected: true,
      type: 'payment'
    },
    {
      id: 2,
      name: 'Email Service',
      description: 'Send emails and notifications',
      icon: '✉️',
      connected: true,
      type: 'communication'
    },
    {
      id: 3,
      name: 'SMS Gateway',
      description: 'Send SMS notifications',
      icon: '📱',
      connected: false,
      type: 'communication'
    },
    {
      id: 4,
      name: 'Document Verification',
      description: 'Verify identity documents',
      icon: '📄',
      connected: false,
      type: 'verification'
    },
    {
      id: 5,
      name: 'Biometric System',
      description: 'Fingerprint and facial recognition',
      icon: '👤',
      connected: true,
      type: 'security'
    },
    {
      id: 6,
      name: 'Analytics',
      description: 'Track system usage and metrics',
      icon: '📊',
      connected: false,
      type: 'analytics'
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-600">Connect third-party services to extend functionality</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Add New Integration
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search integrations..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${integration.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{integration.type}</span>
                <button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${integration.connected ? 'text-red-600 hover:bg-red-50' : 'text-teal-600 hover:bg-teal-50'}`}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
            
            {integration.connected && (
              <div className="bg-green-50 px-6 py-3 border-t border-green-100">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm text-green-700">Connected on Jan 15, 2023</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integration;
