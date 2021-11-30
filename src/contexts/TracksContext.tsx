import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_REQUEST_TRACKS } from '../utils';

const apiClient = ApiClientSingleton.getApiInstance();

export const TracksContext = createContext('' as any);

export const TracksContextProvider = (props) => {
  const [tracks, setTracks] = useState<any>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const getTracks = async (page?: string) => {
    setLoadingTracks(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setTracks((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingTracks(false);
        if (response.data.next) return await getTracks(response.data.next);
      } catch (error) {
        setTracks(error);
        setLoadingTracks(false);
      }
    } else {
      try {
        const response = await apiClient.get(API_REQUEST_TRACKS);
        setTracks((oldArr: any) => [...oldArr, ...response.data.results]);
        setLoadingTracks(false);
        console.log('llega', response);
        if (response.data.next) return await getTracks(response.data.next);
      } catch (error) {
        setTracks(error);
        setLoadingTracks(false);
      }
    }
  };

  return (
    <TracksContext.Provider
      value={{
        tracks,
        loadingTracks,
        getTracks
      }}>
      {props.children}
    </TracksContext.Provider>
  );
};
