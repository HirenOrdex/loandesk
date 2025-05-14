import React from 'react'
import AlertMessage from '../components/AlertMessage'
import { useNavigate } from 'react-router-dom'

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate()
    return (
        <>
            <header className='header-container'>
                <h1 className='text-blue text-center'>Forgot Password</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Can't sign in? Forgot your password?</h2>
                        <div className="card border-0 bg-white rounded">
                            <AlertMessage
                                type='success'
                                message='Forgot Password Updated Auccessfully'
                            />
                            <p className='py-10 mx-14'>Enter your email address below and we'll send you password reset instruction.</p>
                            <form className='authentication-form p-6'>
                                <div className="mb-3">
                                    <label htmlFor="email" className="mb-2">Contact Email <span className='error-msg'>*</span></label>
                                    <input
                                        type="email"
                                        className=""
                                        id="email"
                                        name='email'
                                    />
                                </div>
                                <div className='flex justify-center my-12 space-x-2'>
                                    <button type='submit' className='btn-main'>SEND</button>
                                    <a className='btn-main focus:outline-0'
                                        onClick={() => {
                                            navigate('/login')
                                        }}
                                    >BACK TO LOGIN</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ForgotPassword
