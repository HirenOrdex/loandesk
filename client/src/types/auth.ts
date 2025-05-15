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
export interface IResendOTPFormInput {
    email: string;
}
export interface IResetPasswordFormInput {
    password: string;
    token: string;
    confirmPassword?: string;
}
export interface IForgotResponse {
    success: boolean;
    error: string;
    message: string;
}
export interface IChangePassword {
    oldPassword: string
    newPassword: string
    confirmPassword?: string
}

export interface IForgotFormInput {
    email: string;
}

export interface IAddress {
    address1: string | null;
    address2: string | null;
    city: string;
    state: string;
    zip: string | null;
    country: string;
    longitude: string;
    latitude: string;
    fulladdress: string;
    suiteno: string;
}

export interface IBankerRegisterFormInput {
    financialInstitutionName: string;
    email: string;
    password: string;
    confirm_password: string;
    firstName: string;
    middleInitial?: string;
    lastName: string;
    phone: string;
    title: string;
    areaOfSpecialty: string;
    address: IAddress[];
    bankType: string;
    assetSize: string;
}

export interface IBorrowerRegisterFormInput {
    email: string;
    password: string;
    confirm_password: string;
    firstName: string;
    middleInitial?: string;
    lastName: string;
    phone: string;
    position: string;
    other_position?: string;
    coname: string;
    captchaCode: string;
}

export interface IBankerRegisterResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        name: string;
    };
    error: any;
}

export interface IBorrowerRegisterResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        name: string;
    };
    error: any; 
}

export interface ILogoutResponse {
    success: boolean;
    data: null;
    error: string | null;
    message: string;
}
  

export interface AlertState {
    type: "success" | "error";
    message: string;
}

export interface IUserLogin {
    email: string | null,
    password: string | null,
    accessToken: string | null,
    userId: string | null,
    refreshToken: string | null,
}

export interface IVerifyEmailResponse {
    success: boolean;
    error: string;
    message: string;
    data: {
        requestId: string;
    };
}

export interface IUserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'Admin' | 'Banker' | 'Borrower' | 'Coi' | 'Guarantor'; // Add other roles as needed
    accessToken: string;
}