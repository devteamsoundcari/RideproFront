import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import {
  API_SINGLE_REQUEST,
  API_REQUEST_INSTRUCTORS,
  API_REQUEST_PROVIDERS,
  API_REQUEST_DRIVERS,
  API_REQUEST_DRIVER_REPORT,
  API_REQUEST_DOCUMENTS,
  API_REQUEST_DOCUMENT_UPLOAD,
  API_REQUEST_BILLS,
  API_REQUEST_INSTRUCTORS_UPDATE
} from '../utils';

export const SingleRequestContext = createContext('' as any);

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

type Instructors = Instructor[];
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

interface Driver {
  url: string;
  id: string;
  official_id: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  requests: string[];
  created_at: any;
  updated_at: any;
  report: any;
}

type IRequestDrivers = Driver[];
type IRequestInstructors = RequestInstructor[];
type IRequestProviders = RequestInstructor[];

export const SingleRequestContextProvider = (props) => {
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<ISingleRequest>();
  const [requestDocuments, setRequestDocuments] = useState<any>([]);
  const [requestDrivers, setRequestDrivers] = useState<IRequestDrivers>([]);
  const [requestDriversReports, setRequestDriversReports] = useState<any>([]);
  const [requestBills, setRequestBills] = useState([]);
  const [requestInstructors, setRequestInstructors] =
    useState<IRequestInstructors>([]);
  const [requestProviders, serRequestProviders] = useState<IRequestProviders>(
    []
  );
  const [requestTrackOpt1, setRequestTrackOpt1] = useState(null);
  const [requestDateOpt1, setRequestDateOpt1] = useState(null);
  const [requestTrackOpt2, setRequestTrackOpt2] = useState(null);
  const [requestDateOpt2, setRequestDateOpt2] = useState(null);

  // ==================== SINGLE REQUEST  ======================
  const getSingleRequest = async (id: number) => {
    setLoadingRequest(true);
    try {
      const response = await apiClient.get(`${API_SINGLE_REQUEST}${id}`);
      setCurrentRequest(response.data);
      setRequestTrackOpt1(response.data.optional_place1);
      setRequestTrackOpt2(response.data.optional_place2);
      setRequestDateOpt1(response.data.optional_date1);
      setRequestDateOpt2(response.data.optional_date2);
      setLoadingRequest(false);
    } catch (error) {
      setCurrentRequest(error as any);
      setLoadingRequest(false);
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
    try {
      const response = await apiClient.get(
        `${API_REQUEST_DRIVERS}${driverId}/`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // ==================== GET MULTIPLE DRIVERS ======================
  const getRequestDrivers = async (driversIds: string[]) => {
    setLoadingDrivers(true);
    try {
      const response = await Promise.all(driversIds.map(fetchDriver));
      setRequestDrivers(response);
      setLoadingDrivers(false);
    } catch (error) {
      setLoadingDrivers(false);
    }
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

  // ==================== GET REQUEST BILLS ====================
  const getRequestBills = async () => {
    setLoadingBills(true);
    try {
      const response = apiClient.get(`${API_REQUEST_BILLS}`);
      setRequestBills(response.results);
      setLoadingBills(false);
    } catch (error) {
      setRequestBills(error as any);
      setLoadingBills(false);
    }
  };

  // ==================== UPDATE SINGLE REQUEST ====================
  const updateRequestId = (requestId: string, payload = null) => {
    setLoadingRequest(true);
    try {
      const response = apiClient.patch(
        `${API_SINGLE_REQUEST}${requestId}/`,
        payload
      );
      setLoadingRequest(false);
      return response;
    } catch (error) {
      setLoadingRequest(false);
      return error;
    }
  };

  // ====================== UPDATE INSTRUCTORS OF REQUEST ================
  const updateRequestInstructor = (payload) => {
    setLoadingInstructors(true);
    try {
      const response = apiClient.post(API_REQUEST_INSTRUCTORS_UPDATE, payload);
      setLoadingInstructors(false);
      return response;
    } catch (error) {
      setLoadingInstructors(false);
      return error;
    }
  };

  return (
    <SingleRequestContext.Provider
      value={
        {
          loadingRequest,
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
          requestDrivers,
          loadingReport,
          getDriverReport,
          requestDriversReports,
          setRequestDriversReports,
          getRequestDocuments,
          loadingDocuments,
          requestDocuments,
          uploadDocument,
          uploadingDocument,
          getRequestBills,
          requestBills,
          loadingBills,
          requestTrackOpt1,
          setRequestTrackOpt1,
          requestDateOpt1,
          setRequestDateOpt1,
          requestTrackOpt2,
          setRequestTrackOpt2,
          requestDateOpt2,
          setRequestDateOpt2,
          updateRequestId,
          updateRequestInstructor
        } as any
      }>
      {props.children}
    </SingleRequestContext.Provider>
  );
};
