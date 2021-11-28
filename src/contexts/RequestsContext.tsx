import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useRef
} from 'react';
import { AuthContext } from './AuthContext';
import ApiClientSingleton from '../controllers/apiClient';
import {
  PERFIL_CLIENTE,
  PERFIL_SUPERCLIENTE,
  API_SINGLE_REQUEST,
  API_REQUEST_INSTRUCTORS,
  API_REQUEST_PROVIDERS,
  API_REQUEST_DRIVERS,
  API_REQUEST_DRIVER_REPORT,
  API_REQUEST_DOCUMENTS,
  API_REQUEST_DOCUMENT_UPLOAD
} from '../utils';
import moment from 'moment';

export const RequestsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();
export interface Service {
  name: string;
}

export interface Company {
  logo: string;
  name: string;
  nit: string;
  arl: string;
  phone: string;
  address: string;
}

export interface Customer {
  company?: Company;
  first_name: string;
  last_name: string;
  charge: string;
  email: string;
  picture: string;
}

export interface Department {
  name: string;
}

export interface Municipality {
  name: string;
  department: Department;
}

export interface Status {
  name: string;
  profile_action: number;
  step: number;
}

type Instructors = any[];
type Providers = any[];
export interface ISingleRequest {
  created_at: string;
  start_time: string;
  service?: Service;
  customer?: Customer;
  municipality?: Municipality;
  track: any;
  status?: Status;
  drivers: any;
  instructors: any;
  providers: any;
  optional_date1: any;
  optional_place1: any;
  optional_date2: any;
  optional_place2: any;
  operator: any;
  fare_track: any;
  f_p_track: any;
  accept_msg: string;
  reject_msg: string;
}

interface Instructor {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
  municipality?: Municipality;
}

interface RequestInstructor {
  fare: number;
  first_payment: number;
  instructors?: Instructor;
}

type IRequestInstructors = RequestInstructor[];
type IRequestProviders = RequestInstructor[];

