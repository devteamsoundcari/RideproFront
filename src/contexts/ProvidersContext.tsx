import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_PROVIDERS_SEARCH, API_ALL_PROVIDERS } from '../utils';

export const ProvidersContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();
interface INewProvider {
  name: string;
  lastName: string;
  email: string;
  officialId: number;
  cellPhone: number;
}

export const ProvidersContextProvider = (props) => {
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providers, setProviders] = useState<any>([]);

  // ==================== GET PROVIDERS BY CITY NAME ========================
  const getProvidersByCity = async (cityName: string, page: any) => {
    setLoadingProviders(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setProviders((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingProviders(false);
        if (response.data.next) return await getProvidersByCity(cityName, response.data.next);
      } catch (error) {
        setProviders(error);
        setLoadingProviders(false);
      }
    } else {
      setProviders([]);
      try {
        const response = await apiClient.get(`${API_PROVIDERS_SEARCH}${cityName}`);
        setProviders((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingProviders(false);
        if (response.data.next) return await getProvidersByCity(cityName, response.data.next);
      } catch (error) {
        setProviders(error);
        setLoadingProviders(false);
      }
    }
  };

  // ====================== CREATE AN INSTRUCTOR ========================
  const addProvider = async (payload: INewProvider) => {
    setLoadingProviders(true);
    try {
      const response = apiClient.post(API_ALL_PROVIDERS, payload);
      setLoadingProviders(false);
      return response;
    } catch (error) {
      setLoadingProviders(false);
      return error;
    }
  };

  return (
    <ProvidersContext.Provider
      value={{
        loadingProviders,
        providers,
        getProvidersByCity,
        setProviders,
        addProvider
      }}>
      {props.children}
    </ProvidersContext.Provider>
  );
};
