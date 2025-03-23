import React, { useState } from 'react';
import axios from 'axios';

const MarkTeacherAttendance = () => {
  const [status, setStatus] = useState('Present');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMarkAttendance = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/teacher/attendance/mark',
        { teacherId: user.userId, status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error marking attendance');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mark Your Attendance</h2>
      <div className="space-y-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded-md w-full max-w-xs"
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
        {message && (
          <p className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default MarkTeacherAttendance;