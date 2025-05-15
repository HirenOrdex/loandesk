import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AlertState } from "../../types/auth";
import { useLogoutMutation } from "../../services/authApi";
import { isIErrorResponse } from "../useIsIErrorResponse";
import { removeCookie } from "../../services/commonServices/cookie";

export const useLogoutHandler = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        setLoader(true);
        try {
            const response = await logout().unwrap();

            if (response?.success) {
                setAlert({
                    type: "success",
                    message: response?.message || "Logged out successfully",
                });

                removeCookie("keymonoUserData");
                navigate("/sign-in");
            } else {
                setAlert({
                    type: "error",
                    message: response?.message || "Logout failed",
                });
            }
        } catch (error: unknown) {
            if (isIErrorResponse(error)) {
                setAlert({
                    type: "error",
                    message: error?.data?.message || "Something went wrong. Please try again.",
                });
            }
        } finally {
            setLoader(false);
        }
    };

    return {
        handleLogout,
        loader,
        alert,
    };
};