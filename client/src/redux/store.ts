import { useSelector, TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit/react";
import { authApi } from "../services/authApi";
import AuthReducer from "./reducers/AuthSlice";
import { profileApi } from "../services/profileApi";
import storage from 'redux-persist/lib/storage';
import NewDealReducer from "./reducers/NewDealSlice";
import { persistReducer } from "redux-persist";
import { newDealApi } from "../services/newDealApi";

// Persist config
const newDealPersistenceConfig = {
    key: 'newDealPersistence',
    storage,
};

// Create a persisted reducer for TabAccess
const persistedNewDealReducer = persistReducer(newDealPersistenceConfig, NewDealReducer);


// Create the Redux store
const store = configureStore({
    reducer: {
        auth: AuthReducer,
        newDeal: persistedNewDealReducer,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [newDealApi.reducerPath]: newDealApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(
            authApi.middleware,
            profileApi.middleware,
            newDealApi.middleware,
        ),
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for dispatch and selector
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;