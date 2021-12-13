import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_INSTRUCTORS_SEARCH, API_ALL_INSTRUCTORS } from '../utils';

export const InstructorsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();
interface INewInstructor {
  name: string;
  lastName: string;
  email: string;
  officialId: number;
  cellPhone: number;
}

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
        if (response.data.next) return await getInstructorsByCity(cityName, response.data.next);
      } catch (error) {
        setInstructors(error);
        setLoadingInstructors(false);
      }
    } else {
      setInstructors([]);
      try {
        const response = await apiClient.get(`${API_INSTRUCTORS_SEARCH}${cityName}`);
        setInstructors((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingInstructors(false);
        if (response.data.next) return await getInstructorsByCity(cityName, response.data.next);
      } catch (error) {
        setInstructors(error);
        setLoadingInstructors(false);
      }
    }
  };

  // ====================== CREATE AN INSTRUCTOR ========================
  const addInstructor = async (payload: INewInstructor) => {
    setLoadingInstructors(true);
    try {
      const response = apiClient.post(API_ALL_INSTRUCTORS, payload);
      setLoadingInstructors(false);
      return response;
    } catch (error) {
      setLoadingInstructors(false);
      return error;
    }
  };

  return (
    <InstructorsContext.Provider
      value={{
        loadingInstructors,
        instructors,
        getInstructorsByCity,
        setInstructors,
        addInstructor
      }}>
      {props.children}
    </InstructorsContext.Provider>
  );
};
