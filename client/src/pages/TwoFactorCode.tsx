import React from 'react'
import AlertMessage from '../components/AlertMessage'
import { useLocation, useNavigate } from 'react-router-dom';
import { IOTPFormInput } from '../types/auth';
import { useForm } from 'react-hook-form';
import { useOTPHandler } from '../hooks/auth/useOTPHandler';
import Loader from '../components/Loader';

const TwoFactorCode: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const email = location.state?.email;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IOTPFormInput>();
    const {
        handleOTPSubmit,
        handleResendOTP,
        alert,
        loader
    } = useOTPHandler(navigate);

    const onSubmit = (data: IOTPFormInput) => {
        const payload = {
            ...data,
            email
        }
        handleOTPSubmit(payload);
    }
    const resendOTPSubmit = () => {
        const payload = {
            email
        }
        handleResendOTP(payload);
    }
    return (
        <>
         {loader ? <Loader/> : null}
            <header className='header-container'>
                <h1 className='text-blue text-center'>Sign In</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Get your Sign In in 5 mins. Let's get started.</h2>
                        <div className="card border-0 bg-white rounded">
                            {
                                alert && (
                                    <AlertMessage
                                        type={alert.type}
                                        message={alert.message}
                                    />
                                )
                            }
                            <form className='authentication-form p-6'>
                                <div className="mb-3">
                                    <label htmlFor="email" className="mb-2">Email address <span className='error-star'>*</span></label>
                                    <input
                                        type="email"
                                        className=""
                                        id="email"
                                        name='email'
                                        value={email ?? ''}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="on-demand-code" className="">On-Demand code</label>
                                    <input
                                        type="text"
                                        id="on-demand-code"
                                        placeholder='On-Demand code'
                                        {...register('otp',
                                            {
                                                required: 'Please enter Code that you get on your register mobile number.'
                                            })}
                                        maxLength={4}
                                    />
                                    {/* <span className='error-msg'>Please enter Code that you get on your register mobile number.</span> */}
                                    {errors.otp && <span className='error-msg'>{errors.otp.message}</span>}
                                </div>
                                <div className='flex justify-end mx-2'>
                                    <a className='custom-link'
                                        onClick={() => {
                                            resendOTPSubmit()
                                        }}
                                    >Resend code</a>
                                </div>
                                <div className='flex'>
                                    <button className='btn-main my-12 mx-auto'
                                        onClick={handleSubmit(onSubmit)}
                                    >SUBMIT</button>
                                </div>
                                <p className='text-center mb-6'>
                                    <a className='custom-link'>Don't have an account? Sign up.</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main >
        </>
    )
}

export default TwoFactorCode
