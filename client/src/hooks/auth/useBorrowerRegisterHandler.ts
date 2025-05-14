import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState, IBorrowerRegisterFormInput, IBorrowerRegisterResponse } from "../../types/auth";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { useRegisterBorrowerMutation } from "../../services/authApi";

export const useBorrowerRegisterHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [registerBorrower] = useRegisterBorrowerMutation();
    const [displayPopup, setDisplayPopup] = useState<boolean>(false);

    const handleBorrowerRegister = async (data: IBorrowerRegisterFormInput) => {
        setLoader(true);
        try {
            const result: IBorrowerRegisterResponse = await registerBorrower(data).unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    message: result?.message
                });
            console.log("Borrower registration successful:", result?.data);
            setDisplayPopup(true);
            navigate("/login");
            }
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
        handleBorrowerRegister,
        loader,
        displayPopup,
        alert
    };
};
