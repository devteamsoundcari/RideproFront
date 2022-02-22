import React, { useEffect, createContext, useState, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import ApiClientSingleton from '../controllers/apiClient';
import { PERFIL_CLIENTE, PERFIL_SUPERCLIENTE } from '../utils';
import moment from 'moment';

export const RequestsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const RequestsContextProvider = (props) => {
  const [isLoadingCalendarRequests, setIsLoadingCalendarRequests] = useState(false);
  const [cancelledRequests, setCancelledRequests] = useState<any>([]);
  const [calendarRequests, setCalendarRequests] = useState<any>([]);
  const [nextUrlCalendar, setNextUrlCalendar] = useState('');
  const [fetchedMonths, setFetchedMonths] = useState<any>([]);
  const [calendarCount, setCalendarCount] = useState(0);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [searchParams, setSearchParams] = useState(null as any);
  const [resetPagination, setResetPagination] = useState(false);
  const [, setPrevUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [requests, setRequests]: any = useState([]);
  const [count, setCount] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(moment().toDate());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
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
    }&f_name=${param === 'f_name' ? value : '!'}&l_name=${param === 'l_name' ? value : '!'}&email=${
      param === 'email' ? value : '!'
    }`;
    try {
      const response = await apiClient.get(url);
      return response.results;
    } catch (error) {
      throw new Error(error as any);
    }
  };

  // ==================== ALL REQUESTS BY PAGE ======================
  const fetchRequestsByPage = async (url: string) => {
    setIsLoadingRequests(true);
    try {
      const response = await apiClient.get(url);
      const fetchedRequests = response?.data?.results.map((item: any) => {
        let cancelDate: any = moment(item.start_time);
        cancelDate = cancelDate.subtract(1, 'days').format();
        item.cancelDate = cancelDate;
        item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
        item.start = moment(item.start_time).format();
        item.end = moment(item.finish_time).format();
        return item;
      });
      setRequests((prev) => [...prev, ...fetchedRequests]);
      setCount(response?.data?.count);
      setPrevUrl(response.previous);
      setNextUrl(response.next);
      setIsLoadingRequests(false);
    } catch (error) {
      throw new Error(error as any);
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

  const getNextPageOfRequests = (page: any, value: any) => getRequestsList(page, value);

  // ================= CALENDAR REQUESTS ===========================

  /// Here set month and year
  async function fetchRequestsByMonth(url) {
    setIsLoadingCalendarRequests(true);
    try {
      const response = await apiClient.get(url);
      if (response) {
        const fetchedRequests = response.data.results.map((item) => {
          let cancelDate: any = moment(item.start_time);
          cancelDate = cancelDate.subtract(1, 'days').format();
          item.cancelDate = cancelDate;
          item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
          item.start = moment(item.start_time).format();
          item.end = moment(item.finish_time).format();
          return item;
        });
        setCalendarRequests((prev) => [...prev, ...fetchedRequests]);
        setNextUrlCalendar(response.data.next);
      }
      setCalendarCount(response?.data?.count);
      if (response?.data?.next !== null) {
        return await fetchRequestsByMonth(response.data.next);
      } else {
        setIsLoadingCalendarRequests(false);
      }
    } catch (error) {
      setIsLoadingCalendarRequests(false);
      console.log(error);
      throw new Error(error as any);
    }
  }

  const getCalendarRequests = (start = startDate, end = endDate, clear = true) => {
    let urlType: string | null;
    if (userInfo.profile === PERFIL_CLIENTE.profile) {
      urlType = 'user_requests';
    } else if (userInfo.profile === PERFIL_SUPERCLIENTE.profile) {
      urlType = 'request_superuser';
    } else {
      urlType = 'requests';
    }
    if (clear) {
      setCalendarRequests([]);
      setCancelledRequests([]);
    }

    const theMonth = start;
    if (!fetchedMonths.includes(theMonth)) {
      setFetchedMonths((prev) => [...prev, theMonth]);
      fetchRequestsByMonth(
        `/api/v1/${urlType}/?start_time__gte=${start}&start_time__lt=${end}+23:59`
      );
    }
  };

  const updateCurrentMonth = (start, end, date) => {
    const isSame = moment(date).isSame(currentMonth, 'month');
    if (!isSame) {
      setCurrentMonth(date);
      getCalendarRequests(start, end, false);
    }
  };

  // const clear = () => {
  //   setRequests([]);
  //   setCancelledRequests([]);
  //   setStatusNotifications([]);
  //   if (requestsSocket) {
  //     requestsSocket.close();
  //   }
  //   setRequestsSocket(null);
  // };

  // const updateRequestInfo = useCallback(async (id) => {
  //   let request = await getRequest(id);
  //   let requestsToEdit = [...requestsRef.current];
  //   if (request) {
  //     let instanceIndex = requestsToEdit.findIndex((request) => request.id === id);
  //     if (instanceIndex >= 0) {
  //       let cancelDate = new Date(request.start_time);
  //       cancelDate.setDate(cancelDate.getDate() - 1);
  //       request.cancelDate = cancelDate;

  //       request.title = `${request.service.name}, ${request.place} - ${request.municipality.name} (${request.municipality.department.name})`;
  //       request.start = new Date(request.start_time);
  //       request.end = new Date(request.finish_time);

  //       requestsToEdit[instanceIndex] = request;
  //     }
  //   }
  //   checkRequestsStatus(requestsToEdit, requestsRef.current);
  //   setRequests(requestsToEdit);
  // }, []);

  // const checkRequestsStatus = (current, prev) => {
  //   let notifications = [];

  //   for (const request of current) {
  //     const oldRequest = prev.find((r) => r.id === request.id);
  //     if (oldRequest) {
  //       if (oldRequest.status.id !== request.status.id) {
  //         notifications.push({
  //           id: request.id,
  //           previousStatus: {
  //             name: oldRequest.status.name,
  //             color: oldRequest.status.color_indicator,
  //             step: oldRequest.status.step
  //           },
  //           newStatus: {
  //             name: request.status.name,
  //             color: request.status.color_indicator,
  //             step: request.status.step
  //           }
  //         });
  //         setStatusNotifications((previous) => [...previous, ...notifications]);
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (requestsSocket === null) {
  //     if (!isLoadingCalendarRequests && !isLoadingRequests && isLoggedInContext) {
  //       let token = localStorage.getItem('token');
  //       let requestsSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}?token=${token}`);
  //       requestsSocket.addEventListener('open', () => {
  //         let payload;
  //         switch (userInfoContext.profile) {
  //           case 1:
  //           case 3:
  //             payload = {
  //               action: 'subscribe_to_requests',
  //               request_id: userInfoContext.id
  //             };
  //             requestsSocket.send(JSON.stringify(payload));
  //             break;
  //           default:
  //             payload = {
  //               action: 'subscribe_to_requests_from_customer',
  //               customer: userInfoContext.id,
  //               request_id: userInfoContext.id
  //             };
  //             requestsSocket.send(JSON.stringify(payload));
  //         }
  //       });

  //       requestsSocket.onmessage = async function (event) {
  //         let data = JSON.parse(event.data);
  //         await updateRequestInfo(data.data.id);
  //       };

  //       setRequestsSocket(requestsSocket);
  //     }
  //   }
  // }, [
  //   isLoadingCalendarRequests,
  //   isLoadingRequests,
  //   userInfoContext.id,
  //   userInfoContext.profile,
  //   updateRequestInfo,
  //   isLoggedInContext,
  //   requestsSocket
  // ]);

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
          nextUrl,
          searchParams,
          setSearchParams,
          resetPagination,
          setResetPagination,
          getCalendarRequests,
          isLoadingCalendarRequests,
          nextUrlCalendar,
          calendarRequests,
          currentMonth,
          calendarCount,
          setStartDate,
          setEndDate,
          updateCurrentMonth,
          cancelledRequests
        } as any
      }>
      {props.children}
    </RequestsContext.Provider>
  );
};
