import { useState } from "react";
import { IChangePassword, ILoginResponse } from "../../types/auth";
import { useChangePasswordMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { IAlertType } from "../../types/common";
import { handleUserLogout } from "../../services/commonServices/utilities";
import { useDispatch } from "react-redux";

export const useChangePasswordHandler = () => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<IAlertType | null>(null);
    const [changePassword] = useChangePasswordMutation();
    const dispatch = useDispatch()
    const handleChangePassword = async (data: IChangePassword) => {
        setLoader(true);
        try {
            const { oldPassword, newPassword } = data; // destructure only the required field
            const result: ILoginResponse = await changePassword({ oldPassword, newPassword })?.unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    header: "Change Password Updated: Success",
                    message: result?.message
                });
                setLoader(false);
                handleUserLogout(dispatch)();
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
