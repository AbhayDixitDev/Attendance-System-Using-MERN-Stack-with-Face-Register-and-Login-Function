import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentHome = () => {
  const [subjects, setSubjects] = useState([]); // Mock subjects for demo
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState('Present');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Mock subjects (replace with API call to fetch student's subjects)
    setSubjects([
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Science', code: 'SCI101' },
    ]);
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/attendance/${user.userId}`);
      setAttendance(response.data.attendance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async (subjectCode) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/student/attendance/mark`,
        { studentId: user.userId, subjectCode, status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message);
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error marking attendance');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Mark Attendance</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mb-2 p-2 border rounded-md"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        {subjects.map(subject => (
          <div key={subject.code} className="mb-2">
            <button
              onClick={() => handleMarkAttendance(subject.code)}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Mark for {subject.name}
            </button>
          </div>
        ))}
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Attendance History</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                <td className="p-2 border">{record.subject.name}</td>
                <td className="p-2 border">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentHome;