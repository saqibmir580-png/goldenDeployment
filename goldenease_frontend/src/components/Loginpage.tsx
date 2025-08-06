import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({
    error: "",
    showPassword: false,
    isLoading: false,
    loginSuccess: false,
  });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: "", isLoading: true }));
  
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!form.email || !form.password) {
        throw new Error("Please enter both email and password");
      }
      
      // Mock authentication for admin and user
      if (form.email === "admin@example.com" && form.password === "admin123") {
        // Admin login
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          email: form.email,
          name: 'Muzammil',
          role: 'admin'
        }));
        setState((prev) => ({ ...prev, loginSuccess: true, isLoading: false }));
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else if (form.email === "faraaz@gmail.com" && form.password === "faraaz123") {
        // Regular user login
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          email: form.email,
          name: 'Faraaz',
          role: 'user'
        }));
        setState((prev) => ({ ...prev, loginSuccess: true, isLoading: false }));
        setTimeout(() => {
          navigate("/user-management");
        }, 1000);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Login failed. Please try again.",
        isLoading: false,
      }));
    }
  };

  const togglePassword = () => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (state.loginSuccess) {
    // Get user info from localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {}
    const roleText = user?.role === 'admin' ? 'Administrator' : 'User';
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-blue-100 transform transition-all duration-300 hover:shadow-xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6 ring-2 ring-blue-100">
            <FaShieldAlt className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back!</h2>
          <p className="text-gray-600 mb-8">You've successfully logged in as {roleText}</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 py-5 px-6 sm:px-12">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm">
            <FaShieldAlt className="text-xl" />
          </div>
          <h1 className="text-blue-600 text-2xl sm:text-3xl font-bold tracking-tight">GoldenEase</h1>
        </div>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center space-x-5">
              <div className="bg-blue-100 p-4 rounded-xl shadow-inner">
                <FaUser className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Secure Login</h2>
                <p className="text-gray-600 mt-1">Your trusted digital identity</p>
              </div>
            </div>
            <div className="hidden lg:block mt-12 space-y-4">
              {["End-to-end encrypted", "Multi-factor authentication", "24/7 security monitoring"].map((text) => (
                <div key={text} className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <p className="text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center p-6 lg:p-12">
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Access your secure account</p>
            </div>

            {state.error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={state.showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {state.showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={state.isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    state.isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {state.isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Need help?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
