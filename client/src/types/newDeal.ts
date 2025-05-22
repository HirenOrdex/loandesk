import AdditionalPeopleStep from "../pages/dashboard/newdeal/AdditionalPeopleStep";
import CompanyDetailsStep from "../pages/dashboard/newdeal/CompanyDetailsStep";
import DealStructureStep from "../pages/dashboard/newdeal/DealStructureStep";
import GuarantorDetailsStep from "../pages/dashboard/newdeal/GuarantorDetailsStep";
import { IAddress } from "./auth";

export interface INewDealStep1Form {
    companyName: string;
    legalEntity: string;
    businessPhone: string;
    address: IAddress[];
    website?: string;
    suite?: string;
};
export interface IMember {
    person: {
        firstName: string;
        middleInitial?: string;
        lastName: string;
        email1: string;
        address: IAddress[];
        suiteNo?: string;
        phone: string;
        workPhone: string;
        title: string;
        isUsCitizen: string;
    }
    isGuarantor: string;
    percentageOfOwnership: number
}
export interface INewDealStep2Form {
    guarantors: IMember[]
}
export const newDealSteps = [
    "Company Details",
    "Guarantor Details",
    "Deal Structure Details",
    "Additional People Details",
];
export const newDealStepComponents = [
    CompanyDetailsStep,
    GuarantorDetailsStep,
    DealStructureStep,
    AdditionalPeopleStep,
];
export type NewDealFormStepData =
    | INewDealStep1Form
    | INewDealStep2Form

export type newDealStepResponse = 
    | IGetBorrowerCompanyResponse;
export type newDealStepFormMap = {
    0: INewDealStep1Form;
    1: INewDealStep2Form;
};
export const newDealStepFields: {
    [K in keyof newDealStepFormMap]: (keyof newDealStepFormMap[K])[];
} = {
    0: ["companyName", "legalEntity", "businessPhone", "address", "website", "suite"],
    1: ["guarantors"],
};

export interface INewDealStep1Response {
    success: boolean;
    data: {
        borrowerCompany: {
            companyName: string;
            _id: string;
        };
        dealDataRequestId: string;
    };
    message: string;
    error: any;
}

export interface IGetBorrowerCompanyResponse {
    success: boolean;
    data: {
        referenceNo: string;
        borrowerCompanyId: string;
        currentStep: number;
        requestedDate: string;
        saveStatus: string;
        active: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
        borrowerCompany: {
            companyName: string;
            legalEntity: string;
            businessPhone: string;
            website: string;
            // addressId: string;
            suite: string;
            isDelete: boolean;
            createdAt: string;
            updatedAt: string;
            __v: number;
            borrowerCompanyId: string;
            address: IAddress[];
        };
        dealDataRequestId: string;
    };
    message: string;
    error: any;
}
