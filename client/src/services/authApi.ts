import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandler } from './commonServices/baseQueryWithErrorHandler';
import { ILoginFormInput, ILoginResponse, IOTPFormInput } from '../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginFormInput>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation<ILoginResponse, IOTPFormInput>({
      query: (data) => ({
        url: "/auth/verfiy-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { useLoginMutation,
  useVerifyOTPMutation,
 } = authApi;
