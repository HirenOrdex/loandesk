import React, { useState } from "react";
import dashboardBg from '../../assets/imgs/dashboard_bg.jpg';
import contacticon from "../../assets/imgs/contact.png";
import profileicon from "../../assets/imgs/default-profile.png";
import dashboard from "../../assets/imgs/dashboard.png";
import VideoInterview from "../../assets/imgs/video.png";
import messageicon from "../../assets/imgs/email.png";
import "../../assets/css/header.css"; // Import the CSS file
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useLogoutHandler } from "../../hooks/auth/useLogoutHandler";
import { getCookie } from "../../services/commonServices/cookie";
import { useDispatch } from "react-redux";
import { IUserData } from "../../types/auth";
import { useRedirectDashboard } from "../../hooks/useRedirectDashboard";

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const userData: IUserData | null = getCookie("keymonoUserData", dispatch)
    const [isMenuOpen, setIsMenuOpen] = useState(false); // for sidebar's hamburger menu
    const [menuOpen, setMenuOpen] = useState(false);     // for sidebar's dropdown
    const navigate = useNavigate();
    // sidebar's hamburger menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // sidebar's hamburger close the menu
    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    const toggleDropdown = () => setMenuOpen(!menuOpen);
    const closeDropdown = () => setMenuOpen(false);

    const { handleLogout } = useLogoutHandler(navigate);

    return (
        <>
            <div className="relative px-4 py-6 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-center items-center gap-4">

                    {/* Hamburger Icon (visible only on small screens) */}
                    <button
                        className="lg:hidden absolute sm:left-10 left-6 sm:top-10 top-12 flex items-center justify-center space-y-1 cursor-pointer"
                        onClick={toggleMenu}
                    >
                        <span className="text-2xl"><CiMenuBurger /></span>

                    </button>

                    {/* Logo */}
                    <h1 className="text-blue text-3xl font-semibold mt-2 md:mt-0">
                        Loandesk
                    </h1>

                    {/* Sidebar Menu (on mobile) */}
                    <div
                        className={`fixed top-0 left-0 w-fit px-16 bg-white shadow-lg flex flex-col align-end justify-center transform transition-transform duration-300 h-lvh overflow-auto ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                            } lg:hidden z-50`}
                    >
                        <div className="flex flex-col items-center gap-y-5">
                            {/* Close Button */}
                            <button
                                className="absolute top-1 right-4 text-4xl text-gray-500 hover:text-gray-700 cursor-pointer"
                                onClick={closeMenu}
                            >
                                &times;
                            </button>

                            <a className="dashboardicons"
                                onClick={() => {
                                    useRedirectDashboard(userData?.role || "", navigate);
                                }}
                            >
                                <img src={dashboard} alt="Dashboard" className="icon-size" />Dashboard
                            </a>

                            <a className="dashboardicons">
                                <img src={VideoInterview} alt="Video Interview" className="icon-size" />Video Interview
                            </a>

                            <a className="dashboardicons">
                                <img src={messageicon} alt="Messages" className="icon-size" />Messages
                            </a>

                            <a className="dashboardicons">
                                <img src={contacticon} alt="Contact" className="icon-size" />Contact
                            </a>

                            <div className="relative flex flex-col items-center">
                                {/* Profile Button */}
                                <a className="dashboardicons cursor-pointer" onClick={toggleDropdown}>
                                    <img src={profileicon} alt="Profile" className="icon-round" />
                                    {userData?.firstName}
                                </a>

                                {/* Dropdown */}
                                <ul
                                    className={`absolute dropdown-up profile-dropdown-menu shadow-md rounded-md py-2 text-left w-40 z-10 bg-white transition-all duration-200 ${menuOpen ? 'block' : 'hidden'}`}
                                >
                                    <li
                                        onClick={() => {
                                            navigate('/profile')
                                        }}
                                    >
                                        <a className="block px-4 py-2" onClick={closeDropdown}>
                                            My Profile
                                        </a>
                                    </li>
                                    <li
                                        onClick={() => {
                                            navigate('/change-password')
                                        }}
                                    >
                                        <a className="block px-4 py-2" onClick={closeDropdown}>
                                            Change Password
                                        </a>
                                    </li>
                                    <li>
                                        <a className="block px-4 py-2" onClick={closeDropdown}>
                                            Manage Delegates
                                        </a>
                                    </li>
                                    <li>
                                        <a className="block px-4 py-2" onClick={closeDropdown}>
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a className="block px-4 py-2" onClick={handleLogout}>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Menu Grid (displayed on desktop, toggled on mobile) */}
                    <div className="hidden lg:grid grid-cols-5 gap-2 justify-items-center text-center px-8">
                        {/* Dashboard */}
                        <a className="dashboardicons"
                            onClick={() => {
                                useRedirectDashboard(userData?.role || "", navigate);
                            }}
                        >
                            <img src={dashboard} alt="Dashboard" className="icon-size" />Dashboard
                        </a>

                        {/* Video Interview */}
                        <a className="dashboardicons">
                            <img src={VideoInterview} alt="Video Interview" className="icon-size" />Video Interview
                        </a>

                        {/* Messages */}
                        <a className="dashboardicons">
                            <img src={messageicon} alt="Messages" className="icon-size" />Messages
                        </a>

                        {/* Contact */}
                        <a className="dashboardicons">
                            <img src={contacticon} alt="Contact" className="icon-size" />Contact
                        </a>

                        {/* Profile with Dropdown */}
                        <div className="relative group">
                            <a className="dashboardicons cursor-pointer">
                                <img src={profileicon} alt="Profile" className="icon-round" />
                                {userData?.firstName}
                            </a>
                            {/* Dropdown Menu */}
                            <ul className="profile-dropdown-menu group-hover:block hidden">
                                <li
                                    onClick={() => {
                                        navigate('/profile')
                                    }}
                                >
                                    <a className="block px-4 py-2">
                                        My Profile
                                    </a>
                                </li>
                                <li
                                    onClick={() => {
                                        navigate('/change-password')
                                    }}
                                >
                                    <a className="block px-4 py-2">
                                        Change password
                                    </a>
                                </li>
                                <li>
                                    <a className="block px-4 py-2">
                                        Manage Delegates
                                    </a>
                                </li>
                                <li>
                                    <a className="block px-4 py-2">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a className="block px-4 py-2" onClick={handleLogout}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Banner Section */}
            <section>
                <div
                    className="h-[140px] w-full bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url(${dashboardBg})` }}
                >
                    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
                        <h2 className="text-center text-white text-3xl font-semibold"> {/* Add text if needed */}</h2>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Header;
