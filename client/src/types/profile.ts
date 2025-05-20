import { IAddress } from "./auth";

export interface IProfileAddress {
    address1: string;
    address2?: string;
    city?: string;
    state: string;
    zip?: string;
    country: string;
    suiteNo?: string;
    fulladdress: string;
}

// export interface IProfileFormInput {
//     firstName: string;
//     middleName?: string;
//     lastName: string;
//     cellPhone: string;
//     workPhone?: string;
//     email2?: string;
//     websiteUrl?: string;
//     linkedinUrl?: string;
//     address: IProfileAddress;
//     profileImage?: string;
// }

export interface IProfileFormInput {
    firstName: string;
    middleInitial?: string;
    lastName: string;
    phone: string;
    workPhone?: string;
    address: IAddress[];
    suiteNo?: string;
    email: string;
    email2?: string;
    webUrl?: string;
    linkedinUrl?: string;
    profileImage: File | null;
};
export interface IGetProfileResponse {
    success: boolean;
    data: {
        firstName: string;
        middleInitial?: string;
        lastName: string;
        phone: string;
        workPhone?: string;
        // addressId: string;
        suiteNo?: string;
        email: string;
        email2?: string;
        webUrl?: string;
        linkedinUrl?: string;
        profileImage: File | null;
        userAddress: IAddress[];
    };
    message: string;
}
export interface IProfileResponse {
    success: boolean;
    data: any;
    error: string | null;
    message: string;
}
