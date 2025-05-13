import React from 'react'
import AlertMessage from '../components/AlertMessage'
import Select from 'react-dropdown-select'
import { InputMask } from '@react-input/mask'

const specialityOptions = [
    { label: 'SBA', value: 'SBA' },
    { label: 'Equipment Finance', value: 'Equipment Finance' },
    { label: 'Factoring', value: 'Factoring' },
    { label: 'Asset Based Lending', value: 'Asset Based Lending' },
    { label: 'Flooring', value: 'Flooring' },
    { label: 'Cash Flow Lender', value: 'Cash Flow Lender' },
    { label: 'Leveraged Finance', value: 'Leveraged Finance' },
    { label: 'Mezz Lender', value: 'Mezz Lender' },
    { label: 'Merchant Card Advance', value: 'Merchant Card Advance' },
]

const BankerRegister: React.FC = () => {

    return (
        <>
            <header className='header-container'>
                <h1 className='text-blue text-center'>Banker</h1>
            </header>
            <main className='container-fluid' id='main-container'>
                <div className="justify-center pt-16 pb-32">
                    <div className="sm:max-w-[67%] mx-auto">
                        <h2 className='register-title pb-14'>Get your loan in 20 mins. Let's get started.</h2>
                        <div className="card border-0 bg-white rounded">
                            {/* alert message */}
                            <AlertMessage type="success" />

                            {/* main form */}
                            <form className='authentication-form p-6'>
                                {/* general information */}
                                <div className='mb-8'>
                                    <div className="mb-3">
                                        <label htmlFor="financialInstitute" className="mb-2">Name of Financial Institution
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="financialInstitute"
                                            name='financialInstitute'
                                        />
                                        <span className='error-msg'>Name of Financial Institution is required</span>
                                    </div>
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
                                        <input
                                            type="password"
                                            id="password"
                                            name='password' />
                                        <span className='error-msg'>Password is required</span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmpassword">Confirm Password <span className='error-msg'>*</span></label>
                                        <input
                                            type="password"
                                            id="confirmpassword"
                                            name='confirmpassword' />
                                        <span className='error-msg'>Confirm Password is required</span>
                                    </div>
                                </div>

                                {/* Contact information */}
                                <div className='mb-8'>
                                    <h2 className='text-3xl text-(--darkgray) mb-3'>Contact Information</h2>
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="mb-2">Banker's First Name
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name='firstName'
                                        />
                                        <span className='error-msg'>Banker's First Name is required</span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="middleName" className="mb-2">Banker's Middle Name Initial</label>
                                        <input
                                            type="text"
                                            id="middleName"
                                            name='middleName'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="mb-2">Banker's Last Name
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name='lastName'
                                        />
                                        <span className='error-msg'>Banker's Last Name is required</span>
                                    </div>
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
                                        <label htmlFor="title" className="mb-2">Title
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="title"
                                            name='title'
                                        />
                                        <span className='error-msg'>Title is required</span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="areaOfSpeciality" className="mb-2">Area of speciality
                                            <span className='error-msg'>*</span></label>
                                        <Select
                                            multi={true}
                                            dropdownGap={0}
                                            placeholder='Select Area of Speciality'
                                            keepSelectedInList={false}
                                            dropdownHeight='200px'
                                            values={[]}
                                            options={specialityOptions}
                                            onChange={(selectedValues) => {
                                                console.log('Selected values:', selectedValues);
                                            }}
                                        />
                                        <span className='error-msg'>Area of speciality is required</span>
                                    </div>
                                </div>

                                {/* Financial Institute info */}
                                <div className='mb-8'>
                                    <h2 className='text-3xl text-(--darkgray) mb-3'>Financial Institute Address</h2>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="mb-2">Address
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="address"
                                            name='address'
                                        />
                                        <span className='error-msg'>Address is required</span>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className='mb-8'>
                                    <h2 className='text-3xl text-(--darkgray) mb-3'>Additional Info</h2>
                                    <div className="mb-3">
                                        <label htmlFor="bankType" className="mb-2">Bank Type
                                            <span className='error-msg'>*</span></label>
                                        <select name="bankType" id="bankType" defaultChecked={true}>
                                            <option value="">Select Bank Type</option>
                                            <option value="National">National</option>
                                            <option value="Regional">Regional</option>
                                            <option value="Community">Community</option>
                                        </select>
                                        <span className='error-msg'>Bank type is required</span>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="assetSize" className="mb-2">Asset Size
                                            <span className='error-msg'>*</span></label>
                                        <input
                                            type="text"
                                            id="assetSize"
                                            name='assetSize'
                                        />
                                        <span className='error-msg'>Asset Size is required</span>
                                    </div>
                                </div>

                                <div className='flex'>
                                    <button type='submit' className='btn-main my-12 mx-auto'>SIGN IN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default BankerRegister
