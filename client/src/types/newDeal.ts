import AdditionalPeopleStep from "../pages/dashboard/newdeal/AdditionalPeopleStep";
import CompanyDetailsStep from "../pages/dashboard/newdeal/CompanyDetailsStep";
import DealStructureStep from "../pages/dashboard/newdeal/DealStructureStep";
import GuarantorDetailsStep from "../pages/dashboard/newdeal/GuarantorDetailsStep";
import { IAddress } from "./auth";

export interface INewDealStep1Form {
    companyName: string;
    legalEntity: string;
    businessPhone: string;
    address: string;
    website?: string;
    suite?: string;
};
export interface IMember {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    address: IAddress[];
    suite?: string;
    cellPhone: string;
    workPhone: string;
    title: string;
    permanentResident: string;
    guarantor: string;
    ownership: string;
}
export interface INewDealStep2Form {
    members: IMember[];
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

export type newDealStepFormMap = {
    0: INewDealStep1Form;
    1: INewDealStep2Form;
};
export const newDealStepFields: {
    [K in keyof newDealStepFormMap]: (keyof newDealStepFormMap[K])[];
} = {
    0: ["companyName", "legalEntity", "businessPhone", "address", "website", "suite"],
    1: ["members"],
};