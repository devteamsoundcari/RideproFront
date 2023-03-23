import React, { createContext, useState, useContext } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { AuthContext } from './AuthContext';
import { PERFIL_ADMIN, API_REQUEST_COMPANY_TRACKS } from '../utils/constants';
import {
  API_REQUEST_TRACKS,
  API_REQUEST_TRACKS_SEARCH,
  API_DEPARTMENTS,
  API_CITIES_BY_DEPARTMENT
} from '../utils';

const apiClient = ApiClientSingleton.getApiInstance();

export const TracksContext = createContext('' as any);

export const TracksContextProvider = (props) => {
  const { userInfo } = useContext(AuthContext) as any;
  const [tracks, setTracks] = useState<any>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [departments, setDepartments] = useState<any>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cities, setCities] = useState<any>([]);
  const [allTracksLoaded, setAllTracksLoaded] = useState(false);
  const [count, setCount] = useState(0);

  const getTracks = async (page?: string) => {
    setLoadingTracks(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setTracks((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getTracks(response.data.next);
        } else {
          setAllTracksLoaded(true);
          setLoadingTracks(false);
        }
      } catch (error) {
        setTracks(error);
        setLoadingTracks(false);
      }
    } else {
      try {
        setTracks([]);
        const url =
          userInfo.profile === PERFIL_ADMIN.profile
            ? API_REQUEST_TRACKS
            : `${API_REQUEST_COMPANY_TRACKS}${userInfo.company.id}`;

        const response = await apiClient.get(url);
        setTracks((oldArr: any) => [...oldArr, ...response.data.results]);
        setCount(response.data.count);
        if (response.data.next) {
          return await getTracks(response.data.next);
        } else {
          setAllTracksLoaded(true);
          setLoadingTracks(false);
        }
      } catch (error) {
        setTracks(error);
        setLoadingTracks(false);
      }
    }
  };

  const getTracksByCity = async (cityName: string, page: any) => {
    setLoadingTracks(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setTracks((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingTracks(false);
        if (response.data.next) return await getTracksByCity(cityName, response.data.next);
      } catch (error) {
        setTracks(error);
        setLoadingTracks(false);
      }
    } else {
      try {
        const response = await apiClient.get(`${API_REQUEST_TRACKS_SEARCH}${cityName}`);
        setTracks((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingTracks(false);
        if (response.data.next) return await getTracksByCity(cityName, response.data.next);
      } catch (error) {
        setTracks(error);
        setLoadingTracks(false);
      }
    }
  };

  const getDepartments = async (page?: string) => {
    setLoadingDepartments(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setDepartments((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingDepartments(false);
        if (response.data.next) return await getDepartments(response.data.next);
      } catch (error) {
        setDepartments(error as any);
        setLoadingDepartments(false);
      }
    } else {
      setDepartments([]);
      try {
        const response = await apiClient.get(API_DEPARTMENTS);
        setDepartments((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingDepartments(false);
        if (response.data.next) return await getDepartments(response.data.next);
      } catch (error) {
        setDepartments(error);
        setLoadingDepartments(false);
      }
    }
  };

  const getCitiesByDepartmentId = async (departmentId: number, page?: string) => {
    setLoadingCities(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setCities((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingCities(false);
        if (response.data.next)
          return await getCitiesByDepartmentId(departmentId, response.data.next);
      } catch (error) {
        setCities(error as any);
        setLoadingCities(false);
      }
    } else {
      setCities([]);
      try {
        const response = await apiClient.get(`${API_CITIES_BY_DEPARTMENT}${departmentId}`);
        setCities((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingCities(false);
        if (response.data.next)
          return await getCitiesByDepartmentId(departmentId, response.data.next);
      } catch (error) {
        setCities(error);
        setLoadingCities(false);
      }
    }
  };

  /* ============================ CRATE A NEW TRACK ===================================== */
  const createNewTrack = async ({
    companyId,
    trackAddress,
    trackDescription,
    trackMunicipality,
    trackName,
    fare,
    cellphone,
    latitude,
    longitude,
    contact_email,
    contact_name
  }) => {
    const payload = {
      company: companyId,
      address: trackAddress,
      municipality: trackMunicipality,
      name: trackName,
      description: trackDescription,
      fare,
      cellphone,
      latitude,
      longitude,
      contact_email,
      contact_name
    };
    try {
      const response = await apiClient.post(API_REQUEST_TRACKS, payload);
      return response;
    } catch (error) {
      return error;
    }
  };

  /* ============================== TRACK PICTURE ===================================== */
  const editTrackPicture = async (picture, id) => {
    setLoadingTracks(true);
    const formData = new FormData();
    formData.append('pictures', picture);
    try {
      const res = await apiClient.patch(`${API_REQUEST_TRACKS}${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoadingTracks(false);
      return res;
    } catch (error) {
      setLoadingTracks(false);
      throw new Error('Could not upload file');
    }
  };

  /* ============================== EDIT TRACK INFO ===================================== */
  const editTrackInfo = async (payload, id) => {
    setLoadingTracks(true);
    try {
      const res = await apiClient.patch(`${API_REQUEST_TRACKS}${id}/`, payload);
      setLoadingTracks(false);
      return res;
    } catch (error) {
      setLoadingTracks(false);
      throw new Error('Could not update info');
    }
  };

  return (
    <TracksContext.Provider
      value={{
        tracks,
        loadingTracks,
        getTracks,
        getTracksByCity,
        setTracks,
        getDepartments,
        departments,
        loadingDepartments,
        loadingCities,
        cities,
        setCities,
        getCitiesByDepartmentId,
        createNewTrack,
        editTrackPicture,
        editTrackInfo,
        allTracksLoaded,
        setAllTracksLoaded,
        count
      }}>
      {props.children}
    </TracksContext.Provider>
  );
};
