import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "./UserHeader"
import Footer from "./UserFooter"
const UserLayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default UserLayout