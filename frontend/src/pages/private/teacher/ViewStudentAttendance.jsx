import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewStudentAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !user.userId) {
      setError('You must be logged in as a teacher to view attendance.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    setClasses(user.classes || []);
    setSubjects(user.subjects || []);
    console.log('User data:', user); // Debug log
  }, [user, navigate]);

  const fetchClassAttendance = async () => {
    if (!selectedClass || !selectedSection || !selectedSubject) {
      setMessage('Please select class, section, and subject.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    setAttendance([]);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/teacher/attendance/class',
        {
          teacherId: user.userId,
          class: selectedClass,
          section: selectedSection,
          subjectCode: selectedSubject,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Attendance response:', response.data);
      setAttendance(response.data.attendance || []);
      setMessage(response.data.attendance.length ? '' : 'No attendance records found.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching class attendance.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6">View Student Attendance</h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {loading && <p className="text-gray-600 text-sm text-center mb-4">Loading attendance...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection('');
              }}
              className="mt-1 p-2 border rounded-md w-full focus:border-indigo-300 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Class</option>
              {[...new Set(classes.map(cls => cls.class))].map(cls => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              disabled={!selectedClass}
            >
              <option value="">Select Section</option>
              {classes
                .filter(cls => cls.class === selectedClass)
                .map(cls => (
                  <option key={cls.section} value={cls.section}>
                    {cls.section}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:border-indigo-300 focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.code} value={sub.code}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={fetchClassAttendance}
            disabled={loading}
            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
          >
            {loading ? 'Loading...' : 'View Attendance'}
          </button>
          {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-2 text-center text-gray-600">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map(record => (
                <tr key={record._id}>
                  <td className="p-2 border">{record.studentName || 'Unknown'}</td>
                  <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-2 border">{record.subjectName || record.subjectCode}</td>
                  <td className="p-2 border">{record.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStudentAttendance;