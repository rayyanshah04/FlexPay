import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/user";


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
export default authSlice.reducer;