import { NavigateFunction } from "react-router-dom";

export const useRedirectDashboard = (role: string, navigate: NavigateFunction) => {
    if (role === "Banker") {
        navigate("/dashboard");
    } else if (role === "Borrower") {
        navigate("/borrower");
    } else if (role === "Admin") {
        navigate("/admin");
    } else if (role === "COI") {
        navigate("/coi");
    } else if (role === "Guarantor") {
        navigate("/guarantor");
    }else {
        navigate("/sign-in");
    }
}