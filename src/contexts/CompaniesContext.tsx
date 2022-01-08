import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_COMPANIES } from '../utils';

export const CompaniesContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const CompaniesContextProvider = (props) => {
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<any>([]);
  const [allCompaniesLoaded, setAllCompaniesLoaded] = useState(false);
  const [count, setCount] = useState(0);

  const getCompanies = async (page?: string) => {
    setLoadingCompanies(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setCompanies((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getCompanies(response.data.next);
        } else {
          setAllCompaniesLoaded(true);
          setLoadingCompanies(false);
        }
      } catch (error) {
        setCompanies(error);
        setLoadingCompanies(false);
      }
    } else {
      try {
        setCompanies([]);
        const response = await apiClient.get(API_ALL_COMPANIES);
        setCount(response.data.count);
        if (response.data.next) {
          return await getCompanies(response.data.next);
        } else {
          setAllCompaniesLoaded(true);
          setLoadingCompanies(false);
        }
      } catch (error) {
        setCompanies(error);
        setLoadingCompanies(false);
      }
    }
  };

  return (
    <CompaniesContext.Provider
      value={{
        loadingCompanies,
        companies,
        setCompanies,
        getCompanies,
        allCompaniesLoaded,
        setAllCompaniesLoaded,
        count
      }}>
      {props.children}
    </CompaniesContext.Provider>
  );
};
