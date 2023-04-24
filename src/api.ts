import axios, { AxiosInstance, AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './store/store';
import { refreshAccessToken, setAccessToken, setRefreshToken } from './store/auth-slice';
import axiosRetry from 'axios-retry';

type ResponseData = {
  data: any;
};

type TErrorResponse = {
  error: string;
  message: string;
};

type TApiError = AxiosError<TErrorResponse>;

const API_BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Allow to send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: TApiError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  // If the response is a success
  (response: ResponseData) => {
    return response.data;
  },
  // If the response is an error
  async (error: AxiosError) => {
    const dispatch = store.dispatch as AppDispatch;

    const refreshToken = useSelector((state: RootState) => state.auth.refreshToken) ?? '';

    if (error.response?.status === 401) {
      try {
        // Request a new access token using the current refresh token.
        // Once the tokens are received, they are stored in the auth reducer.
        await dispatch(refreshAccessToken(refreshToken));

        const accessToken = useSelector((state: RootState) => state.auth.accessToken) ?? '';

        // Resend the original request with the new access token.
        const originalRequest = error.config;
        if (!originalRequest) throw error;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        // TODO: Dispatch logout action here..

        dispatch(setAccessToken(null));
        dispatch(setRefreshToken(null));

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount: number) => retryCount * 1000,
  retryCondition: (error: AxiosError) => error.code === 'ETIMEDOUT' // Only retry on timeout errors
});

export { axiosInstance };
