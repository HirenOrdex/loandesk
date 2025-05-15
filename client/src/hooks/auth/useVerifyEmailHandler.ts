import { useState } from "react";
import { useVerifyEmailMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { IVerifyEmailResponse } from "../../types/auth";
import { IAlertType } from "../../types/common";

export const useVerifyEmailHandler = () => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<IAlertType | null>(null); // ✅ define alert
    const [verifyEmail] = useVerifyEmailMutation();

    const handleVerifyEmail = async (userId: string, token: string) => {
        setLoader(true);
        try {
            let data: {userId: string, token: string} = {
                userId,
                token,
            }
            const result: IVerifyEmailResponse = await verifyEmail(data).unwrap();
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
