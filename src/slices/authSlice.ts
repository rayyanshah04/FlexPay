import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/user";
import { RootState } from "../store";


interface AuthState {
    user: User | undefined,
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: undefined,
    isAuthenticated: false 
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = undefined;
            state.isAuthenticated = false
        },
    },
});

export const { login, logout } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.user?.token;

export default authSlice.reducer;