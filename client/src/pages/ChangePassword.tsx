import React from 'react'
import PasswordInput from '../components/PasswordInput'
import { useForm } from 'react-hook-form'

type FormValues = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const ChangePassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormValues>()

    const onSubmit = (data: FormValues) => {
        console.log('Form Submitted:', data)
    }

    const newPassword = watch('newPassword')
    return (
        <div className='max-w-[90%] md:max-w-[30%] mx-auto my-10'>
            <form>
                <div className="mb-3">
                    <label htmlFor="currentPassword">Current Password <span className='error-msg'>*</span></label>
                    <PasswordInput
                        name='currentPassword'
                        id='currentPassword'
                        registration={register('currentPassword', { required: 'Current password is required' })}
                        error={errors.currentPassword?.message}
                    />
                    {/* <span className='error-msg'>Password is required</span> */}
                    {errors.currentPassword && <span className="error-msg">{errors.currentPassword.message}</span>}
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
                            }
                        })}
                        error={errors.newPassword?.message}
                    />
                    {/* <span className='error-msg'>Password is required</span> */}
                    {errors.newPassword && <span className="error-msg">{errors.newPassword.message}</span>}
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
                    {/* <span className='error-msg'>Confirm Password is required</span> */}
                    {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword.message}</span>}
                </div>
                <div className='flex'>
                    <button type='submit' className='btn-main mx-auto'
                        onClick={handleSubmit(onSubmit)}
                    >SAVE</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
