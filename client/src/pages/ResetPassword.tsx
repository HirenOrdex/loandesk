import React from 'react'
import PasswordInput from '../components/PasswordInput'
import { useForm } from 'react-hook-form'
import { IResetPasswordFormInput } from '../types/auth'
import { useResetPasswordHandler } from '../hooks/auth/useResetPasswordHandler'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Loader from '../components/Loader'

const ResetPassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<IResetPasswordFormInput>()
    const newPassword = watch('password')
    const navigate = useNavigate()
    const {
        handleResetPassword,
        alert,
        loader
    } = useResetPasswordHandler(navigate);

    const onSubmit = (data: IResetPasswordFormInput) => {
        console.log('Form Submitted:', data)
        handleResetPassword(data)
    }

    return (
        <>
            {loader ? <Loader /> : null}
            <header className='header-container'>
                <h1 className='text-blue text-center'>Reset Password</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Can't remember your password?</h2>
                        <div className="card border-0 bg-white rounded">
                            {
                                alert && (
                                    <AlertMessage
                                        type={alert?.type}
                                        message={alert?.message}
                                    />
                                )
                            }
                            <div className='text-center pt-10 w-[75%] mx-auto'>
                                <h2 className='text-[30px] font-semibold text-(--darkgray) mb-4'>RESET PASSWORD</h2>
                            </div>
                            <form className='authentication-form sm:!w-[75%] p-6'>
                                <div className="mb-3">
                                    <label htmlFor="password">
                                        Password <span className="error-star">*</span>
                                    </label>
                                    <p className="text-[--darkgray] text-[12px] mb-[5px]">
                                        <em className="font-bold">Information :</em> Password must contain at least 6 characters and include uppercase, lowercase, number, and special character.
                                    </p>
                                    <PasswordInput
                                        name="password"
                                        id="password"
                                        registration={register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                                                message:
                                                    'Password must contain uppercase, lowercase, number, and special character',
                                            },
                                        })}
                                        error={errors?.password?.message}
                                    />
                                    {errors?.password && <span className="error-msg">{errors?.password?.message}</span>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword">
                                        Confirm Password <span className="error-star">*</span>
                                    </label>
                                    <PasswordInput
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        registration={register('confirmPassword', {
                                            required: 'Confirm password is required',
                                            validate: value =>
                                                value === newPassword || 'Passwords do not match'
                                        })}
                                        error={errors?.confirmPassword?.message}
                                    />
                                    {errors?.confirmPassword && <span className="error-msg">{errors?.confirmPassword?.message}</span>}
                                </div>
                                <div className='flex flex-col'>
                                    <button type='submit' className='btn-main my-8 mx-auto'
                                        onClick={handleSubmit(onSubmit)}
                                    >UPDATE</button>
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
