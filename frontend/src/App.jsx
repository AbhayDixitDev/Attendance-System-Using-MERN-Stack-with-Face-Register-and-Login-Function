import React, { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import UserLayout from "./components/user/UserLayout"
import Home from "./pages/user/Home"
import Login from "./pages/public/Login"
import FaceLogin from './pages/public/FaceLogin'
import Signup from "./pages/public/Signup"
import NotFound from './components/notFound'
import ForgotPassword from './pages/public/ForgotPassword'
import FaceRegistration from './pages/public/FaceRegistration';
const App = () => {
  const [user,setUser] = useState(localStorage.getItem('user')|| null)
  useEffect(()=>{
    setUser(localStorage.getItem('user'))
  },[Navigate])
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={user ? <UserLayout/> : <Navigate to="/login"/>} >
       <Route index element={user ? <Home/> : <Navigate to="/login"/>}></Route>
      </Route>
      <Route path="/login" element={!user ? <Login/> : <Navigate to="/"/>} ></Route>
      <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/"/>} ></Route>
      <Route path="/face-registration" element={<FaceRegistration />} />
      <Route path="/forget-password" element={!user ? <ForgotPassword/> : <Navigate to="/"/>}></Route>
      <Route path="/face-login" element={!user ? <FaceLogin /> : <Navigate to="/"/>} />

      <Route path="*" element={<NotFound/>}/>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App