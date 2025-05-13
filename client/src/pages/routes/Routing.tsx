import { Routes, Route, Navigate } from "react-router-dom";
import Layout from '../Layout';
import Login from '../Login';
import ForgotPassword from '../ForgotPassword';
import ProtectedLayout from './ProtectedLayout';
import Dashboard from '../Dashboard';
import TwoFactorCode from '../TwoFactorCode';
import ResendActivation from '../ResendActivation';
import BankerRegister from '../BankerRegister';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Profile";
import ChangePassword from "../ChangePassword";
import BorrowerRegister from "../BorrowerRegister";
const Routing = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/changepassword" element={<ChangePassword />} />
                    </Route>
                </Route>


                <Route element={<Layout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<BankerRegister />} />
                    <Route path="/borrower-register" element={<BorrowerRegister />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resendemail" element={<ResendActivation />} />
                    <Route path="/twofactorcode" element={<TwoFactorCode />} />
                </Route>
            </Routes>
        </>
    )
}

export default Routing