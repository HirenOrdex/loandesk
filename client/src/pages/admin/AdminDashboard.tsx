import React from 'react'
import { useDispatch } from 'react-redux';
import { IUserData } from '../../types/auth';
import { getCookie } from '../../services/commonServices/cookie';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
    const userData: IUserData | null = getCookie("keymonoUserData", dispatch)
  return (
    <div className='my-32'>
        <h1 className='text-3xl text-blue text-center'>Hello Admin, {userData?.firstName}</h1>
    </div>
  )
}

export default AdminDashboard
