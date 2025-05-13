import { useSelector, TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit/react";
import { authApi } from "../services/authApi";
import AuthReducer from "./reducers/AuthSlice";



// Create the Redux store
const store = configureStore({
    reducer: {
        auth: AuthReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(
            authApi.middleware,
        ),
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for dispatch and selector
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;