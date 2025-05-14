import { useState } from "react";
import { IBankerRegisterResponse, AlertState, IBankerRegisterFormInput } from "../../types/auth";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { useRegisterBankerMutation } from "../../services/authApi";

export const useBankerRegisterHandler = () => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [registerBanker] = useRegisterBankerMutation();
    const [displayPopup, setDisplayPopup] = useState<boolean>(false);

    const handleBankerRegister = async (data: IBankerRegisterFormInput) => {
        setLoader(true);
        try {
            const result: IBankerRegisterResponse = await registerBanker(data).unwrap();
            if ('data' in result) {
                setAlert({
                    type: "success",
                    message: result?.message
                });
            console.log("Banker registration successful:", result?.data);
            setDisplayPopup(true);
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
        handleBankerRegister,
        loader,
        displayPopup,
        alert
    };
};
