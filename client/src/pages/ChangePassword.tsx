import React from 'react'
import PasswordInput from '../components/PasswordInput'
import { useForm } from 'react-hook-form'
import { useChangePasswordHandler } from '../hooks/auth/useChangePasswordHandler'
import { IChangePassword } from '../types/auth'
import AlertMessage from '../components/AlertMessage'
import MessageModal from '../models/MessageModal'
import Loader from '../components/Loader'



const ChangePassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<IChangePassword>()

    const {
        handleChangePassword,
        alert,
        loader
    } = useChangePasswordHandler();
    const newPassword = watch('newPassword')
    const onSubmit = (data: IChangePassword) => {
        handleChangePassword(data)
    }

    return (
        <>
            {loader ? <Loader /> : null}
            <div className='max-w-[90%] md:max-w-[30%] mx-auto my-10'>
                <form>
                    <div className="mb-3">
                        {
                            alert && (
                                <AlertMessage
                                    type={alert.type}
                                    message={alert.message}
                                />
                            )
                        }
                        <label htmlFor="currentPassword">Current Password <span className='error-msg'>*</span></label>
                        <PasswordInput
                            name='currentPassword'
                            id='currentPassword'
                            registration={register('oldPassword', { required: 'Current password is required' })}
                            error={errors.oldPassword?.message}
                        />
                        {errors?.oldPassword && <span className="error-msg">{errors?.oldPassword?.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword">New Password <span className='error-msg'>*</span></label>
                        <PasswordInput
                            name='newPassword'
                            id='newPassword'
                            registration={register('newPassword', {
                                required: 'New password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                },
                                validate: (value) =>
                                    value !== watch("oldPassword") || "New password cannot be the same as current password",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                                    message:
                                        'Password must contain uppercase, lowercase, number, and special character',
                                },
                            })}
                            error={errors?.newPassword?.message}
                        />
                        {errors?.newPassword && <span className="error-msg">{errors?.newPassword?.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword">Confirm Password <span className='error-msg'>*</span></label>
                        <PasswordInput
                            name='confirmPassword'
                            id='confirmPassword'
                            registration={register('confirmPassword', {
                                required: 'Confirm password is required',
                                validate: value =>
                                    value === newPassword || 'Passwords do not match'
                            })}
                            error={errors.confirmPassword?.message}
                        />
                        {errors?.confirmPassword && <span className="error-msg">{errors?.confirmPassword?.message}</span>}
                    </div>
                    <div className='flex'>
                        <button type='submit' className='btn-main mx-auto'
                            onClick={handleSubmit(onSubmit)}
                        >SAVE</button>
                    </div>
                </form>

                {alert && (
                    <MessageModal
                        type={alert.type}
                        header={alert.header}
                        message={alert.message}
                        navigation="/login"
                    />
                )}
            </div>
        </>
    )
}

export default ChangePassword
