import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState, ILoginFormInput, ILoginResponse } from "../../types/auth";
import { useLoginMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";

export const useLoginHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [login] = useLoginMutation();
    const handleLogin = async (data: ILoginFormInput) => {
        setLoader(true);
        try {
            const result: ILoginResponse = await login(data)?.unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    message: result?.message
                });
                navigate("/verify-code", { state: { email: result?.data?.requestId, successMsg: result?.message } });
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
        handleLogin,
        loader,
        alert
    };
};
