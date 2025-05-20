import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";
import { IGetProfileResponse, IProfileFormInput } from "../../types/profile";

const useSetProfileData = (setValue: UseFormSetValue<IProfileFormInput>) => {
    const setProfileDetails = useCallback((data: IGetProfileResponse) => {

        // Ensure 'data' is an array or an object that contains an array
        const result = data?.data
        console.log("....",result?.addressId);

        if (result) {
            setValue("firstName", result?.firstName ?? null);
            setValue("middleInitial", result?.middleInitial ?? "");
            setValue("lastName", result?.lastName ?? null);
            setValue("phone", result?.phone ?? null);
            setValue("workPhone", result?.workPhone ?? "");
            setValue("suiteNo", result?.suiteNo ?? "");
            setValue("email", result?.email ?? null);
            setValue("email2", result?.email2 ?? "");
            setValue("webUrl", result?.webUrl ?? "");
            setValue("linkedinUrl", result?.linkedinUrl ?? "");
            setValue("addressId", result?.addressId);

        }
    }, [setValue]);

    return setProfileDetails;
};

export default useSetProfileData;
