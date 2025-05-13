import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { ILoginFormInput, ILoginResponse } from "../../types/auth";
import { useLoginMutation } from "../../services/authApi";

export const useLoginHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [login] = useLoginMutation();
    const handleLogin = async (data: ILoginFormInput) => {
        setLoader(true);
        try {
            console.log("data", data)
            const result: ILoginResponse = await login(data)?.unwrap();
            // setCookie("keymonoUserData", JSON?.stringify(result?.data?.user), 1);
            console.log("result", result?.data);
            navigate("/twofactorcode",{ state: { email: result?.data?.requestId } });
        } catch (error: unknown) {
            console.log("error", error)
        } finally {
            setLoader(false);
        }
    };

    return {
        handleLogin,
        loader,
    };
};
