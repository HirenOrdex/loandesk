import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { IResendEmailFormInput } from "../../types/auth";

export const useResendEmail = (navigate: NavigateFunction) => {
    const [loader, setLoader] = useState(false);
    // const [login] = useLoginMutation();
    const handleResendEmail = async (data: IResendEmailFormInput) => {
        setLoader(true);
        try {
            console.log("data", data)
            // const result: ILoginResponse = await login(data)?.unwrap();
            // setCookie("elevateWebUserData", JSON?.stringify(result?.data?.user), 1);
            // console.log("result", result?.data);
            // navigate("/dashboard");
        } catch (error: unknown) {
            console.log("error", error)
        } finally {
            setLoader(false);
        }
    };

    return {
        handleResendEmail,
        loader,
    };
};
