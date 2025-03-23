import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHome = () => {
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({ type: '', class: '', section: '', subjectCode: '', date: '' });

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/attendance`, {
        params: filters,
      });
      setAttendance(response.data.attendance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Filter Attendance</h3>
        <div className="space-y-2">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <input
            type="text"
            name="class"
            placeholder="Class (e.g., 10th)"
            value={filters.class}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            name="section"
            placeholder="Section (e.g., A)"
            value={filters.section}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            name="subjectCode"
            placeholder="Subject Code (e.g., MATH101)"
            value={filters.subjectCode}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Attendance Records</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td className="p-2 border">{record.type}</td>
                <td className="p-2 border">{record.userId.name}</td>
                <td className="p-2 border">{record.class || '-'}</td>
                <td className="p-2 border">{record.section || '-'}</td>
                <td className="p-2 border">{record.subject?.name || '-'}</td>
                <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                <td className="p-2 border">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;