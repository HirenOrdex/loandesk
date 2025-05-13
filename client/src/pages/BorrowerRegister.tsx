import React, { useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import PasswordInput from '../components/PasswordInput'
import { InputMask } from '@react-input/mask';
import logo from '../assets/imgs/logo.png'

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

    const [selectedPosition, setSelectedPosition] = useState("");

    return (
        <>
            <header className='header-container'>
                <img src={logo} alt="NetRM logo" className='mx-auto my-10'/>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Get your loan in 20 mins. Let's get started.</h2>
                        <div className="card border-0 bg-white rounded">
                            {/* alert message */}
                            <AlertMessage type="success" />

                            <form className='authentication-form p-6'>
                                <div className="mb-3">
                                    <label htmlFor="email" className="mb-2">Email Address <span className='error-msg'>*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name='email'
                                    />
                                    <span className='error-msg'>Email is required</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password">Password <span className='error-msg'>*</span></label>
                                    <p className='text-(--darkgray) text-[12px] mb-[5px]'><em className='font-bold'>Information :</em> Password must contain at least 6 character long and contain at least one capital letter, one lowercase letter, one number and one special character.</p>
                                    <PasswordInput
                                        name='password'
                                        id='password'
                                    />
                                    <span className='error-msg'>Password is required</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmpassword">Confirm Password <span className='error-msg'>*</span></label>
                                    <PasswordInput
                                        name='confirmpassword'
                                        id='confirmpassword'
                                    />
                                    <span className='error-msg'>Confirm Password is required</span>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8 mb-3'>
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="mb-2">First Name
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="firstName"
                                        />
                                        <span className='error-msg'>First Name is required</span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="middleName" className="mb-2">Middle Name</label>
                                        <input
                                            type="text"
                                            id="middleName"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="mb-2">Last Name
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="lastName"
                                        />
                                        <span className='error-msg'>Last Name is required</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="companyName" className="mb-2">Company Name <span className='error-msg'>*</span></label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name='companyName'
                                    />
                                    <span className='error-msg'>Company name is required</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="position" className="mb-2">Position
                                        <span className='error-msg'>*</span></label>
                                    <select 
                                        name="position"
                                        id="position"
                                        value={selectedPosition}
                                        onChange={e => setSelectedPosition(e.target.value)}>
                                        {
                                            positions.map((pos, index) => (
                                                <option key={index} value={pos.value}>{pos.label}</option>
                                            ))
                                        }
                                    </select>
                                    <span className='error-msg'>Position is required</span>
                                </div>

                                {
                                    selectedPosition === 'other' && (
                                        <div className="mb-3">
                                            <label htmlFor="otherPosition" className="mb-2">Other Position <span className='error-msg'>*</span></label>
                                            <input
                                                type="text"
                                                id="otherPosition"
                                                name='otherPosition'
                                            />
                                            <span className='error-msg'>Other Position is required</span>
                                        </div>
                                    )
                                }

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="mb-2">Contact Phone Number
                                        <span className='error-msg'>*</span></label>
                                    <p className='text-(--darkgray) text-[12px] mb-[5px]'><em className='font-bold'>Information :</em> A text message will be sent to user for verfication so it is important to provide correct number.</p>
                                    <InputMask
                                        id="phoneNumber"
                                        mask="(___) ___-____"
                                        showMask={true}
                                        inputMode='numeric'
                                        replacement={{ _: /\d/ }} />
                                    <span className='error-msg'>Contact Phone Number is required</span>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="captchaCode" className="mb-2">Please enter Verification Code: <span className='error-msg'>*</span></label>
                                    <div className='flex flex-wrap'>
                                        <span className='lg:mt-[6px] me-5 text-(--label)'>07 * 02 =</span>
                                        <div className='w-100 grow'>
                                            <input
                                                type="text"
                                                id="captchaCode"
                                                name='captchaCode'
                                                inputMode='numeric'
                                            />
                                            <span className='error-msg'>Please Enter Correct Captcha</span>
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
        </>
    )
}

export default BorrowerRegister
