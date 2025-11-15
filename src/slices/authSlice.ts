import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import { RootState } from "../store";
import { API_BASE } from '../config';

interface AuthState {
    user: User | undefined;
    isLoggedIn: boolean; // Represents a valid auth token
    isAuthenticated: boolean; // Represents an active session (valid session token)
    authToken: string | null;
    sessionToken: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: undefined,
    isLoggedIn: false,
    isAuthenticated: false,
    authToken: null,
    sessionToken: null,
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.error || 'Login failed');
            }
            const userData = {
                id: data.user.id,
                name: data.user.name,
                phone_number: data.user.phone_number,
                email: data.user.email,
            };
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('authToken', data.auth_token);
            return { user: userData, authToken: data.auth_token };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const refreshSession = createAsyncThunk(
    'auth/refreshSession',
    async (_, { getState, rejectWithValue }) => {
        const { authToken } = (getState() as RootState).auth;
        if (!authToken) {
            return rejectWithValue('No auth token found');
        }
        try {
            const response = await fetch(`${API_BASE}/api/session/refresh`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message || 'Session refresh failed');
            }
            await AsyncStorage.setItem('sessionToken', data.session_token);
            return data.session_token;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('authToken');
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const userString = await AsyncStorage.getItem('user');
        const authToken = await AsyncStorage.getItem('authToken');
        if (userString && authToken) {
            const user = JSON.parse(userString);
            return { user, authToken };
        }
        return rejectWithValue('No user found');
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.authToken = action.payload.authToken;
            state.isLoggedIn = true;
            AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
            AsyncStorage.setItem('authToken', action.payload.authToken);
        },
        clearSession: (state) => {
            state.sessionToken = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.authToken = action.payload.authToken;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = undefined;
                state.authToken = null;
                state.sessionToken = null;
                state.isLoggedIn = false;
                state.isAuthenticated = false;
                state.status = 'idle';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.authToken = action.payload.authToken;
                state.isLoggedIn = true;
                state.status = 'succeeded';
            })
            .addCase(checkAuth.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(refreshSession.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(refreshSession.fulfilled, (state, action) => {
                state.sessionToken = action.payload;
                state.isAuthenticated = true;
                state.status = 'succeeded';
            })
            .addCase(refreshSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { setUser, clearSession } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.authToken;
export const selectSessionToken = (state: RootState) => state.auth.sessionToken;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;