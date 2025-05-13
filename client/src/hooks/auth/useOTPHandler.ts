import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { ILoginResponse, IOTPFormInput } from "../../types/auth";
import { useVerifyOTPMutation } from "../../services/authApi";
import { setCookie } from "../../services/commonServices/cookie";

export const useOTPHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [verifyOTP] = useVerifyOTPMutation();
    const handleOTPSubmit = async (data: IOTPFormInput) => {
        setLoader(true);
        try {
            console.log("data", data)
            const result: ILoginResponse = await verifyOTP(data)?.unwrap();
            setCookie("keymonoUserData", JSON?.stringify(result?.data?.user), 1);
            console.log("result", result?.data?.user);
            navigate("/dashboard");
        } catch (error: unknown) {
            console.log("error", error)
        } finally {
            setLoader(false);
        }
    };

    return {
        handleOTPSubmit,
        loader,
    };
};
