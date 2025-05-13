import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState, ILoginResponse, IOTPFormInput } from "../../types/auth";
import { useVerifyOTPMutation } from "../../services/authApi";
import { setCookie } from "../../services/commonServices/cookie";
import { isIErrorResponse } from "../useIsIErrorResponse";

export const useOTPHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [verifyOTP] = useVerifyOTPMutation();
    const handleOTPSubmit = async (data: IOTPFormInput) => {
        setLoader(true);
        try {
            const result: ILoginResponse = await verifyOTP(data)?.unwrap();
            setCookie("keymonoUserData", JSON?.stringify(result?.data?.user), 1);
            setAlert({
                type: "success",
                message: result?.message
            });
            navigate("/dashboard");
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
        handleOTPSubmit,
        loader,
        alert
    };
};
