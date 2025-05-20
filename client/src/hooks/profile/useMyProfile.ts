// hooks/useUpdateProfile.ts
import { useState } from 'react';
import { useMyprofileMutation } from '../../services/profileApi';
import { IProfileFormInput } from '../../types/profile';
import { AlertState } from '../../types/auth';
import { isIErrorResponse } from '../useIsIErrorResponse';

export const useUpdateProfile = () => {
    const [updateProfile] = useMyprofileMutation();
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);

    const handleProfileUpdate = async (data: IProfileFormInput, id: string | undefined) => {
        setLoader(true);

        const { profileImage, ...dataWithoutProfileImage } = data;

        const formData = new FormData();
        formData.append('personData', JSON.stringify(dataWithoutProfileImage));

        if (profileImage instanceof File) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await updateProfile({ id, data: formData as unknown as IProfileFormInput }).unwrap();
            setAlert({
                type: 'success',
                message: response?.message || 'Profile updated successfully.'
            });
            return response;
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (isIErrorResponse(error)) {
                setAlert({
                    type: 'error',
                    message: error?.data?.message || 'Something went wrong. Please try again.'
                });
            }
            throw error;
        } finally {
            setLoader(false);
        }
    };

    return {
        handleProfileUpdate,
        loader,
        alert,
    };
};
