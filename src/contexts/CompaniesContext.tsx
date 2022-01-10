import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_COMPANIES } from '../utils';
import { API_USER_COMPANIES } from '../utils/constants';

export const CompaniesContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const CompaniesContextProvider = (props) => {
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState<any>([]);
  const [allCompaniesLoaded, setAllCompaniesLoaded] = useState(false);
  const [userCompanies, setUserCompanies] = useState<any>([]);
  const [countUserCompanies, setCountUserCompanies] = useState(0);
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
    }
  };

  const getUserCompanies = async (userId: string, page?: string) => {
    setLoadingCompanies(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setUserCompanies((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getUserCompanies(userId, response.data.next);
        } else {
          setLoadingCompanies(false);
        }
      } catch (error) {
        setUserCompanies(error);
        setLoadingCompanies(false);
      }
    } else {
      try {
        setUserCompanies([]);
        const response = await apiClient.get(`${API_USER_COMPANIES}?user=${userId}`);
        setUserCompanies((oldArr: any) => [...oldArr, ...response.data.results]);
        setCountUserCompanies(response.data.count);
        if (response.data.next) {
          return await getUserCompanies(userId, response.data.next);
        } else {
          setLoadingCompanies(false);
        }
      } catch (error) {
        setUserCompanies(error);
        setLoadingCompanies(false);
      }
    }
  };

  const deleteSuerUserCompany = async (userCompanyId: any) => {
    setLoadingCompanies(true);
    try {
      const response = await apiClient.delete(`${API_USER_COMPANIES}${userCompanyId}`);
      setLoadingCompanies(false);
      return response;
    } catch (error) {
      setLoadingCompanies(false);
      throw new Error('Error deleting the user');
    }
  };

  const addSuperUserCompanies = async (companiesIds: string[], userId: string) => {
    setLoadingCompanies(true);
    try {
      const response = await apiClient.post(`${API_USER_COMPANIES}`, {
        user: userId,
        companies: [...companiesIds]
      });
      setLoadingCompanies(false);
      return response;
    } catch (error) {
      setLoadingCompanies(false);
      throw new Error('Error adding the companies');
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
        count,
        userCompanies,
        getUserCompanies,
        countUserCompanies,
        deleteSuerUserCompany,
        addSuperUserCompanies
      }}>
      {props.children}
    </CompaniesContext.Provider>
  );
};
