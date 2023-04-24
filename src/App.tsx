import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';

import { setAccessToken, setRefreshToken } from './store/auth-slice';
// import api from './api';

export const App = () => {
  const dispatch = useDispatch();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        /** This is a mock API call. Real API call should be similar to this. */
        // const response = await api.post<TLoginResponse>('/auth/login', loginData);

        const response: TLoginResponse = {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          expiredIn: 3600
        };

        dispatch(setAccessToken(response.accessToken));
        dispatch(setRefreshToken(response.refreshToken));
      } catch (error) {
        console.log('Error occured:', error);
      }
    };

    if (!accessToken && !refreshToken) {
      fetchTokens();
    }
  }, [accessToken, refreshToken, dispatch]);

  return <div>React Token Handling</div>;
};

type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiredIn: number;
};
