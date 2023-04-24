import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type TAuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: TAuthState = {
  accessToken: null,
  refreshToken: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
  }
});

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (refreshToken: string) => {
    /** Requesting a new access token using our refresh token.
     * Server will create a new access token and send it to the frontend.
     * Refresh token is required to authenticate the user here.
     */
    const { data } = await axios.post('/api/auth/refreshToken', {
      refreshToken
    });

    return data;
  }
);

export const { setAccessToken, setRefreshToken } = authSlice.actions;

export const authReducer = authSlice.reducer;
