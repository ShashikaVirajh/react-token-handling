import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleAccessToken, handleRefreshToken } from '../api';

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      // handleAccessToken(action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      // handleRefreshToken(action.payload);
    }
  }
});

export const { setAuth, setAccessToken, setRefreshToken } = authSlice.actions;

export const authReducer = authSlice.reducer;
