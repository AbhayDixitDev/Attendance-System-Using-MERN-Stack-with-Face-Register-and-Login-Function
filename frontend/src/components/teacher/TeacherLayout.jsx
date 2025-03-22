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
    <div>
      <TeacherHeader/>
      <Outlet /> 
      <TeacherFooter/>
    </div>
  );
};

export default TeacherLayout;