import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { ICommonRegisterFormInput, IBankerRegisterResponse } from "../../types/auth";
import { useRegisterUserMutation } from "../../services/authApi";

type RegisterType = "banker" | "borrower";
export const useBankerRegisterHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [registerBanker] = useRegisterUserMutation();

    const handleBankerRegister = async (data: ICommonRegisterFormInput, type: RegisterType) => {
        setLoader(true);
        try {
            const result: IBankerRegisterResponse = await registerBanker({
                body: data,
                type,
            }).unwrap();
            // setCookie("keymonoUserData", JSON.stringify(result?.data?.id), 1);
            console.log("Banker registration successful:", result?.data?.id);
            navigate("/dashboard"); // Or any other page
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setLoader(false);
        }
    };

    return {
        handleBankerRegister,
        loader,
    };
};
