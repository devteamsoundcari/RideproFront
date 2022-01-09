import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_USERS, API_REGISTRATION_URL } from '../utils';

export const UsersContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export interface INewUser {
  first_name: string;
  last_name: string;
  charge: string;
  password1: string;
  password2: string;
  company: string;
  profile: string;
  email: string;
  gender: string;
}

export const UsersContextProvider = (props) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const [allUsersLoaded, setAllUsersLoaded] = useState(false);
  const [count, setCount] = useState(0);

  const getUsers = async (page?: string) => {
    setLoadingUsers(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setUsers((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getUsers(response.data.next);
        } else {
          setAllUsersLoaded(true);
          setLoadingUsers(false);
        }
      } catch (error) {
        setUsers(error);
        setLoadingUsers(false);
      }
    } else {
      try {
        setUsers([]);
        const response = await apiClient.get(API_ALL_USERS);
        setCount(response.data.count);
        if (response.data.next) {
          return await getUsers(response.data.next);
        } else {
          setAllUsersLoaded(true);
          setLoadingUsers(false);
        }
      } catch (error) {
        setUsers(error);
        setLoadingUsers(false);
      }
    }
  };

  const addNewUser = async (user: any) => {
    setLoadingUsers(true);
    try {
      const res = await apiClient.post(API_REGISTRATION_URL, user);
      setLoadingUsers(false);
      return res;
    } catch (error) {
      setLoadingUsers(false);
      throw new Error('Error adding the user');
    }
  };

  return (
    <UsersContext.Provider
      value={{
        loadingUsers,
        users,
        setUsers,
        getUsers,
        allUsersLoaded,
        setAllUsersLoaded,
        count,
        addNewUser
      }}>
      {props.children}
    </UsersContext.Provider>
  );
};
