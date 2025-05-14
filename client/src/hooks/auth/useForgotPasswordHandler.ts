import { useState } from "react";
import { AlertState, IForgotFormInput, IForgotResponse } from "../../types/auth";
import { useForgotpasswordMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";

export const useForgotPasswordHandler = () => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [forgotPassword] = useForgotpasswordMutation();
    const handleForgotPassword = async (data: IForgotFormInput) => {
        setLoader(true);
        try {
            const result: IForgotResponse = await forgotPassword(data)?.unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    message: result?.message
                });
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
        handleForgotPassword,
        loader,
        alert
    };
};
