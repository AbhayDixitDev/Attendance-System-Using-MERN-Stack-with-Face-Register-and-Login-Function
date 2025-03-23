import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MarkStudentAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('Present');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get user from localStorage once and store in state
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (!user || !user.userId) {
      setError('You must be logged in to mark attendance.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Only fetch if subjects are not already loaded
    if (subjects.length === 0) {
      fetchSubjects();
    }
  }, [user, navigate, subjects.length]); // Depend on user and subjects.length

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/subjects/${user.userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Subjects API response:', response.data);
      if (response.data.subjects && Array.isArray(response.data.subjects)) {
        setSubjects(response.data.subjects);
      } else {
        setError('No subjects found for this student.');
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError(err.response?.data?.message || 'Failed to fetch subjects.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (subjectCode) => {
    setMessage('');
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/student/attendance/mark`,
        { studentId: user.userId, subjectCode, status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error marking attendance');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Mark Attendance</h2>

        {loading && <p className="text-gray-600 text-center mb-4">Loading subjects...</p>}
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded-md w-full max-w-xs focus:border-indigo-300 focus:ring focus:ring-indigo-200"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>

            {subjects.length === 0 ? (
              <p className="text-gray-600 text-sm text-center">No subjects available to mark attendance.</p>
            ) : (
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div key={subject.code} className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMarkAttendance(subject.code)}
                      className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Mark for {subject.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <p
                className={`mt-2 text-sm text-center ${
                  message.includes('Error') ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkStudentAttendance;