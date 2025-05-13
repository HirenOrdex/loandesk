import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { ILoginFormInput } from '../types/auth'
import { useForm } from 'react-hook-form'
import { useLoginHandler } from '../hooks/auth/useLoginHandler'
import { getCookie } from '../services/commonServices/cookie'
import { useDispatch } from 'react-redux'
import PasswordInput from '../components/PasswordInput'
import AlertMessage from '../components/AlertMessage'

const Login: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILoginFormInput>();
    const {
        handleLogin,
        alert
    } = useLoginHandler(navigate);
    const userData = getCookie("keymonoUserData", dispatch)
    console.log("userData", userData)
    console.log("alert", alert)
    const onSubmit = (data: ILoginFormInput) => handleLogin(data);
    return (
        <>
            <header className='header-container'>
                <h1 className='text-blue text-center'>Sign In</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Get your Sign In in 5 mins. Let's get started.</h2>
                        <div className="card border-0 bg-white rounded">
                            {/* alert message */}
                            {
                                alert && (
                                    <AlertMessage
                                        type={alert.type}
                                        message={alert.message}
                                    /> 
                                )
                            }
                            {/* continue with google */}
                            <div className='w-[80%] px-6 pt-10 mx-auto flex flex-col'>
                                <button
                                    className='space-x-3 flex items-center mx-auto py-[1rem] px-[2rem] border border-[#ccc] rounded-[3px] cursor-pointer'>
                                    <FaGoogle className='inline-block text-2xl' />
                                    <span>Continue with Google</span>
                                </button>
                                <div className="flex items-center mt-8">
                                    <hr className="flex-grow border-t border-[#ccc]" />
                                    <span className="mx-5 text-gray-500 text-sm">or</span>
                                    <hr className="flex-grow border-t border-[#ccc]" />
                                </div>
                            </div>
                            {/* main form */}
                            <form className='authentication-form p-6'>
                                <div className="mb-3">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="E-mail address"
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
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <PasswordInput
                                        name='password'
                                        id='password'
                                        registration={register('password', { required: 'Password is required' })}
                                        error={errors.password?.message}
                                    />
                                    {errors?.password && (
                                        <span className='error-msg'>{errors?.password?.message}</span>
                                    )}
                                </div>
                                <div className='flex justify-between mx-2 flex-col sm:flex-row space-y-3 sm:space-y-0'>
                                    <div className="flex items-center gap-1">
                                        <input type="checkbox" value="rememberMe" id="rememberMe" />
                                        <label className="!mb-0 select-none" htmlFor="rememberMe">
                                            Remember Me
                                        </label>
                                    </div>
                                    <a className='custom-link'
                                        onClick={() => {
                                            navigate('/forgotpassword')
                                        }}
                                    >Forgot password?</a>
                                </div>
                                <div className='flex'>
                                    <button type='submit' className='btn-main my-12 mx-auto'
                                        onClick={handleSubmit(onSubmit)}
                                    >SIGN IN</button>
                                </div>
                                <p className='text-center mb-8'>Don't have an account? Sign up as
                                <a
                                        href="#"
                                        className="custom-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/register?type=banker');
                                        }}
                                    >
                                        Banker
                                    </a>
                                    Or
                                    <a
                                        href="#"
                                        className="custom-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/register?type=borrower');
                                        }}
                                    >
                                        Borrower
                                    </a>
                                </p>
                                <p className='text-center mb-6'>Don't receive an activation email?
                                    <a className='custom-link mx-1'
                                        onClick={() => {
                                            navigate('/resendemail')
                                        }}
                                    >Resend Now</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login