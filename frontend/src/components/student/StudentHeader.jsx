import { useNavigate, Link } from 'react-router-dom';
const StudentHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <nav className="flex space-x-4">
          <Link to="/student/mark-attendance" className="text-indigo-600 hover:text-indigo-800">
            Mark Attendance
          </Link>
          <Link to="/student/view-attendance" className="text-indigo-600 hover:text-indigo-800">
            View Attendance
          </Link>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StudentHeader