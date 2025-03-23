import React, { useEffect } from 'react'
import StudentHeader from './StudentHeader'
import StudentFooter from './StudentFooter'
import { Outlet, useNavigate } from 'react-router-dom';

const StudentLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.userType !== "student") {
      navigate("/login", { replace: true });
    } else if (!user.verified) {
      navigate("/verify-email", { replace: true, state: { userType: "student" } });
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <StudentHeader />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <StudentFooter />
    </div>
  )
}

export default StudentLayout