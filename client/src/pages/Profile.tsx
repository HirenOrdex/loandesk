import { InputMask } from '@react-input/mask'
import React, { useEffect, useRef } from 'react'
import AlertMessage from '../components/AlertMessage'
import { FaPencil } from 'react-icons/fa6'
import defaultAvatar from '../assets/imgs/default-profile.png'
import { Controller, useForm } from 'react-hook-form'
import AddressAutocomplete from '../components/AddressAutocomplete'
import { IProfileFormInput } from '../types/profile'
import { useGetProfileDataQuery } from '../services/profileApi'
import { getCookie } from '../services/commonServices/cookie'
import { useDispatch } from 'react-redux'
import useSetProfileData from '../hooks/profile/useSetProfileData'
import { IAddress } from '../types/auth'
import { useUpdateProfile } from '../hooks/profile/useMyProfile'
import Loader from '../components/Loader'



const Profile: React.FC = () => {
    const dispatch = useDispatch()
    const userData = getCookie("keymonoUserData", dispatch)
    const { data: getProfileData, isSuccess, refetch, isLoading, isFetching } = useGetProfileDataQuery(userData?.id, {
        skip: !userData?.id,
    })
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<IProfileFormInput>();
    const {
        handleProfileUpdate, alert, loader
    } = useUpdateProfile();
    const setProfileDetails = useSetProfileData(setValue); // Initialize custom hook
    console.log("getProfileData", getProfileData);

    // const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);



    useEffect(() => {
        if (userData?.id && isSuccess) {
            refetch(); // This will trigger the refetch when the tab is active
            if (getProfileData) {
                setProfileDetails(getProfileData); // Pass data to the custom hook
            }
        }
    }, [refetch, getProfileData, setProfileDetails]);

    const onSubmit = (data: IProfileFormInput) => {
        console.log('Form Submitted:', data);
        handleProfileUpdate(data,userData?.id)
    };
    const profileImage = watch('profileImage');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('profileImage', file); // store File object
        }
        // const file = e.target.files?.[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = () => setProfileImage(reader.result as string);
        //     reader.readAsDataURL(file);

        // }
    };

    const getImageSrc = () => {
        if (profileImage instanceof File) {
            return URL.createObjectURL(profileImage); // preview for uploaded file
        } else if (typeof profileImage === 'string') {
            return profileImage; // show image from backend
        } else {
            return defaultAvatar; // fallback
        }
    };
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {loader ? <Loader /> : null}
        <div className='max-w-[90%] md:max-w-[60%] lg:max-w-[40%] mx-auto my-6'>
            {/* <AlertMessage type='error' className='mb-5' /> */}
            {
                (Object.keys(errors).length !== 0 || alert) && (
                    <AlertMessage
                        type={alert?.type || "error"}
                        message={alert?.message || "Please fill out all the mandatory fields."}
                    />
                )
            }
            <form>
                {/* profile picture */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                    <img
                        // src={
                        //     profileImage || defaultAvatar // default image
                        // }
                        src={getImageSrc()}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover borde"
                    />
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="absolute bottom-5 right-2 bg-(--white) border border-(--gray) rounded-full p-1 shadow-md cursor-pointer"
                        aria-label="Change profile picture"
                    >
                        <FaPencil className="w-4 h-4 text-(--label)" />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="!hidden"
                        onChange={handleImageChange}
                    />
                    <h4 className='text-lg text-(--label) font-semibold text-center'>Test Name</h4>
                </div>

                {/* name */}
                <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="mb-2">First Name
                            <span className='error-star'>*</span></label>
                        <input
                            type="text"
                            id="firstName"
                            {...register('firstName', { required: 'First Name is required' })}
                        />
                        {/* <span className='error-msg'>First Name is required</span> */}
                        {errors.firstName && <span className='error-msg'>{errors.firstName.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="middleName" className="mb-2">Middle Name</label>
                        <input
                            type="text"
                            id="middleName"
                            {...register('middleInitial')}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="mb-2">Last Name
                            <span className='error-star'>*</span></label>
                        <input
                            type="text"
                            id="lastName"
                            {...register('lastName', { required: 'Last Name is required' })}
                        />
                        {/* <span className='error-msg'>Last Name is required</span> */}
                        {errors.lastName && <span className='error-msg'>{errors.lastName.message}</span>}
                    </div>
                </div>

                {/* phone numbers */}
                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-8'>
                    <div className="mb-3">
                        <label htmlFor="cellPhone" className="mb-2">Cell Phone
                            <span className='error-star'>*</span></label>
                        <InputMask
                            id="cellPhone"
                            mask="(___) ___-____"
                            showMask={true}
                            inputMode='numeric'
                            // name='cellPhone'
                            replacement={{ _: /\d/ }}
                            {...register('phone', { required: 'Business Phone number is required' })}
                        />
                        {/* <span className='error-msg'>Business phone number is required</span> */}
                        {errors.phone && <span className='error-msg'>{errors.phone.message}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="workPhone" className="mb-2">Work Phone</label>
                        <InputMask
                            id="workPhone"
                            mask="(___) ___-____"
                            showMask={true}
                            inputMode='numeric'
                            // name='workPhone'
                            replacement={{ _: /\d/ }}
                            {...register('workPhone')}
                        />
                    </div>
                </div>

                {/* address */}
                <div className="mb-3">
                    <label htmlFor="address" className="mb-2">Address
                        <span className='error-star'>*</span></label>
                    {/* <input
                        type="text"
                        id="address" */}
                    {/* name='address' */}

                    <Controller
                        name="addressId"
                        control={control}
                        rules={{ required: "Address is required" }}
                        render={({ field }) => (
                            <AddressAutocomplete
                                id="address"
                                {...field}
                                value={field.value}
                            />
                        )}

                    />
                    {errors.addressId && (
                        <span className="error-msg">{errors.addressId.message}</span>
                    )}

                </div>

                {/* suite number */}
                <div className="mb-3">
                    <label htmlFor="suiteNumber" className="mb-2">Suite Number</label>
                    <input
                        type="text"
                        id="suiteNumber"
                        // name='suiteNumber'
                        {...register('suiteNo')}
                    />
                </div>

                {/* email 1 */}
                <div className="mb-3">
                    <label htmlFor="email1" className="mb-2">Email 1 <span className='error-star'>*</span></label>
                    <input
                        type="email"
                        id="email1"
                        {...register('email')}
                        disabled
                    />
                </div>

                {/* email 2 */}
                <div className="mb-3">
                    <label htmlFor="email2" className="mb-2">Email 2</label>
                    <input
                        type="email"
                        id="email2"
                        {...register("email2", {
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email",
                            },
                        })}
                    />
                </div>

                {/* website url */}
                <div className="mb-3">
                    <label htmlFor="websiteUrl" className="mb-2">Website URL</label>
                    <input
                        type="text"
                        id="websiteUrl"
                        {...register('webUrl')}
                    />
                </div>

                {/* linkedin url */}
                <div className="mb-3">
                    <label htmlFor="linkedInUrl" className="mb-2">LinkedIn URL</label>
                    <input
                        type="text"
                        id="linkedInUrl"
                        {...register('linkedinUrl')}
                    />
                </div>

                <div className='flex'>
                    <button type='submit' className='btn-main mx-auto mt-5'
                        onClick={handleSubmit(onSubmit)}
                    >SUBMIT</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default Profile
