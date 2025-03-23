import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import TeacherLayout from "./components/teacher/TeacherLayout";
import StudentLayout from "./components/student/StudentLayout";
import AdminLayout from "./components/admin/AdminLayout";
import MarkStudentAttendance from "./pages/private/student/MarkStudentAttendance"; // New
import ViewStudentAttendance from "./pages/private/student/ViewStudentAttendance"; // New
import MarkTeacherAttendance from "./pages/private/teacher/MarkTeacherAttendance";
import ViewTeacherAttendance from "./pages/private/teacher/ViewTeacherAttendance";
import ViewStudentAttendanceTeacher from "./pages/private/teacher/ViewStudentAttendance";
import AdminHome from "./pages/admin/AdminHome";
import Login from "./pages/public/Login";
import FaceLogin from "./pages/public/FaceLogin";
import Signup from "./pages/public/Signup";
import NotFound from "./components/notFound";
import ForgotPassword from "./pages/public/ForgotPassword";
import AdminForgotPassword from "./pages/public/AdminForgotPassword";
import FaceRegistration from "./pages/public/FaceRegistration";
import VerifyEmail from "./pages/public/VerifyEmail";
import AdminLogin from "./pages/public/AdminLogin";
import AdminFaceLogin from "./pages/public/AdminFaceLogin";

const App = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !user) {
      setUser(storedUser);
      setUserType(storedUser.userType);
      console.log("User type set to:", storedUser.userType);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<MarkStudentAttendance />} /> {/* Default to mark attendance */}
          <Route path="mark-attendance" element={<MarkStudentAttendance />} />
          <Route path="view-attendance" element={<ViewStudentAttendance />} />
        </Route>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<MarkTeacherAttendance />} />
          <Route path="mark-attendance" element={<MarkTeacherAttendance />} />
          <Route path="view-attendance" element={<ViewTeacherAttendance />} />
          <Route path="view-student-attendance" element={<ViewStudentAttendanceTeacher />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/face-registration" element={<FaceRegistration />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/admin/forget-password" element={<AdminForgotPassword />} />
        <Route path="/face-login" element={<FaceLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/face-login" element={<AdminFaceLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;