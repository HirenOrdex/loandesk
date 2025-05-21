import { Routes, Route, Navigate } from "react-router-dom";
import Layout from '../Layout';
import Login from '../Login';
import ForgotPassword from '../ForgotPassword';
import ProtectedLayout from './ProtectedLayout';
import BankerDashboard from '../dashboard/BankerDashboard';
import TwoFactorCode from '../TwoFactorCode';
import ResendActivation from '../ResendActivation';
import BankerRegister from '../BankerRegister';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Profile";
import ChangePassword from "../ChangePassword";
import BorrowerRegister from "../BorrowerRegister";
import RegisterVerifyEmail from "../RegisterVerifyEmail";
import ResetPassword from "../ResetPassword";
import BorrowerDashboard from "../borrower/BorrowerDashboard";
import CoiDashboard from "../coi/CoiDashboard";
import AdminDashboard from "../admin/AdminDashboard";
import GuarantorDashboard from "../Guarantor/GuarantorDashboard";
import NewDealForm from "../dashboard/newdeal/NewDealForm";
import Crawler from "../dashboard/crawler/Crawler";
import MatchPreferences from "../dashboard/matchPreferences/MatchPreferences";
import FindAMatch from "../dashboard/findAMatch/FindAMatch";
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
                <Route path="/" element={<Navigate to="/sign-in" />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<BankerDashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/borrower" element={<BorrowerDashboard />} />
                        <Route path="/coi" element={<CoiDashboard />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/guarantor" element={<GuarantorDashboard />} />

                        <Route path="/new-deal" element={<NewDealForm />} />
                        <Route path="/find-a-match" element={<FindAMatch />} />
                        <Route path="/match-preference" element={<MatchPreferences/>} />
                        <Route path="/crawler" element={<Crawler/>} />
                    </Route>
                </Route>


                <Route element={<Layout />}>
                    <Route path="/sign-in" element={<Login />} />
                    <Route path="/sign-up" element={<BankerRegister />} />
                    <Route path="/borrower-signup" element={<BorrowerRegister />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/resend-email" element={<ResendActivation />} />
                    <Route path="/verify-code" element={<TwoFactorCode />} />
                </Route>
                <Route path="/verify-email/:userId/:token" element={<RegisterVerifyEmail />} />
            </Routes>
        </>
    )
}

export default Routing