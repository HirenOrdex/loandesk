import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from '../../redux/store';
import { getCookie } from './cookie';
import { IUserLogin } from '../../types/auth';

const BASE_URL: string = import.meta.env.VITE_REACT_BASE_URL as string;
// type BaseQueryWithErrorHandler = BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// >;

export const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, { extraOptions }) => {
    // Define extraOptions with proper type
    const options = extraOptions as { dispatch?: typeof store.dispatch; resourcename?: string } | undefined;

    const dispatch = options?.dispatch || (() => { });
    const userData = getCookie("keymonoUserData", dispatch) as IUserLogin | null;
    // const rawResourcePolicy = getCookie("exportResourcePolicy", dispatch);
    // const userPolicy = typeof rawResourcePolicy === "string" ? JSON.parse(rawResourcePolicy) : rawResourcePolicy || {};



    const token = userData?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // if (userData?.refreshToken) {
    //   headers.set('refreshToken', userData.refreshToken);
    // }
    // if (userPolicy?.roleId) {
    //   headers.set('roleid', userPolicy.roleId);
    // }

    // // ✅ Set resourcename dynamically from extraOptions
    // if (options?.resourcename) {
    //   headers.set('resourcename', options.resourcename);
    // }

    // if (userData?.userId) {
    //   headers.set('userid', userData?.userId);
    // }

    return headers;
  },
});


// Custom base query to handle specific status codes
// export const baseQueryWithErrorHandler: BaseQueryWithErrorHandler = async (args, api, extraOptions) => {
//   const result = await baseQuery(args, api, extraOptions);

//   // Handle error messages globally
//   if (result?.error) {
//     const error = result?.error as IErrorResponse; // Cast error to IErrorResponse type
//     const status = error?.status;
//     let errorMessage = error?.data?.message || 'An unexpected error occurred'; // Accessing error message from `data.error`

//     // If errors array exists, concatenate all error messages
//     if (error?.data?.errors?.length) {
//       errorMessage = error?.data?.errors?.map(err => err?.message)?.join(", ");
//     }
//     // errorHandlingInterceptors(status, errorMessage,dispatch); // Handle the error globally (e.g., show toast)
//     const method = (args as FetchArgs)?.method?.toUpperCase();
//     if (method !== 'GET' && errorMessage) {
//       errorHandlingInterceptors(status, errorMessage, api.dispatch);
//     }
//     if (status === 440) {
//       errorHandlingInterceptors(status, errorMessage, api.dispatch);
//     }
//   }


//   // Handle successful responses globally
//   if (result?.data) {
//     const success = result?.data as ISuccessResponse;
//     const successMessage = success?.message || success?.msg || ''
//     // successHandlingInterceptors(successMessage);
//     // Check if the request method is not GET before showing success toast
//     const method = (args as FetchArgs)?.method?.toUpperCase();
//     if (method !== 'GET' && successMessage) {
//       successHandlingInterceptors(successMessage);
//     }
//   }

//   return result;
// };

