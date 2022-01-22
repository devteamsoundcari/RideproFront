import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_LINE_SERVICES, API_ALL_SERVICES } from '../utils';
export const ServiceContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export interface ILineService {
  id: string;
  name: string;
  short_description: string;
  description: string;
  image: string;
  updated_at: string;
}

export interface IService {
  url: string;
  id: string;
  name: string;
  service_type: string;
  description: string;
  requirements: string;
  duration: number;
  ride_value: number;
  penalty_rides: number;
  location: string;
  min_clients: number;
  max_clients: number;
  line_service: string;
  updated_at: string;
}

export const ServiceContextProvider = (props) => {
  const [lineServices, setLinesServices] = useState<ILineService[] | []>([]);
  const [services, setServices] = useState<IService[] | []>([]);
  const [loadingLineServices, setLoadingLineServices] = useState(false);

  const getLineServices = async (page: string) => {
    setLoadingLineServices(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setLinesServices((oldArr: ILineService[]) => [...oldArr, ...response.data.results]);
        setLoadingLineServices(false);
        if (response.data.next) return await getLineServices(response.data.next);
      } catch (error) {
        setLoadingLineServices(false);
        throw new Error('Error getting line services');
      }
    } else {
      setLinesServices([]);
      try {
        const response = await apiClient.get(API_ALL_LINE_SERVICES);
        setLinesServices((oldArr: ILineService[]) => [...oldArr, ...response.data.results]);
        setLoadingLineServices(false);
        if (response.data.next) return await getLineServices(response.data.next);
      } catch (error) {
        setLoadingLineServices(false);
        throw new Error('Error getting line services');
      }
    }
  };

  const getServices = async (page: string) => {
    setLoadingLineServices(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setServices((oldArr: IService[]) => [...oldArr, ...response.data.results]);
        setLoadingLineServices(false);
        if (response.data.next) return await getServices(response.data.next);
      } catch (error) {
        setLoadingLineServices(false);
        throw new Error('Error getting services');
      }
    } else {
      setServices([]);
      try {
        const response = await apiClient.get(API_ALL_SERVICES);
        setServices((oldArr: IService[]) => [...oldArr, ...response.data.results]);
        setLoadingLineServices(false);
        if (response.data.next) return await getServices(response.data.next);
      } catch (error) {
        setLoadingLineServices(false);
        throw new Error('Error getting services');
      }
    }
  };

  return (
    <ServiceContext.Provider
      value={{ lineServices, loadingLineServices, getLineServices, services, getServices }}>
      {props.children}
    </ServiceContext.Provider>
  );
};
