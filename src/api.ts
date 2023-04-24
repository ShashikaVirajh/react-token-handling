import axios from 'axios';

const baseURL = 'https://your-api-base-url.com/';

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const handleAccessToken = (token: string | null) => {
  accessToken = token;
};

export const handleRefreshToken = (token: string | null) => {
  refreshToken = token;
};

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<TokenResponse>(`${baseURL}/auth/refresh`, {
          refreshToken
        });

        handleAccessToken(response.data.accessToken);
        handleRefreshToken(response.data.refreshToken);

        return api(originalRequest);
      } catch (err) {
        console.log('Error refreshing token:', err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
