import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import AdminHeader from "./AdminHeader"
import AdminFooter from "./AdminFooter"
const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/admin/login", { replace: true });
    } else if (!user.verified) {
      navigate("/verify-email", { replace: true, state: { userType: "admin" } });
    }
  }, [user, navigate]);
  return (
    <>
    <AdminHeader/>
    <Outlet/>
    <AdminFooter/>
    </>
  )
}

export default AdminLayout