import React, {
  useCallback,
  useEffect,
  createContext,
  useState,
  useContext
} from 'react';
import { AuthContext } from './AuthContext';
import { getUserRequests, getRequest } from '../controllers/apiRequests';
import ApiClientSingleton from '../controllers/apiClient';

export const RequestsContext = createContext('');

const apiClient = ApiClientSingleton.getApiInstance();

export const RequestsContextProvider = (props) => {
  const { userInfo, isLoggedInContext } = useContext(AuthContext);
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
  const [isLoadingCalendarRequests, setIsLoadingCalendarRequests] =
    useState(false);
  const [nextUrlCalendar, setNextUrlCalendar] = useState('');
  const [, setPrevUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [requests, setRequests]: any = useState([]);
  const [calendarRequests, setCalendarRequests]: any = useState([]);
  const [count, setCount] = useState(null);
  const [cancelledRequests, setCancelledRequests]: any = useState([]);
  const [statusNotifications, setStatusNotifications]: any = useState([]);
  const [requestsSocket, setRequestsSocket]: any = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  async function fetchRequestsByPage(url) {
    setIsLoadingRequests(true);
    const fetchedRequests: any = [];
    const response = await getUserRequests(url);
    if (response) {
      response.results.map(async (item: any) => {
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        item.cancelDate = cancelDate;
        item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
        item.start = new Date(item.start_time);
        item.end = new Date(item.finish_time);
        fetchedRequests.push(item);
      });
    }

    setRequests((prev: any) => [...fetchedRequests, ...prev]);
    setPrevUrl(response.previous);
    setNextUrl(response.next);
    setCount(response.count);
    setIsLoadingRequests(false);
  }

  /// Here set month and year
  async function fetchRequestsByMonth(url) {
    setIsLoadingCalendarRequests(true);
    const fetchedRequests: any = [];
    const fetchedCancelledRequests: any = [];
    const response = await getUserRequests(url);
    if (response) {
      response.results.map(async (item) => {
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        item.cancelDate = cancelDate;

        item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
        item.start = new Date(item.start_time);
        item.end = new Date(item.finish_time);

        if (item.status.step === 0) {
          fetchedCancelledRequests.push(item);
        } else {
          fetchedRequests.push(item);
        }
      });
    }

    setCalendarRequests((prev) => [...prev, ...fetchedRequests]);
    setCancelledRequests((prev) => [...prev, ...fetchedCancelledRequests]);
    setNextUrlCalendar(response.next);
    if (response && response.next !== null) {
      setIsLoadingCalendarRequests(true);
      return await fetchRequestsByMonth(response.next);
    } else {
      setIsLoadingCalendarRequests(false);
    }
  }

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const getRequestsList = (page) => {
    if (!page) setRequests([]);
    if (page === 1) {
      setRequests([]);
    }
    let urlType =
      userInfo.profile === 2
        ? 'user_requests'
        : userInfo.profile === 7
        ? 'request_superuser'
        : 'requests';
    if (isLoggedInContext)
      fetchRequestsByPage(
        page && page !== 1
          ? `${process.env.REACT_APP_API_URL}/api/v1/${urlType}/?page=${page}&start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
          : `${process.env.REACT_APP_API_URL}/api/v1/${urlType}/?start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
      );
  };

  const getNextPageOfRequests = (page) => getRequestsList(page);

  const getCalendarRequests = () => {
    let urlType =
      userInfo.profile === 2
        ? 'user_requests'
        : userInfo.profile === 7
        ? 'request_superuser'
        : 'requests';
    setCalendarRequests([]);
    setCancelledRequests([]);
    if (isLoggedInContext)
      fetchRequestsByMonth(
        `${process.env.REACT_APP_API_URL}/api/v1/${urlType}/?start_time__gte=${startDate}&start_time__lt=${endDate}+23:59`
      );
  };

  const clear = () => {
    setRequests([]);
    setCancelledRequests([]);
    setStatusNotifications([]);
    if (requestsSocket) {
      requestsSocket.close();
    }
    setRequestsSocket(null);
  };

  const updateRequestInfo = useCallback(async (id) => {
    let request = await getRequest(id);
    let requestsToEdit = [...requestsRef.current];
    if (request) {
      let instanceIndex = requestsToEdit.findIndex(
        (request) => request.id === id
      );
      if (instanceIndex >= 0) {
        let cancelDate = new Date(request.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        request.cancelDate = cancelDate;

        request.title = `${request.service.name}, ${request.place} - ${request.municipality.name} (${request.municipality.department.name})`;
        request.start = new Date(request.start_time);
        request.end = new Date(request.finish_time);

        requestsToEdit[instanceIndex] = request;
      }
    }
    checkRequestsStatus(requestsToEdit, requestsRef.current);
    setRequests(requestsToEdit);
  }, []);

  const checkRequestsStatus = (current, prev) => {
    let notifications: any = [];

    for (const request of current) {
      const oldRequest = prev.find((r) => r.id === request.id);
      if (oldRequest) {
        if (oldRequest.status.id !== request.status.id) {
          notifications.push({
            id: request.id,
            previousStatus: {
              name: oldRequest.status.name,
              color: oldRequest.status.color_indicator,
              step: oldRequest.status.step
            },
            newStatus: {
              name: request.status.name,
              color: request.status.color_indicator,
              step: request.status.step
            }
          });
          setStatusNotifications((previous) => [...previous, ...notifications]);
        }
      }
    }
  };

  useEffect(() => {
    if (requestsSocket === null) {
      if (
        !isLoadingCalendarRequests &&
        !isLoadingRequests &&
        isLoggedInContext
      ) {
        let token = localStorage.getItem('token');
        let requestsSocket: any = new WebSocket(
          `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
        );
        requestsSocket.addEventListener('open', () => {
          let payload;
          switch (userInfo.profile) {
            case 1:
            case 3:
              payload = {
                action: 'subscribe_to_requests',
                request_id: userInfo.id
              };
              requestsSocket.send(JSON.stringify(payload));
              break;
            default:
              payload = {
                action: 'subscribe_to_requests_from_customer',
                customer: userInfo.id,
                request_id: userInfo.id
              };
              requestsSocket.send(JSON.stringify(payload));
          }
        });

        requestsSocket.onmessage = async function (event) {
          let data = JSON.parse(event.data);
          await updateRequestInfo(data.data.id);
        };

        setRequestsSocket(requestsSocket);
      }
    }
  }, [
    isLoadingCalendarRequests,
    isLoadingRequests,
    userInfo,
    updateRequestInfo,
    isLoggedInContext,
    requestsSocket
  ]);

  return (
    <RequestsContext.Provider
      value={
        {
          requests,
          setRequests,
          cancelledRequests,
          setCancelledRequests,
          getRequestsList,
          updateRequestInfo,
          setIsLoadingRequests,
          isLoadingRequests,
          statusNotifications,
          clear,
          setEndDate,
          setStartDate,
          currentMonth,
          setCurrentMonth,
          count,
          setCount,
          nextUrl,
          getNextPageOfRequests,
          getCalendarRequests,
          calendarRequests,
          isLoadingCalendarRequests,
          nextUrlCalendar,
          searchRequests
        } as any
      }>
      {props.children}
    </RequestsContext.Provider>
  );
};
