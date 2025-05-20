import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './commonServices/baseQueryWithErrorHandler';
import { IGetProfileResponse, IProfileFormInput, IProfileResponse } from '../types/profile';


export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        myprofile: builder.mutation<IProfileResponse, { id: string | undefined; data: IProfileFormInput }>({
            query: ({ id, data }) => ({
                url: `/api/profile/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),
        getProfileData: builder.query<IGetProfileResponse, string | undefined>({
            query: (id: string | undefined) => ({
                url: `/api/profile/${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useMyprofileMutation,
    useGetProfileDataQuery,
} = profileApi;
