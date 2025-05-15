import { useParams } from "react-router-dom";
import { useVerifyEmailHandler } from "../hooks/auth/useVerifyEmailHandler";
import { useEffect } from "react";
import MessageModal from "../models/MessageModal";
import Loader from "../components/Loader";

const RegisterVerifyEmail = () => {
    const { userId, token } = useParams();
    const { handleVerifyEmail, alert } = useVerifyEmailHandler();

    useEffect(() => {
        if (userId && token) {
            handleVerifyEmail(userId, token);
        }
    }, [userId, token]);

    return (
        <>
            {!alert && <Loader/>}
            {alert && (
                <MessageModal
                    type={alert.type}
                    header={alert.header}
                    message={alert.message}
                    navigation="/sign-in"
                />
            )}
        </>
    );
}

export default RegisterVerifyEmail;