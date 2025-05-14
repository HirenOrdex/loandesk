import React from 'react'
import PasswordInput from '../components/PasswordInput'

const ResetPassword: React.FC = () => {
    return (
        <>
            <header className='header-container'>
                <h1 className='text-blue text-center'>Reset Password</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Can't remember your password?</h2>
                        <div className="card border-0 bg-white rounded">
                            <div className='text-center pt-10 w-[75%] mx-auto'>
                                <h2 className='text-[30px] font-semibold text-(--darkgray) mb-4'>RESET PASSWORD</h2>
                            </div>
                            <form className='authentication-form sm:!w-[75%] p-6'>
                                <div className="mb-3">
                                    <label htmlFor="password">
                                        Password <span className="error-msg">*</span>
                                    </label>
                                    <p className="text-[--darkgray] text-[12px] mb-[5px]">
                                        <em className="font-bold">Information :</em> Password must contain at least 6 characters and include uppercase, lowercase, number, and special character.
                                    </p>
                                    <PasswordInput
                                        name="password"
                                        id="password"
                                    />
                                    <span className="error-msg">Password is required</span>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword">
                                        Confirm Password <span className="error-msg">*</span>
                                    </label>
                                    <PasswordInput
                                        name="confirmPassword"
                                        id="confirmPassword"
                                    />
                                    <span className="error-msg">Confirm Password is required</span>
                                </div>
                                <div className='flex flex-col'>
                                    <button type='submit' className='btn-main my-8 mx-auto'>UPDATE</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ResetPassword