export const RequestsContextProvider = (props) => {
  const [count, setCount] = useState(null);
  const [currentRequest, setCurrentRequest] = useState<ISingleRequest>();
  const [requestInstructors, setRequestInstructors] =
    useState<IRequestInstructors>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [requestProviders, serRequestProviders] = useState<IRequestProviders>(
    []
  );
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [requestDocuments, setRequestDocuments] = useState<any>([]);
  const [requests, setRequests]: any = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const { userInfo } = useContext(AuthContext);
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
  const requestsRef = useRef(requests);

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const sortByStartTime = (req) =>
    req.sort((a, b) => {
      return moment(a.start_time).valueOf() - moment(b.start_time).valueOf();
    });

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
      const requestSortedByStartTime = sortByStartTime([
        ...fetchedRequests,
        ...requests
      ]);
      setRequests(requestSortedByStartTime);
      setCount(response?.data?.count);
      setIsLoadingRequests(false);
    } catch (error) {
      return error;
    }
  };

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

  // ==================== SINGLE REQUEST  ======================
  const getSingleRequest = async (id: number) => {
    setIsLoadingRequests(true);
    try {
      const response = await apiClient.get(`${API_SINGLE_REQUEST}${id}`);
      setCurrentRequest(response.data);
      setIsLoadingRequests(false);
    } catch (error) {
      setCurrentRequest(error as any);
      setIsLoadingRequests(false);
    }
  };

  // ==================== REQUEST INSTRUCTORS ======================
  const getRequestInstructors = async (id: number, page?: string) => {
    setLoadingInstructors(true);
    if (id && page) {
      try {
        const response = await apiClient.get(page);
        setRequestInstructors((oldArr: any) => [
          ...oldArr,
          ...response.data.results
        ]);
        setLoadingInstructors(false);
        if (response.next) {
          return await getRequestInstructors(id, response.next);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await apiClient.get(`${API_REQUEST_INSTRUCTORS}${id}`);
        setRequestInstructors((oldArr: any) => [
          ...oldArr,
          ...response.data.results
        ]);
        setLoadingInstructors(false);
        if (response.next) {
          return await getRequestInstructors(id, response.next);
        }
      } catch (error) {
        setRequestInstructors(error as any);
        setLoadingInstructors(false);
      }
    }
  };

  // ==================== REQUEST PROVIDERS ======================
  const getRequestProviders = async (id: number, page?: string) => {
    setLoadingProviders(true);
    if (id && page) {
      try {
        const response = await apiClient.get(page);
        serRequestProviders((oldArr: any) => [
          ...oldArr,
          ...response.data.results
        ]);
        setLoadingProviders(false);
        if (response.next) {
          return await getRequestProviders(id, response.next);
        }
      } catch (error) {
        console.log(error);
        setLoadingProviders(false);
      }
    } else {
      try {
        const response = await apiClient.get(`${API_REQUEST_PROVIDERS}${id}`);
        serRequestProviders((oldArr: any) => [
          ...oldArr,
          ...response.data.results
        ]);
        setLoadingProviders(false);
        if (response.next) {
          return await getRequestProviders(id, response.next);
        }
      } catch (error) {
        serRequestProviders(error as any);
        setLoadingProviders(false);
      }
    }
  };

  // ==================== GET A SINGLE DRIVER ======================
  const fetchDriver = async (driverId: string) => {
    setLoadingDrivers(true);
    try {
      const response = await apiClient.get(
        `${API_REQUEST_DRIVERS}${driverId}/`
      );
      setLoadingDrivers(false);
      return response.data;
    } catch (error) {
      setLoadingDrivers(false);
      return error;
    }
  };

  // ==================== GET MULTIPLE DRIVERS ======================
  const getRequestDrivers = async (driversIds: string[]) => {
    return Promise.all(driversIds.map(fetchDriver));
  };

  // ==================== GET DRIVER REPORT ====================
  const getDriverReport = async (requestId: string, driverId: string) => {
    setLoadingReport(true);
    try {
      const response = await apiClient.get(
        `${API_REQUEST_DRIVER_REPORT}${requestId}&driver=${driverId}`
      );
      setLoadingReport(false);
      return response.data.results[0];
    } catch (error) {
      setLoadingReport(false);
      return error;
    }
  };

  // ==================== GET REQUEST DOCUMENTS ====================
  const getRequestDocuments = async (requestId: string) => {
    setLoadingDocuments(true);
    try {
      const response = await apiClient.get(
        `${API_REQUEST_DOCUMENTS}${requestId}`
      );
      setRequestDocuments(response.data.results);
      setLoadingDocuments(false);
    } catch (error) {
      setRequestDocuments(error);
      setLoadingDocuments(false);
    }
  };

  // ==================== UPLOAD REQUEST FILE ====================
  const uploadDocument = async (requestId, id, docId, file) => {
    setUploadingDocument(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('request', requestId);
    formData.append('document_id', docId);
    try {
      const result = await apiClient.patch(
        `${API_REQUEST_DOCUMENT_UPLOAD}${id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setUploadingDocument(false);
      return result;
    } catch (error) {
      setUploadingDocument(false);

      return console.error();
    }
  };

  const getNextPageOfRequests = (page) => getRequestsList(page);

  return (
    <RequestsContext.Provider
      value={
        {
          requests,
          getRequestsList,
          isLoadingRequests,
          searchRequests,
          getNextPageOfRequests,
          count,
          getSingleRequest,
          currentRequest,
          getRequestInstructors,
          loadingInstructors,
          requestInstructors,
          getRequestProviders,
          loadingProviders,
          requestProviders,
          getRequestDrivers,
          loadingDrivers,
          loadingReport,
          getDriverReport,
          getRequestDocuments,
          loadingDocuments,
          requestDocuments,
          uploadDocument,
          uploadingDocument
        } as any
      }>
      {props.children}
    </RequestsContext.Provider>
  );
};
