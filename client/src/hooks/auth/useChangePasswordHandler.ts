import { useState } from "react";
import { IChangePassword, ILoginResponse } from "../../types/auth";
import { useChangePasswordMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { IAlertType } from "../../types/common";

export const useChangePasswordHandler = () => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<IAlertType | null>(null);
    const [changePassword] = useChangePasswordMutation();
    const handleChangePassword = async (data: IChangePassword) => {
        setLoader(true);
        try {
            const { oldPassword, newPassword, confirmPassword } = data; // destructure only the required field
            const result: ILoginResponse = await changePassword({ oldPassword, newPassword, confirmPassword })?.unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    header: "Change Password Updated: Success",
                    message: result?.message
                });
                setLoader(false);
                // handleUserLogout(dispatch)();
            }
        } catch (error: unknown) {
            if (isIErrorResponse(error)) {
                setLoader(false);
                setAlert({
                    type: "error",
                    header: "Change Password: Failure",
                    message: error?.data?.message || "Something went wrong. Please try again."
                });
            }
        } finally {
            setLoader(false);
        }
    };

    return {
        handleChangePassword,
        loader,
        alert
    };
};
