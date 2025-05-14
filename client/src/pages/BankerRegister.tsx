import React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-dropdown-select';
import { useBankerRegisterHandler } from '../hooks/auth/useBankerRegisterHandler';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { Controller, useForm } from 'react-hook-form';
import PasswordInput from '../components/PasswordInput';
import { InputMask } from '@react-input/mask';
import RegistrationModal from '../models/RegistrationModal';
import AlertMessage from '../components/AlertMessage';
import { IBankerRegisterFormInput } from '../types/auth';

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
];

const BankerRegister: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors }
    } = useForm<IBankerRegisterFormInput>();

    const { handleBankerRegister, displayPopup, alert } = useBankerRegisterHandler(navigate);

    const onSubmit = (data: IBankerRegisterFormInput) => {
        handleBankerRegister(data);
    };

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
                            {
                                alert && (
                                    <AlertMessage
                                        type={alert.type}
                                        message={alert.message}
                                    />
                                )
                            }
                            <form className='authentication-form p-6' onSubmit={handleSubmit(onSubmit)}>
                                {/* General Information */}
                                <div className='mb-8'>
                                    <div className="mb-3">
                                        <label htmlFor="financialInstitute">Name of Financial Institution <span className='error-msg'>*</span></label>
                                        <input id="financialInstitute" {...register("financialInstitutionName", { required: "Required" })} />
                                        {errors.financialInstitutionName && <span className='error-msg'>{errors.financialInstitutionName.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email">Email Address <span className='error-msg'>*</span></label>
                                        <input
                                            type="email"
                                            id='email'
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
                                        <label htmlFor="password">
                                            Password <span className="error-msg">*</span>
                                        </label>
                                        <p className="text-[--darkgray] text-[12px] mb-[5px]">
                                            <em className="font-bold">Information :</em> Password must contain at least 6 characters and include uppercase, lowercase, number, and special character.
                                        </p>
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
                                        <label htmlFor="confirmPassword">
                                            Confirm Password <span className="error-msg">*</span>
                                        </label>
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
                                </div>

                                {/* Contact Information */}
                                <div className='mb-8'>
                                    <h2 className='text-3xl text-(--darkgray) mb-3'>Contact Information</h2>
                                    <div className="mb-3">
                                        <label htmlFor="firstName">Banker's First Name <span className='error-msg'>*</span></label>
                                        <input id='firstName' {...register("firstName", { required: "Banker's First Name is required" })} />
                                        {errors.firstName && <span className='error-msg'>{errors.firstName.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="middleName">Banker's Middle Initial</label>
                                        <input id='middleName' {...register("middleInitial")} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName">Banker's Last Name <span className='error-msg'>*</span></label>
                                        <input id='lastName' {...register("lastName", { required: "Banker's Last Name is required" })} />
                                        {errors.lastName && <span className='error-msg'>{errors.lastName.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="phoneNumber">
                                            Contact Phone Number <span className='error-msg'>*</span>
                                        </label>
                                        <p className='text-(--darkgray) text-[12px] mb-[5px]'>
                                            <em className='font-bold'>Information :</em> A text message will be sent to user for verification so it is important to provide correct number.
                                        </p>
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
                                        <label htmlFor="title">Title <span className='error-msg'>*</span></label>
                                        <input id='title' {...register("title", { required: "Title is required" })} />
                                        {errors.title && <span className='error-msg'>{errors.title.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="areaOfSpeciality">Area of Specialty</label>
                                        <Controller
                                            control={control}
                                            name="areaOfSpecialty"
                                            render={({ field }) => (
                                                <Select
                                                    multi
                                                    placeholder="Select Area of Specialty"
                                                    options={specialityOptions}
                                                    keepSelectedInList={false}
                                                    values={specialityOptions.filter(option =>
                                                        (field?.value?.split(', ') ?? []).includes(option.value)
                                                    )}
                                                    onChange={(values) =>
                                                        field.onChange(values.map(v => v.value).join(', '))
                                                    }
                                                    // onSelect={() => { }}
                                                    // onDeselect={() => { }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Financial Institute info */}
                                <div className='mb-8'>
                                    <h2 className='text-3xl text-(--darkgray) mb-3'>Financial Institute Address</h2>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="block mb-1">Address <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="address"
                                            control={control}
                                            rules={{ required: "Address is required" }}
                                            render={({ field }) => (
                                                <AddressAutocomplete
                                                    id="address"
                                                    {...field}
                                                    value={field.value?.[0]?.fulladdress || ""}
                                                />
                                            )}
                                        />
                                        {errors.address && (
                                            <span className="text-red-500 text-sm">{errors.address.message}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div>
                                    <h2 className='text-3xl text-(--darkgray) mb-3'>Additional Info</h2>
                                    <div className="mb-3">
                                        <label htmlFor="bankType">Bank Type <span className='error-msg'>*</span></label>
                                        <select id='bankType' {...register("bankType", { required: "Bank type is required" })}>
                                            <option value="">Select Bank Type</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Investment">Investment</option>
                                        </select>
                                        {errors.bankType && <span className='error-msg'>{errors.bankType.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="assetSize">Asset Size <span className='error-msg'>*</span></label>
                                        <select id='assetSize' {...register("assetSize", { required: "Asset Size is required" })}>
                                            <option value="">Select Asset Size</option>
                                            <option value="Small">Small</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Large">Large</option>
                                        </select>
                                        {errors.assetSize && <span className='error-msg'>{errors.assetSize.message}</span>}
                                    </div>
                                </div>

                                <div className='flex'>
                                    <button type='submit' className='btn-main my-5 mx-auto'>SIGN IN</button>
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
    );
};

export default BankerRegister;