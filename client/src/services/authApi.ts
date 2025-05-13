import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandler } from './commonServices/baseQueryWithErrorHandler';
import { IBankerRegisterResponse, ICommonRegisterFormInput, IForgotFormInput, IForgotResponse, ILoginFormInput, ILoginResponse, IOTPFormInput } from '../types/auth';

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
    forgotpassword: builder.mutation<IForgotResponse, IForgotFormInput>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation<
      IBankerRegisterResponse,
      { body: ICommonRegisterFormInput; type: "banker" | "borrower" }
    >({
      query: ({ body, type }) => ({
        url: `/auth/register?type=${type}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation,
  useVerifyOTPMutation, useForgotpasswordMutation, useRegisterUserMutation,
} = authApi;
