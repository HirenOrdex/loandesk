import { useParams } from "react-router-dom";
import { useVerifyEmailHandler } from "../hooks/auth/useVerifyEmailHandler";
import { useEffect } from "react";
import MessageModal from "../models/MessageModal";
import Loader from "../components/Loader";

const RegisterVerifyEmail = () => {
    const { token } = useParams();
    const { handleVerifyEmail, alert } = useVerifyEmailHandler();

    useEffect(() => {
        if (token) {
            handleVerifyEmail(token);
        }
    }, [token]);

    return (
        <>
            {!alert && <Loader/>}
            {alert && (
                <MessageModal
                    type={alert.type}
                    header={alert.header}
                    message={alert.message}
                    navigation="/login"
                />
            )}
        </>
    );
}

export default RegisterVerifyEmail;