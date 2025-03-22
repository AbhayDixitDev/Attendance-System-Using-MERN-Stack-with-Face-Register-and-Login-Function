import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Number */}
        <div className="flex justify-center space-x-2 mb-6">
          <span className="text-8xl font-bold text-indigo-600 animate-bounce" style={{ animationDelay: '0s' }}>
            4
          </span>
          <span className="text-8xl font-bold text-indigo-600 animate-bounce" style={{ animationDelay: '0.2s' }}>
            0
          </span>
          <span className="text-8xl font-bold text-indigo-600 animate-bounce" style={{ animationDelay: '0.4s' }}>
            4
          </span>
        </div>

        {/* Animated Error Message */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 animate-fade-in">
          Page Not Found
        </h1>

        {/* Dynamic Route Message */}
        <p className="text-gray-600 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Sorry, there is no page at{' '}
          <span className="font-mono text-indigo-600">{location.pathname}</span>
        </p>

        {/* Home Button with Hover Animation */}
        <button
          onClick={() => navigate('/')}
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          Back to Home
        </button>
      </div>

      {/* Animated Background Circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-indigo-200 rounded-full -top-36 -left-36 opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full -bottom-48 -right-48 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

// Add custom animations in your CSS file
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
`;

export default NotFound;