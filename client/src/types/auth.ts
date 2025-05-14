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
export interface IForgotResponse {
    success: boolean;
    error: string;
    message: string;
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

export interface ICommonRegisterFormInput {
    financialInstitutionName: string;
    email: string;
    password: string;
    confirm_password: string;
    firstName: string;
    middleInitial?: string;
    lastName: string;
    phone: string;
    title: string;
    areaOfSpecialty?: string;
    address: IAddress[]; // 👈 changed from string to array of address objects
    bankType: string;
    assetSize: string;
}

// export interface IBankerRegisterFormInput {
//     financialInstitutionName: string;
//     email: string;
//     password: string;
//     firstName: string;
//     middleInitial?: string;
//     lastName: string;
//     phone: string;
//     title: string;
//     areaOfSpecialty?: string;
//     address: string;
//     bankType: string;
//     assetSize: string;
// }

export interface IBankerRegisterResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
    };
    error: any; // or `null` specifically if no other type is expected
}

export interface AlertState {
    type: "success" | "error";
    message: string;
}

export interface IUserLogin {
    email: string | null,
    password: string | null,
    accessToken:string|null,
    userId:string | null,
    refreshToken : string | null,
}