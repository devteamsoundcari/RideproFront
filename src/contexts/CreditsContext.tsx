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

  const updateUserCredits = async (userId: string, credits: number) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/`, { credits });
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      throw new Error('Error updating user credits');
    }
  };

  const newSale = async (data: any) => {
    setLoadingCredits(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    try {
      const response = await apiClient.post(API_ALL_CREDITS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const creditsUpdated = await updateUserCredits(data.user, data.credits);
      if (response && creditsUpdated) {
        return response;
      }
    } catch (error) {
      throw new Error('Error al crear la venta');
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
        count,
        newSale
      }}>
      {props.children}
    </CreditsContext.Provider>
  );
};
