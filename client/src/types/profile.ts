export interface IProfileAddress {
    address1: string;
    address2?: string;
    city?: string;
    state: string;
    zip?: string;
    country: string;
    suiteNo?: string;
}

export interface IProfileFormInput {
    firstName: string;
    middleName?: string;
    lastName: string;
    cellPhone: string;
    workPhone?: string;
    email2?: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    address: IProfileAddress;
    profileImage?: string;
}

export interface IProfileResponse {
    success: boolean;
    data: any;
    error: string | null;
    message: string;
}
  