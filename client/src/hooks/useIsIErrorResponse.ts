import { IErrorResponse } from "../types/auth";

export const isIErrorResponse = (error: unknown): error is IErrorResponse => {
    if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "data" in error
    ) {
        const err = error as { data: unknown };
        if (typeof err.data === "object" && err.data !== null) {
            return "message" in err.data || "error" in err.data;
        }
    }
    return false;
};
