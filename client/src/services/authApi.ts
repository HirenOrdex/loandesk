import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './commonServices/baseQueryWithErrorHandler';
import { IBankerRegisterFormInput, IBankerRegisterResponse, IBorrowerRegisterFormInput, IBorrowerRegisterResponse, IChangePassword, IForgotFormInput, IForgotResponse, ILoginFormInput, ILoginResponse, ILogoutResponse, IOTPFormInput, IResendOTPFormInput, IResetPasswordFormInput } from '../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
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
    resendOTP: builder.mutation<ILoginResponse, IResendOTPFormInput>({
      query: (data) => ({
        url: "/auth/resend-otp",
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
    resendEmail: builder.mutation<ILoginResponse, IForgotFormInput>({
      query: (data) => ({
        url: "/auth/resend-email",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ILoginResponse, IResetPasswordFormInput>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation<ILoginResponse, IChangePassword>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    registerBanker: builder.mutation<IBankerRegisterResponse, IBankerRegisterFormInput>({
      query: (data) => ({
        url: "/auth/register?type=banker",
        method: "POST",
        body: data,
      }),
    }),
    registerBorrower: builder.mutation<IBorrowerRegisterResponse, IBorrowerRegisterFormInput>({
      query: (data) => ({
        url: "/auth/register?type=borrower",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `/auth/verfiy-email/${data?.userId}/${data?.token}`,
        method: "GET"
      }),
    }),
    logout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    
  }),
});

export const { 
  useLoginMutation,
  useVerifyOTPMutation,
  useForgotpasswordMutation,
  useResendEmailMutation,
  useResendOTPMutation,
  useRegisterBankerMutation,
  useRegisterBorrowerMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useChangePasswordMutation
} = authApi;
