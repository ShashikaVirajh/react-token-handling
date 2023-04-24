import axios, { AxiosInstance, AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './store/store';
import { refreshAccessToken, setAccessToken, setRefreshToken } from './store/auth-slice';

type ResponseData = {
  data: any;
};

type TokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  // If the response is a success
  (response: ResponseData) => {
    return response.data;
  },
  // If the response is an error
  async (error: AxiosError) => {
    const dispatch = store.dispatch as AppDispatch;

    // const originalRequest = error?.config;

    if (error.response?.status === 401) {
      const refreshToken = useSelector((state: RootState) => state.auth.refreshToken) ?? '';
      const accessToken = useSelector((state: RootState) => state.auth.accessToken) ?? '';

      try {
        // Request to refresh the access token using current refresh token.
        // Once the tokens are received, they are stored in the auth slice.
        dispatch(refreshAccessToken(refreshToken));

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

export default axiosInstance;
