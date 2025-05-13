import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { ICommonRegisterFormInput, IBankerRegisterResponse, AlertState } from "../../types/auth";
import { useRegisterUserMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";

type RegisterType = "banker" | "borrower";
export const useBankerRegisterHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [registerBanker] = useRegisterUserMutation();
    const [displayPopup, setDisplayPopup] = useState<boolean>(false);

    const handleBankerRegister = async (data: ICommonRegisterFormInput, type: RegisterType) => {
        setLoader(true);
        try {
            const result: IBankerRegisterResponse = await registerBanker({
                body: data,
                type,
            }).unwrap();
            setAlert({
                type: "success",
                message: result?.message
            });
            console.log("Banker registration successful:", result?.data?.id);
            setDisplayPopup(true);
            navigate("/login"); 
        } catch (error) {
            console.error("Registration error:", error);
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
        handleBankerRegister,
        loader,
        displayPopup,
        setDisplayPopup,
        alert
    };
};
