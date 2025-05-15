import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState, ILoginResponse, IResetPasswordFormInput } from "../../types/auth";
import { useResetPasswordMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";

export const useResetPasswordHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [resetPassword] = useResetPasswordMutation();
    const queryParams = new URLSearchParams(location.search);
    const token: string | null = queryParams.get("token");

    const handleResetPassword = async (data: IResetPasswordFormInput) => {
        setLoader(true);
        try {
            const { password } = data; // destructure only the required field
            const payload: IResetPasswordFormInput = {
                password,
                token: token || "", // ensure token is a string
            };
            console.log("payload",payload)
            const result: ILoginResponse = await resetPassword(payload)?.unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    message: result?.message
                });
                navigate("/sign-in");
            }
        } catch (error: unknown) {
            if (isIErrorResponse(error)) {
                setAlert({
                    type: "error",
                    message: error?.data?.message || "Something went wrong. Please try again."
                });
            }
        } finally {
            setLoader(false);
        }
    };

    return {
        handleResetPassword,
        loader,
        alert
    };
};
