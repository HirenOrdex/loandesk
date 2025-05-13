import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'

interface AlertMessageProps {
    type: string,
    message: string,
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
    const [visible, setVisible] = useState(true); // manage visibility

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setVisible(false);
    //     }, 5000);

    //     return () => clearTimeout(timer); // Cleanup on unmount
    // }, []);

    if (!visible) return null; // don't render if dismissed

    return (
        <div className={`alert ${type}`}>
            <div className='flex items-center justify-between'>
                <span>{message}</span>
                <a onClick={() => setVisible(false)}>
                    <IoMdClose />
                </a>
            </div>
        </div>
    )
}

export default AlertMessage
