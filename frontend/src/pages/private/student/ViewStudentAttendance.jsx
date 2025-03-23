import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewStudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Attendance History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-2 text-center text-gray-600">No attendance records found</td>
            </tr>
          ) : (
            attendance.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                <td className="p-2 border">{record.subject.name}</td>
                <td className="p-2 border">{record.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStudentAttendance;