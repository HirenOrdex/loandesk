import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState, ILoginResponse, IResendEmailFormInput } from "../../types/auth";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { useResendEmailMutation } from "../../services/authApi";

export const useResendEmail = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [resendEmail] = useResendEmailMutation();
    const handleResendEmail = async (data: IResendEmailFormInput) => {
        setLoader(true);
        try {
            console.log("data", data)
            const result: ILoginResponse = await resendEmail(data)?.unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    message: result?.message
                });
            }
        } catch (error: unknown) {
            // console.log("error", error)
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
        handleResendEmail,
        loader,
        alert
    };
};
