import { useState } from "react";
import { useVerifyEmailMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { IVerifyEmailResponse } from "../../types/auth";
import { IAlertType } from "../../types/common";

export const useVerifyEmailHandler = () => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<IAlertType | null>(null); // ✅ define alert
    const [verifyEmail] = useVerifyEmailMutation();

    const handleVerifyEmail = async (token: string) => {
        setLoader(true);
        try {
            const result: IVerifyEmailResponse = await verifyEmail({ token }).unwrap(); // ✅ simplified
            setAlert({
                type: "success",
                header: "Email Verification: Success",
                message: result.message,
            });
        } catch (error: unknown) {
            if (isIErrorResponse(error)) {
                setAlert({
                    type: "error",
                    header: "Email Verification: Failure",
                    message: error?.data?.message || "Something went wrong. Please try again.",
                });
            }
        } finally {
            setLoader(false);
        }
    };

    return {
        handleVerifyEmail,
        loader,
        alert,
    };
};
