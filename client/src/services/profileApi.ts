import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './commonServices/baseQueryWithErrorHandler';
import { IProfileFormInput, IProfileResponse } from '../types/profile';


export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        myprofile: builder.mutation<IProfileResponse, { id: string; data: IProfileFormInput }>({
            query: ({id, data}) => ({
                url: `/api/profile/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),

    }),
});

export const {
    useMyprofileMutation,
} = profileApi;
