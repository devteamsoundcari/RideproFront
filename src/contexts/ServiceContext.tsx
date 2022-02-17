import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_LINE_SERVICES, API_ALL_SERVICES, API_DRIVERS_BY_COMPANY } from '../utils';
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

export interface IPlace {
  department: string;
  city: string;
  track: string;
}

export const ServiceContextProvider = (props) => {
  const [lineServices, setLinesServices] = useState<ILineService[] | []>([]);
  const [services, setServices] = useState<IService[] | []>([]);
  const [loadingLineServices, setLoadingLineServices] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [countCompanyDrivers, setCountCompanyDrivers] = useState(0);
  const [companyDrivers, setCompanyDrivers] = useState<any>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [serviceParticipants, setServiceParticipants] = useState<any>([]);
  const [allDriversLoaded, setAllDriversLoaded] = useState(false);

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

  const getCompanyDrivers = async (companyId: string, page?: string) => {
    setLoadingDrivers(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setCompanyDrivers((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getCompanyDrivers(companyId, response.data.next);
        } else {
          setAllDriversLoaded(true);
          setLoadingDrivers(false);
        }
      } catch (error) {
        setCompanyDrivers(error);
        setLoadingDrivers(false);
      }
    } else {
      try {
        setCompanyDrivers([]);
        const response = await apiClient.get(`${API_DRIVERS_BY_COMPANY}?company=${companyId}`);
        setCompanyDrivers((oldArr: any) => [...oldArr, ...response.data.results]);
        setCountCompanyDrivers(response.data.count);
        if (response.data.next) {
          return await getCompanyDrivers(companyId, response.data.next);
        } else {
          setAllDriversLoaded(true);
          setLoadingDrivers(false);
        }
      } catch (error) {
        setCompanyDrivers(error);
        setLoadingDrivers(false);
      }
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        lineServices,
        loadingLineServices,
        getLineServices,
        services,
        getServices,
        selectedService,
        setSelectedService,
        selectedPlace,
        setSelectedPlace,
        selectedDate,
        setSelectedDate,
        getCompanyDrivers,
        countCompanyDrivers,
        companyDrivers,
        loadingDrivers,
        serviceParticipants,
        setServiceParticipants,
        allDriversLoaded
      }}>
      {props.children}
    </ServiceContext.Provider>
  );
};
