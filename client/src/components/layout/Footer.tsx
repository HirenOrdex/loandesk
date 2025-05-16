import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { TfiYoutube } from 'react-icons/tfi';

const Footer: React.FC = () => {
    return (
        <footer className="py-10 bg-(--darkgray) px-2">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 sm:px-18">
                    {/* Left Side */}
                    <div className="text-[#ccc] text-sm text-left">
                        <p className="mb-0">100 S Santa Fe Ave, Suit 324, Los Angeles, CA, 90012</p>
                        <p className="mb-0">555.555.5555</p>
                        <p className="mb-0">©NetRM, Inc. 2015</p>
                    </div>

                    {/* Right Side */}
                    <div className="text-center text-[#ccc] text-sm">
                        <div className="mb-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)">Terms of Service</a>
                            <span className="text-[#ccc]">|</span>
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)">Privacy</a>
                            <span className="text-[#ccc]">|</span>
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)">Follow Us</a>
                        </div>
                        <div className="flex justify-end gap-4 text-2xl text-[#ccc] space-x-4 pt-2">
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)"><FaFacebookF /></a>
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)"><FaTwitter /></a>
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)"><FaLinkedinIn /></a>
                            <a className="transition delay-[.3ms] ease-in hover:text-(--primary-color-hover)"><TfiYoutube /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer