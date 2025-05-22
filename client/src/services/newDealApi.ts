import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './commonServices/baseQueryWithErrorHandler';
import { IGetBorrowerCompanyResponse, INewDealStep1Form, INewDealStep1Response, INewDealStep2Form } from '../types/newDeal';


export const newDealApi = createApi({
    reducerPath: 'newDealApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        newDealBorrowerCompany: builder.mutation<INewDealStep1Response, INewDealStep1Form>({
            query: (data) => ({
                url: `/new-deal/borrower-company`,
                method: "POST",
                body: data,
            }),
        }),
        getBorrowerCompanyData: builder.query<IGetBorrowerCompanyResponse, string | undefined>({
            query: (id: string | undefined) => ({
                url: `/new-deal/borrower-company/${id}`,
                method: 'GET',
            }),
        }),
        newDealGuarantorsDetails: builder.mutation<void, { id: string | undefined; data: INewDealStep2Form }>({
            query: ({ id, data }) => ({
                url: `/new-deal/guarantors/${id}`,
                method: "POST",
                body: data,
            }),
        }),
        // getProfileData: builder.query<IGetProfileResponse, string | undefined>({
        //     query: (id: string | undefined) => ({
        //         url: `/user/profile/${id}`,
        //         method: 'GET',
        //     }),
        // }),
    }),
});

export const {
    useNewDealBorrowerCompanyMutation,
    useNewDealGuarantorsDetailsMutation,
    useGetBorrowerCompanyDataQuery
    // useGetProfileDataQuery,
} = newDealApi;
