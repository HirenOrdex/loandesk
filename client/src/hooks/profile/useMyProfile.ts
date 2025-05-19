// hooks/useUpdateProfile.ts
import { useMyprofileMutation } from '../../services/profileApi';
import { IProfileFormInput } from '../../types/profile';

export const useUpdateProfile = () => {
    const [updateProfile] = useMyprofileMutation();

    const handleProfileUpdate = async (data: IProfileFormInput, id: string | undefined) => {

        // const payload: IProfileFormInput = {
        //     firstName: data.firstName,
        //     middleName: data.middleName,
        //     lastName: data.lastName,
        //     cellPhone: data.cellPhone,
        //     workPhone: data.workPhone,
        //     email2: data.email2,
        //     websiteUrl: data.websiteUrl,
        //     linkedinUrl: data.linkedInUrl,
        //     address: {
        //         address1: data.address,
        //         address2: '',
        //         city: '',
        //         state: '',
        //         zip: '',
        //         country: '',
        //         suiteNo: data.suiteNumber || '',
        //     },
        // };
        console.log("data", data)
        const { profileImage, ...dataWithoutProfileImage } = data;

        const formData = new FormData();
        formData.append('personData', JSON.stringify(dataWithoutProfileImage));

        if (profileImage instanceof File) {
            formData.append('profileImage', profileImage);
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
