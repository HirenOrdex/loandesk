import React from 'react'
import Footer from '../components/layout/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { getCookie } from '../services/commonServices/cookie';
import BackToTopButton from '../components/BackToTopButton';
import { useRedirectDashboard } from '../hooks/useRedirectDashboard';
import { IUserData } from '../types/auth';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData: IUserData | null = getCookie("keymonoUserData", dispatch)

  if (userData) {
    useRedirectDashboard(userData?.role || "", navigate);
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
