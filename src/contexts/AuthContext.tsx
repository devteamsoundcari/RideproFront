import React, { createContext, useEffect, useState } from 'react';
import { getUserInfo } from '../controllers/apiRequests';
import ApiClientSingleton from '../controllers/apiClient';
import {
  API_LOGIN_URL,
  API_USER_DATA,
  API_LOGOUT_URL
} from '../utils/constants';

const apiClient = ApiClientSingleton.getApiInstance();

export const AuthContext: any = createContext('');

export interface IUser {
  name: string;
}

export const AuthContextProvider = (props) => {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState(null as any);

  const updateUserInfo = async () => {
    let newUserInfo = await getUserInfo();
    newUserInfo.name = newUserInfo.first_name;
    newUserInfo.lastName = newUserInfo.last_name;
    newUserInfo.first_name = null;
    newUserInfo.last_name = null;
    newUserInfo.perfil =
      newUserInfo.profile === 1
        ? 'admin'
        : newUserInfo.profile === 2
        ? 'cliente'
        : newUserInfo.profile === 3
        ? 'operaciones'
        : newUserInfo.profile === 5
        ? 'tecnico'
        : '';

    setUserInfo(newUserInfo);
  };

  const checkLoggedInStatus = async () => {
    const userData = localStorage.getItem('User');
    if (userData) {
      setUserInfo(JSON.parse(userData));
      if (localStorage.getItem('Token')) {
        setIsAuthenticated(true);
      }
    }
  };

  useEffect(() => {
    checkLoggedInStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = async () => {
    try {
      const response = await apiClient.get(API_USER_DATA);
      localStorage.setItem('User', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      setAuthError(error);
      return error;
    }
  };

  const loginUser = async ({ email, password }) => {
    setLoadingAuth(true);
    try {
      const response = await apiClient.post(API_LOGIN_URL, {
        email,
        password
      });
      localStorage.setItem('Token', response.data.key);
      const userData: any = await getUserData();
      setUserInfo(userData);
      setIsAuthenticated(true);
      setLoadingAuth(false);
      return userData;
    } catch (error) {
      setAuthError(error);
      setLoadingAuth(false);
      return error;
    }
  };

  const logOutUser = async () => {
    setLoadingAuth(true);
    try {
      await apiClient.post(API_LOGOUT_URL, {});
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      window.open('/', '_self');
    } catch (error) {
      setAuthError(error);
      setLoadingAuth(false);
      return error;
    }
  };

  return (
    <AuthContext.Provider
      value={
        {
          userInfo,
          setUserInfo,
          isAuthenticated,
          updateUserInfo,
          loadingAuth,
          loginUser,
          authError,
          logOutUser
        } as any
      }>
      {props.children}
    </AuthContext.Provider>
  );
};
