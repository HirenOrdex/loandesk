import React from 'react'
import AlertMessage from '../components/AlertMessage'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { IResendEmailFormInput } from '../types/auth'
import { useResendEmail } from '../hooks/auth/useResendEmail'

const ResendActivation: React.FC = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IResendEmailFormInput>();
    const {
        handleResendEmail,
        loader,
    } = useResendEmail(navigate);
    const onSubmit = (data: IResendEmailFormInput) => handleResendEmail(data);
    return (
        <>
            <header className='header-container'>
                <h1 className='text-blue text-center'>Resend Email</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>RESEND ACTIVATION EMAIL?</h2>
                        <div className="card border-0 bg-white rounded">
                            <AlertMessage type="success" />
                            <div className='text-center pt-10 w-[75%] mx-auto'>
                                <h2 className='text-[30px] font-semibold text-(--darkgray) mb-4'>RESEND ACTIVATION EMAIL?</h2>
                                <p className='text-(--gray)'>Enter the email or username you signed up with and we'll resend the activation link to you.</p>
                            </div>
                            <form className='authentication-form sm:!w-[75%] p-6'>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className=""
                                        id="email"
                                        placeholder='Username or Email Address'
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Please enter a valid email address",
                                            },
                                        })}
                                    />
                                    {errors?.email && (
                                        <span className='error-msg'>{errors?.email?.message}</span>
                                    )}
                                    {/* <span className='error-msg'>Username/Email is required</span> */}
                                </div>
                                <div className='flex flex-col'>
                                    <button type='submit' className='btn-main my-8 mx-auto'
                                        onClick={handleSubmit(onSubmit)}
                                    >RESEND</button>
                                    <a className='custom-link mx-auto mb-6'
                                        onClick={() => {
                                            navigate('/login')
                                        }}
                                    >Click here for login</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>)
}

export default ResendActivation
