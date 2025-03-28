import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TeacherHeader from "./TeacherHeader"
import TeacherFooter from "./TeacherFooter"

const TeacherLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.userType !== "teacher") {
      navigate("/login", { replace: true });
    } else if (!user.verified) {
      navigate("/verify-email", { replace: true, state: { userType: "teacher" } });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TeacherHeader />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <TeacherFooter />
    </div>
  );
};

export default TeacherLayout;