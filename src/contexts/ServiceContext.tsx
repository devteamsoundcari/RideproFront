import React, { createContext, useState, useContext } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import {
  API_ALL_LINE_SERVICES,
  API_ALL_SERVICES,
  API_DRIVERS_BY_COMPANY,
  API_SINGLE_REQUEST,
  API_USER_DATA,
  dateWithTime
} from '../utils';
import { AuthContext } from './AuthContext';
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
  const { userInfo, setUserInfo, sendEmail } = useContext(AuthContext);
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
  const [creatingRequest, setCreatingRequest] = useState(false);

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

  const updateUserCredit = async (data: any) => {
    setCreatingRequest(true);
    try {
      const response = await apiClient.patch(`${API_USER_DATA}`, {
        credit: data.newCredit,
        company_id: data.companyId
      });
      setCreatingRequest(false);
      return response.data;
    } catch (error) {
      setCreatingRequest(false);
      throw new Error('Error updating user credit');
    }
  };

  const createRequest = async (payload: any) => {
    setCreatingRequest(true);
    try {
      const response = await apiClient.post(API_SINGLE_REQUEST, payload);
      const creditsPayload = {
        newCredit: response.data.customer.credit - response.data.spent_credit,
        companyId: response.data.customer.company.id
      };
      const creditDecrease = await updateUserCredit(creditsPayload); // Calling decrease credit
      setUserInfo({
        ...userInfo,
        credit: creditDecrease?.credit
      });

      const emailPayload = {
        id: response?.data?.id,
        template: 'new_request',
        subject: 'Solicitud exitosa ⌛',
        to: response?.data?.customer?.email,
        name: response?.data?.customer?.first_name,
        date: dateWithTime(response?.data?.start_time),
        spent_credits: response?.data?.spent_credit,
        participantes: serviceParticipants,
        service: response?.data?.service?.name,
        municipality: {
          city: response?.data?.municipality.name,
          department: response?.data?.municipality.department.name
        }
      };

      await sendEmail(emailPayload); // SEND SERVICE REQUESTED EMAIL TO USER
      setCreatingRequest(false);
      return response?.data;
    } catch (error) {
      setCreatingRequest(false);
      console.error(error);
      throw new Error('Error creating request');
    }
  };

  const resetServiceRequest = () => {
    setSelectedService(null);
    setSelectedPlace(null);
    setSelectedDate(null);
    setCompanyDrivers([]);
    setServiceParticipants([]);
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
        allDriversLoaded,
        createRequest,
        creatingRequest,
        resetServiceRequest
      }}>
      {props.children}
    </ServiceContext.Provider>
  );
};
