export interface ILoginFormInput {
    email: string;
    password: string;
}

export interface IResendEmailFormInput {
    email: string;
}

interface UserDetails {
    userId: number;
    userName: string;
    name: string;
    email: string;
    address: string;
    phone_number: string;
    role: string;
    role_id: number;
    status: number;
    accessToken: string;
    refreshToken: string;
}

export interface ILoginResponse {
    success: boolean;
    data: {
        user: UserDetails;
        requestId: string;
    };
    error: string;
    message: string;
}

export interface IErrorResponse {
    status: number;
    data: {
        success: boolean;
        data?: [];
        error?: string;
        message?: string;
        errors?: {
            field: string;
            message: string
        }[];
    };
    error?: string | null;
}
export interface ISuccessResponse {
    status: number;
    success: boolean;
    data: unknown;
    error: string | null;
    message: string;
    msg: string;
}

export interface IOTPFormInput {
    email: string;
    otp: string
}