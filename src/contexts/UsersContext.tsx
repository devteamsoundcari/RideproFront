import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_USERS } from '../utils';

export const UsersContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

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

  return (
    <UsersContext.Provider
      value={{
        loadingUsers,
        users,
        setUsers,
        getUsers,
        allUsersLoaded,
        setAllUsersLoaded,
        count
      }}>
      {props.children}
    </UsersContext.Provider>
  );
};
