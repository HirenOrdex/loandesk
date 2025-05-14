import { InputMask } from '@react-input/mask'
import React, { useRef } from 'react'
import AlertMessage from '../components/AlertMessage'
import { FaPencil } from 'react-icons/fa6'
import defaultAvatar from '../assets/imgs/default-profile.png'
import { useForm } from 'react-hook-form'

type FormValues = {
    firstName: string;
    middleName?: string;
    lastName: string;
    cellPhone: string;
    workPhone?: string;
    address: string;
    suiteNumber?: string;
    email2?: string;
    websiteUrl?: string;
    linkedInUrl?: string;
    profileImage: File | null;
};

const Profile: React.FC = () => {

    // const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        console.log('Form Submitted:', data);
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
        <div className='max-w-[90%] md:max-w-[60%] lg:max-w-[40%] mx-auto my-6'>
            {/* <AlertMessage type='error' className='mb-5' /> */}
            <AlertMessage
                type='success'
                message='Profile Updated Auccessfully'
            />
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
                            <span className='error-msg'>*</span></label>
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
                            {...register('middleName')}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="mb-2">Last Name
                            <span className='error-msg'>*</span></label>
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
                            <span className='error-msg'>*</span></label>
                        <InputMask
                            id="cellPhone"
                            mask="(___) ___-____"
                            showMask={true}
                            inputMode='numeric'
                            // name='cellPhone'
                            replacement={{ _: /\d/ }}
                            {...register('cellPhone', { required: 'Cell phone is required' })}
                        />
                        {/* <span className='error-msg'>Business phone number is required</span> */}
                        {errors.cellPhone && <span className='error-msg'>{errors.cellPhone.message}</span>}
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
                        <span className='error-msg'>*</span></label>
                    <input
                        type="text"
                        id="address"
                        // name='address'
                        {...register('address', { required: 'Address is required' })}
                    />
                    {/* <span className='error-msg'>Address is required</span> */}
                    {errors.address && <span className='error-msg'>{errors.address.message}</span>}
                </div>

                {/* suite number */}
                <div className="mb-3">
                    <label htmlFor="suiteNumber" className="mb-2">Suite Number</label>
                    <input
                        type="text"
                        id="suiteNumber"
                        // name='suiteNumber'
                        {...register('suiteNumber')}
                    />
                </div>

                {/* email 1 */}
                <div className="mb-3">
                    <label htmlFor="email1" className="mb-2">Email 1 <span className='error-msg'>*</span></label>
                    <input
                        type="email"
                        id="email1"
                        name='email1'
                        value={"abc@gmail.com"}
                        disabled
                    />
                </div>

                {/* email 2 */}
                <div className="mb-3">
                    <label htmlFor="email2" className="mb-2">Email 2</label>
                    <input
                        type="email"
                        id="email2"
                        // name='email2'

                        {...register('email2')}
                    />
                </div>

                {/* website url */}
                <div className="mb-3">
                    <label htmlFor="websiteUrl" className="mb-2">Website URL</label>
                    <input
                        type="text"
                        id="websiteUrl"
                        // name='websiteUrl'
                        {...register('websiteUrl')}
                    />
                </div>

                {/* linkedin url */}
                <div className="mb-3">
                    <label htmlFor="linkedInUrl" className="mb-2">LinkedIn URL</label>
                    <input
                        type="text"
                        id="linkedInUrl"
                        // name='linkedInUrl'
                        {...register('linkedInUrl')}
                    />
                </div>

                <div className='flex'>
                    <button type='submit' className='btn-main mx-auto mt-5'
                        onClick={handleSubmit(onSubmit)}
                    >SUBMIT</button>
                </div>
            </form>
        </div>
    )
}

export default Profile
