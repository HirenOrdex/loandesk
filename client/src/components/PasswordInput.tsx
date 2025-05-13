import React, { useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface PasswordInputProps {
    name: string,
    id: string,
    placeholder?: string,
    className?: string,
    registration: UseFormRegisterReturn
    error?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id,registration,placeholder }) => {
    
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    // name={name}
                    placeholder={placeholder}
                    {...registration}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer text-(--label) text-xl"
                    onClick={() => setShowPassword(!showPassword)}>
                    {
                        showPassword ? <FaEyeSlash /> : <FaEye />
                    }
                </button>
            </div>
        </div>
    )
}

export default PasswordInput
