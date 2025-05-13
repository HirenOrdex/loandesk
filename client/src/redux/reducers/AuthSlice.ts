import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedOutUser:  boolean;
}

const initialState: AuthState = {
    isLoggedOutUser: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    isLoggedUser: (state, action) => {
        state.isLoggedOutUser = action?.payload;
      },
  },
});


export const AuthServices = {
  actions: authSlice.actions, //This includes all the action methods written above
}
const AuthReducer = authSlice.reducer //This is stored in the main store
export default AuthReducer
