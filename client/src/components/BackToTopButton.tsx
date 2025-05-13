import React, { useEffect, useState } from 'react'
import { FaArrowCircleUp } from 'react-icons/fa'

const BackToTopButton: React.FC = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <div className='fixed bottom-5 left-5 size-10'>
            <button
                onClick={scrollToTop}
                tabIndex={isVisible ? 0 : -1}
                className={`flex items-center justify-center size-10 cursor-pointer bg-(--primary-color) hover:bg-(--primary-color-hover) text-white transition-all durattion-3000 ease-in
                ${isVisible ? ' opacity-100' : ' opacity-0 pointer-events-none'}`}>
                <FaArrowCircleUp className='size-6' />
            </button>
        </div>
    )
}

export default BackToTopButton