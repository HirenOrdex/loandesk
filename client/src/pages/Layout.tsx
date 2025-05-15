import React from 'react'
import Footer from '../components/layout/Footer'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { getCookie } from '../services/commonServices/cookie';
import BackToTopButton from '../components/BackToTopButton';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const userData = getCookie("keymonoUserData", dispatch)

  if (userData) {
    return <Navigate to="/dashboard" />
  } else {
    return (
      <>
        <Outlet />
        <BackToTopButton />
        <Footer />
      </>
    )

  }
  // return (
  //   <>
  //     <Outlet />
  //     <Footer />
  //   </>
  // )
}

export default Layout
