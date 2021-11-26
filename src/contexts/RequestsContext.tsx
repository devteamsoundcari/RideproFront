import React, { useEffect, createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getUserRequests } from '../controllers/apiRequests';
import ApiClientSingleton from '../controllers/apiClient';
import { PERFIL_CLIENTE, PERFIL_SUPERCLIENTE } from '../utils/constants';

export const RequestsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const RequestsContextProvider = (props) => {
  const { userInfo, isAuthenticated } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, -14)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .slice(0, -14)
  );
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requests, setRequests]: any = useState([]);
  const requestsRef = React.useRef(requests);

  const searchRequests = async (value, param) => {
    const url = `/drivers_entire_filter/?official_id=${
      param === 'official_id' ? value : '!'
    }&f_name=${param === 'f_name' ? value : '!'}&l_name=${
      param === 'l_name' ? value : '!'
    }&email=${param === 'email' ? value : '!'}`;
    try {
      const response = await apiClient.get(url);
      return response.results;
    } catch (error) {
      return error;
    }
  };

  async function fetchRequestsByPage(url: string) {
    setIsLoadingRequests(true);
    try {
      const response = await apiClient.get(url);
      const fetchedRequests = response?.data?.results.map((item: any) => {
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        item.cancelDate = cancelDate;
        item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
        item.start = new Date(item.start_time);
        item.end = new Date(item.finish_time);
        return item;
      });
      setRequests((prev: any) => [...fetchedRequests, ...prev]);
      setIsLoadingRequests(false);
    } catch (error) {
      return error;
    }

    // setRequests((prev: any) => [...fetchedRequests, ...prev]);
    // setPrevUrl(response.previous);
    // setNextUrl(response.next);
    // setCount(response.count);
    // setIsLoadingRequests(false);
  }

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const getRequestsList = (page: any) => {
    if (!page || page === 1) setRequests([]);
    let urlType =
      userInfo.profile === PERFIL_CLIENTE.profile
        ? 'user_requests'
        : userInfo.profile === PERFIL_SUPERCLIENTE.profile
        ? 'request_superuser'
        : 'requests';
    fetchRequestsByPage(
      page && page !== 1
        ? `/api/v1/${urlType}/?page=${page}&start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
        : `/api/v1/${urlType}/?start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
    );
  };

  return (
    <RequestsContext.Provider
      value={
        {
          requests,
          getRequestsList,
          isLoadingRequests,
          searchRequests
        } as any
      }>
      {props.children}
    </RequestsContext.Provider>
  );
};
