import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";
import { IGetBorrowerCompanyResponse, NewDealFormStepData } from "../../types/newDeal";
import { newDealApi } from "../../services/newDealApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

export const useHandleStepApiAndSetData = (setValue: UseFormSetValue<NewDealFormStepData>) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleStepApiAndSetData = useCallback(async (step: number, dealDataRequestId: string) => {
            if (step == 0) {
                const result: IGetBorrowerCompanyResponse = await dispatch(
                    newDealApi.endpoints.getBorrowerCompanyData.initiate(dealDataRequestId)
                ).unwrap();
                const resultData = result?.data
                if (resultData) {
                    const stepData = resultData?.borrowerCompany;
                    setValue("companyName", stepData?.companyName ?? null);
                    setValue("legalEntity", stepData?.legalEntity ?? "");
                    setValue("businessPhone", stepData?.businessPhone ?? null);
                    setValue("address", stepData?.address);
                    setValue("website", stepData?.website ?? "");
                    setValue("suite", stepData?.suite ?? "");
                }
            }
            //  else if (step === 1) {
            //     const result = await dispatch(
            //         newDealApi.endpoints.getGuarantor.initiate(dealDataRequestId)
            //     ).unwrap();
            //     if (result?.data) {
            //         reset({
            //             guarantorName: result.data.guarantorName,
            //             email: result.data.email,
            //             // ... add more fields
            //         });
            //     }
            // }
            // Add more steps if needed
        },
        [dispatch, setValue]
    );

    return handleStepApiAndSetData;
};