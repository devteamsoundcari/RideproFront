import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_CREDITS } from '../utils/constants';

export const CreditsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const CreditsContextProvider = (props) => {
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [credits, setCredits] = useState<any>([]);
  const [allCreditsLoaded, setAllCreditsLoaded] = useState(false);
  const [count, setCount] = useState(0);

  const getCredits = async (page?: string) => {
    setLoadingCredits(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setCredits((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getCredits(response.data.next);
        } else {
          setAllCreditsLoaded(true);
          setLoadingCredits(false);
        }
      } catch (error) {
        setCredits(error);
        setLoadingCredits(false);
      }
    } else {
      try {
        setCredits([]);
        const response = await apiClient.get(API_ALL_CREDITS);
        setCount(response.data.count);
        if (response.data.next) {
          return await getCredits(response.data.next);
        } else {
          setAllCreditsLoaded(true);
          setLoadingCredits(false);
        }
      } catch (error) {
        setCredits(error);
        setLoadingCredits(false);
      }
    }
  };

  return (
    <CreditsContext.Provider
      value={{
        loadingCredits,
        credits,
        setCredits,
        getCredits,
        allCreditsLoaded,
        setAllCreditsLoaded,
        count
      }}>
      {props.children}
    </CreditsContext.Provider>
  );
};
