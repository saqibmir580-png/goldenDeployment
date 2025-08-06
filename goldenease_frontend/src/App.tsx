import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import UserManagement from "./screens/UserManagement";
import ApplicationManagement from "./screens/ApplicationManagement";
import IdCardManagement from "./screens/IdCardManagement";
import PaymentManagement from "./screens/PaymentManagement";
import Integration from "./screens/Integration";
import Login from "./components/Loginpage";
import Sidebar from "./components/layout/sidebar";
import FaceVerify from "./components/face_verify";

// Layout component that includes the sidebar and main content
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Don't show sidebar on login page
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/:id" element={<FaceVerify />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute 
                element={<Navigate to="/dashboard" replace />} 
              />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute 
                element={<Dashboard />} 
              />
            } 
          />
          
          <Route 
            path="/user-management" 
            element={
              <ProtectedRoute 
                element={<UserManagement />} 
              />
            } 
          />
          
          <Route 
            path="/Application-managment" 
            element={
              <ProtectedRoute 
                element={<ApplicationManagement />} 
              />
            } 
          />
          
          <Route 
            path="/id-card-management" 
            element={
              <ProtectedRoute 
                element={<IdCardManagement />} 
              />
            } 
          />
          
          <Route 
            path="/payment-management" 
            element={
              <ProtectedRoute 
                element={<PaymentManagement />} 
              />
            } 
          />
          
          <Route 
            path="/integration" 
            element={
              <ProtectedRoute 
                element={<Integration />} 
              />
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;