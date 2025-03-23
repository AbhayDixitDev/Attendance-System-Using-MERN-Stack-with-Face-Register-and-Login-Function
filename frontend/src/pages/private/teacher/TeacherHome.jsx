import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherHome = () => {
  const [attendance, setAttendance] = useState([]);
  const [classAttendance, setClassAttendance] = useState([]);
  const [status, setStatus] = useState('Present');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTeacherAttendance();
  }, []);

  const fetchTeacherAttendance = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/attendance/${user.userId}`);
      setAttendance(response.data.attendance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/teacher/attendance/mark`,
        { teacherId: user.userId, status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message);
      fetchTeacherAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error marking attendance');
    }
  };

  const fetchClassAttendance = async (className, section, subjectCode) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/teacher/attendance/class`,
        { teacherId: user.userId, class: className, section, subjectCode },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setClassAttendance(response.data.attendance);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error fetching class attendance');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Mark Your Attendance</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mb-2 p-2 border rounded-md"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button
          onClick={handleMarkAttendance}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Mark Attendance
        </button>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Attendance History</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                <td className="p-2 border">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">View Class Attendance</h3>
        {/* Example: Replace with dynamic class/subject selection */}
        <button
          onClick={() => fetchClassAttendance('10th', 'A', 'MATH101')}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          View 10th A - Mathematics
        </button>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {classAttendance.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{record.userId.name}</td>
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

export default TeacherHome;