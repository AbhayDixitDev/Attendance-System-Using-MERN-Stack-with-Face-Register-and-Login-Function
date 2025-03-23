import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        {/* Title */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          {/* Hamburger Menu Button (Visible on mobile) */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } sm:flex sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0 flex-col sm:flex-row items-center space-x-4 space-y-2 gap-4 sm:space-y-0`}
        >
          <Link
            to="/student/mark-attendance"
            className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base w-full sm:w-auto text-center"
            onClick={() => setIsMenuOpen(false)} // Close menu on link click (mobile)
          >
            Mark Attendance
          </Link>
          <Link
            to="/student/view-attendance"
            className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base w-full sm:w-auto text-center"
            onClick={() => setIsMenuOpen(false)} // Close menu on link click (mobile)
          >
            View Attendance
          </Link>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StudentHeader;