import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useRef
} from 'react';
import { AuthContext } from './AuthContext';
import ApiClientSingleton from '../controllers/apiClient';
import { PERFIL_CLIENTE, PERFIL_SUPERCLIENTE } from '../utils';

export const RequestsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const RequestsContextProvider = (props) => {
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [searchParams, setSearchParams] = useState(null as any);
  const [resetPagination, setResetPagination] = useState(false);
  const [requests, setRequests]: any = useState([]);
  const [count, setCount] = useState(null);
  const { userInfo } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, -14)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .slice(0, -14)
  );
  const requestsRef = useRef(requests);

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  useEffect(() => {
    // getCalendarRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // ==================== SEARCH AND FIND A REQUEST ======================
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

  // ==================== ALL REQUESTS BY PAGE ======================
  const fetchRequestsByPage = async (url: string) => {
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
      setRequests((prev) => [...prev, ...fetchedRequests]);
      setCount(response?.data?.count);
      setIsLoadingRequests(false);
    } catch (error) {
      return error;
    }
  };

  const getRequestsList = (page, value = '') => {
    if (!page || page === 1) {
      setRequests([]);
    }
    let urlType: string | null;
    if (userInfo.profile === PERFIL_CLIENTE.profile) {
      urlType = 'user_requests';
    } else if (userInfo.profile === PERFIL_SUPERCLIENTE.profile) {
      urlType = 'request_superuser';
    } else {
      urlType = null;
    }
    if (urlType) {
      fetchRequestsByPage(
        page && page !== 1
          ? `/api/v1/${urlType}/?page=${page}&start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
          : `/api/v1/${urlType}/?start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
      );
    } else {
      fetchRequestsByPage(
        page && page !== 1
          ? `/api/v1/requests_summary/?page=${page}&search=${value}&start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
          : `/api/v1/requests_summary/?start_time__gte=${startDate}&start_time__lt=${endDate}+23:59&search=${value}`
      );
    }
  };

  const getNextPageOfRequests = (page: any, value: any) =>
    getRequestsList(page, value);

  return (
    <RequestsContext.Provider
      value={
        {
          requests,
          startDate,
          endDate,
          getRequestsList,
          isLoadingRequests,
          searchRequests,
          getNextPageOfRequests,
          count,
          searchParams,
          setSearchParams,
          resetPagination,
          setResetPagination
        } as any
      }>
      {props.children}
    </RequestsContext.Provider>
  );
};
