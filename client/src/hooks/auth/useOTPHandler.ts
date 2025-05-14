import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState, ILoginResponse, IOTPFormInput, IResendOTPFormInput } from "../../types/auth";
import { useResendOTPMutation, useVerifyOTPMutation } from "../../services/authApi";
import { setCookie } from "../../services/commonServices/cookie";
import { isIErrorResponse } from "../useIsIErrorResponse";

export const useOTPHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [verifyOTP] = useVerifyOTPMutation();
    const [resendOTP] = useResendOTPMutation()

    const handleOTPSubmit = async (data: IOTPFormInput) => {
        setLoader(true);
        try {
            const result: ILoginResponse = await verifyOTP(data)?.unwrap();
            if ('data' in result) {
                setCookie("keymonoUserData", JSON?.stringify(result?.data?.user), 1);
                setAlert({
                    type: "success",
                    message: result?.message
                });
                navigate("/dashboard");
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

    const handleResendOTP = async (data: IResendOTPFormInput) => {
        setLoader(true);
        try {
            const result: ILoginResponse = await resendOTP(data)?.unwrap();
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
        handleOTPSubmit,
        handleResendOTP,
        loader,
        alert
    };
};
