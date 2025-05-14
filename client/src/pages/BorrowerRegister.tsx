import React, { useEffect, useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import PasswordInput from '../components/PasswordInput'
import { InputMask } from '@react-input/mask';
import logo from '../assets/imgs/logo.png'
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { IBorrowerRegisterFormInput } from '../types/auth';
import { useBorrowerRegisterHandler } from '../hooks/auth/useBorrowerRegisterHandler';
import RegistrationModal from '../models/RegistrationModal';

const positions = [
    { label: "Select Position", value: "" },
    { label: "President", value: "president" },
    { label: "Chief executive officer", value: "chief_executive_officer" },
    { label: "Chief financial officer", value: "chief_financial_officer" },
    { label: "Chief operating officer", value: "chief_operating_officer" },
    { label: "Chief marketing officer", value: "chief_marketing_officer" },
    { label: "Chief information officer", value: "chief_information_officer" },
    { label: "Chief technology officer", value: "chief_technology_officer" },
    { label: "Chief human resources officer", value: "chief_human_resources_officer" },
    { label: "Vice President", value: "vice_president" },
    { label: "Office Manager", value: "office_manager" },
    { label: "Controller", value: "controller" },
    { label: "Asst. Controller", value: "asst_controller" },
    { label: "Accounting Manager", value: "accounting_manager" },
    { label: "Partner", value: "partner" },
    { label: "Founder", value: "founder" },
    { label: "Managing Partner", value: "managing_partner" },
    { label: "Other", value: "other" }
];

const BorrowerRegister: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm<IBorrowerRegisterFormInput>();

    const { handleBorrowerRegister, displayPopup, alert, loader } = useBorrowerRegisterHandler(navigate);
    const position = watch("position");
    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState<number | null>(null);
    const [isCaptchaValid, setIsCaptchaValid] = useState(false); // start false

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        let num1 = Math.floor(Math.random() * 10);
        let num2 = Math.floor(Math.random() * 10);
        const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        let question = '';
        let answer: number | null = null;

        switch (operator) {
            case '+':
                question = `${num1} + ${num2} =`;
                answer = num1 + num2;
                break;
            case '-':
                if (num1 < num2) [num1, num2] = [num2, num1];
                question = `${num1} - ${num2} =`;
                answer = num1 - num2;
                break;
            case '*':
                question = `${num1} * ${num2} =`;
                answer = num1 * num2;
                break;
        }
        setCaptchaQuestion(question);
        setCaptchaAnswer(answer);
        setValue('captchaCode', '');
        setIsCaptchaValid(false);
    };

    const validateCaptcha = (value: string) => {
        if (captchaAnswer === null) return 'Generating captcha...';
        const isCorrect = parseInt(value, 10) === captchaAnswer;
        setIsCaptchaValid(isCorrect);
        return isCorrect || 'Please enter the correct verification code';
    };

    const onSubmit = (data: IBorrowerRegisterFormInput) => {
        if (isCaptchaValid) {
            handleBorrowerRegister(data);
            generateCaptcha();
        }
    };

    return (
        <>
            {loader ? <div className='loader'></div> : null}
            <header className='header-container'>
                <img src={logo} alt="NetRM logo" className='mx-auto my-10'/>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Get your loan in 20 mins. Let's get started.</h2>
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

                            <form className='authentication-form p-6' onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="mb-2">Email Address <span className='error-msg'>*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Please enter a valid email address",
                                            },
                                        })}
                                    />
                                    {errors.email && <span className='error-msg'>{errors.email.message}</span>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password">Password <span className='error-msg'>*</span></label>
                                    <p className='text-(--darkgray) text-[12px] mb-[5px]'><em className='font-bold'>Information :</em> Password must contain at least 6 character long and contain at least one capital letter, one lowercase letter, one number and one special character.</p>
                                    <PasswordInput
                                        name="password"
                                        id="password"
                                        registration={register("password", {
                                            required: "Password is required",
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                                message:
                                                    "Password must contain at least 6 characters and include uppercase, lowercase, number, and special character",
                                            },
                                        })}
                                        error={errors.password?.message}
                                    />
                                    {errors?.password && (
                                        <span className="error-msg">{errors.password.message}</span>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword">Confirm Password <span className='error-msg'>*</span></label>
                                    <PasswordInput
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        registration={register("confirm_password", {
                                            required: "Confirm password is required",
                                            validate: (value) =>
                                                value === watch("password") || "Confirm password does not match the password",
                                        })}
                                        error={errors.confirm_password?.message}
                                    />
                                    {errors?.confirm_password && (
                                        <span className="error-msg">{errors.confirm_password.message}</span>
                                    )}
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8 mb-3'>
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="mb-2">First Name
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            {...register("firstName", { required: "First Name is required" })}
                                        />
                                        {errors.firstName && <span className='error-msg'>{errors.firstName.message}</span>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="middleName" className="mb-2">Middle Name</label>
                                        <input
                                            type="text"
                                            id="middleName"
                                            {...register("middleInitial")}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="mb-2">Last Name
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            {...register("lastName", { required: "Last Name is required" })}
                                        />
                                        {errors.lastName && <span className='error-msg'>{errors.lastName.message}</span>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="companyName" className="mb-2">Company Name <span className='error-msg'>*</span></label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        {...register("coname", { required: "Company name is required" })}
                                    />
                                    {errors.coname && <span className='error-msg'>{errors.coname.message}</span>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="position" className="mb-2">Position
                                        <span className='error-msg'>*</span></label>
                                    <select 
                                        id="position"
                                        {...register("position", { required: "Position is required" })}>
                                        {
                                            positions.map((pos, index) => (
                                                <option key={index} value={pos.value}>{pos.label}</option>
                                            ))
                                        }
                                        </select>
                                    {errors.position && (
                                        <span className="error-msg">{errors.position.message}</span>
                                    )}
                                </div>

                                {
                                    position === 'other' && (
                                        <div className="mb-3">
                                            <label htmlFor="otherPosition" className="mb-2">Other Position <span className='error-msg'>*</span></label>
                                            <input
                                                type="text"
                                                id="otherPosition"
                                                {...register("other_position", { required: "Other Position is required" })}
                                            />
                                            {errors.other_position && <span className='error-msg'>{errors.other_position.message}</span>}
                                        </div>
                                    )
                                }

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="mb-2">Contact Phone Number
                                        <span className='error-msg'>*</span></label>
                                    <p className='text-(--darkgray) text-[12px] mb-[5px]'><em className='font-bold'>Information :</em> A text message will be sent to user for verfication so it is important to provide correct number.</p>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{
                                            required: "Contact Phone Number is required",
                                            validate: value => {
                                                const digitsOnly = value.replace(/\D/g, "");
                                                if (digitsOnly.length !== 10) {
                                                    return "Please enter a valid 10-digit phone number";
                                                }
                                                return true;
                                            }
                                        }}
                                        render={({ field }) => (
                                            <InputMask
                                                {...field}
                                                id="phoneNumber"
                                                mask="(___) ___-____"
                                                showMask={true}
                                                inputMode='numeric'
                                                replacement={{ _: /\d/ }}
                                            >
                                            </InputMask>
                                        )}
                                    />
                                    {errors.phone && <span className='error-msg'>{errors.phone.message}</span>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="captchaCode" className="mb-2">Please enter Verification Code: <span className='error-msg'>*</span></label>
                                    <div className='flex flex-wrap'>
                                        <span className='lg:mt-[6px] me-5 text-(--label)'>{captchaQuestion}</span>
                                        <div className='w-100 grow'>
                                            <input
                                                type="text"
                                                id="captchaCode"
                                                {...register('captchaCode', {
                                                    required: 'Please Enter Correct Captcha',
                                                    validate: validateCaptcha,
                                                })}
                                                inputMode='numeric'
                                            />
                                            {errors.captchaCode && <span className="error-msg">{errors.captchaCode.message}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex'>
                                    <button type='submit' className='btn-main my-12 mx-auto'>SIGN UP</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {displayPopup && (
                <RegistrationModal />
            )}
        </>
    )
}

export default BorrowerRegister
