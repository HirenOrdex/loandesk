import React from 'react'
import { IoMdClose } from 'react-icons/io'

interface AlertMessageProps {
    type: string,
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type }) => {
    return (
        <div className={`alert ${type}`}>
            <div className='flex items-center justify-between'>
                <span>A text message with a 6-digit verification code was just sent to</span>
                <a>
                    <IoMdClose />
                </a>
            </div>
        </div>
    )
}

export default AlertMessage
