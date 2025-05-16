// hooks/useUpdateProfile.ts
import { useMyprofileMutation } from '../services/profileApi';
import { IProfileFormInput } from '../types/profile';

export const useUpdateProfile = () => {
    const [updateProfile] = useMyprofileMutation();

    const handleProfileUpdate = async (data: any, id: string) => {

        const payload: IProfileFormInput = {
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            cellPhone: data.cellPhone,
            workPhone: data.workPhone,
            email2: data.email2,
            websiteUrl: data.websiteUrl,
            linkedinUrl: data.linkedInUrl,
            address: {
                address1: data.address,
                address2: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                suiteNo: data.suiteNumber || '',
            },
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));

        if (data.profileImage instanceof File) {
            formData.append('profileImage', data.profileImage);
        }

        try {
            const response = await updateProfile({ id, data: formData as unknown as IProfileFormInput }).unwrap();
            return response;
        } catch (err) {
            console.error('Failed to update profile:', err);
            throw err;
        }
    };

    return {
        handleProfileUpdate,
    };
};
