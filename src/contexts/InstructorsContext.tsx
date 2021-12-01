import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_INSTRUCTORS_SEARCH } from '../utils';

export const InstructorsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const InstructorsContextProvider = (props) => {
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [instructors, setInstructors] = useState<any>([]);

  // ==================== GET INSTRUCTORS BY CITY NAME ========================
  const getInstructorsByCity = async (cityName: string, page: any) => {
    setLoadingInstructors(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setInstructors((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingInstructors(false);
        if (response.data.next)
          return await getInstructorsByCity(cityName, response.data.next);
      } catch (error) {
        setInstructors(error);
        setLoadingInstructors(false);
      }
    } else {
      try {
        const response = await apiClient.get(
          `${API_INSTRUCTORS_SEARCH}${cityName}`
        );
        setInstructors((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingInstructors(false);
        if (response.data.next)
          return await getInstructorsByCity(cityName, response.data.next);
      } catch (error) {
        setInstructors(error);
        setLoadingInstructors(false);
      }
    }
  };

  return (
    <InstructorsContext.Provider
      value={{
        loadingInstructors,
        instructors,
        getInstructorsByCity
      }}>
      {props.children}
    </InstructorsContext.Provider>
  );
};
