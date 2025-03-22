import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import TeacherLayout from "./components/teacher/TeacherLayout";
import StudentLayout from "./components/student/StudentLayout";
import StudentHome from "./pages/private/student/StudentHome";
import TeacherHome from "./pages/private/teacher/TeacherHome";
import Login from "./pages/public/Login";
import FaceLogin from "./pages/public/FaceLogin";
import Signup from "./pages/public/Signup";
import NotFound from "./components/notFound";
import ForgotPassword from "./pages/public/ForgotPassword";
import FaceRegistration from "./pages/public/FaceRegistration";
import VerifyEmail from "./pages/public/VerifyEmail";

const App = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && !user) { // Only set state if user is not already set
      setUser(storedUser);
      setUserType(storedUser.userType);
      console.log("User type set to:", storedUser.userType);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Login />} /> {/* Default to login page */}

        {/* Student routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
        </Route>

        {/* Teacher routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherHome />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/face-registration" element={<FaceRegistration />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/face-login" element={<FaceLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;