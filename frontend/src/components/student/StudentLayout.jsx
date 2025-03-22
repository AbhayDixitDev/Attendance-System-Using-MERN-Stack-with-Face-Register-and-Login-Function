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
    <div>
      <StudentHeader />
      <Outlet />
      <StudentFooter />
    </div>
  )
}

export default StudentLayout