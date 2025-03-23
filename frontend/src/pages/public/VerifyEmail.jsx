import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill userType if passed from layout
  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/${userType}/resend-verification`,
        { email, userType },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleTryLogin = () => {
    localStorage.clear(); // Clear localStorage
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md h-[450px] flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-center mb-6">You have not verified Your Email! Give it a try</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm p-2"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
            >
              Send Verification Email
            </button>
          </form>
          {message && (
            <p className={`text-sm text-center mt-4 ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
          <button
            onClick={handleTryLogin}
            className="w-full py-2 px-4 mt-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
          >
           Verified ! Try to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;