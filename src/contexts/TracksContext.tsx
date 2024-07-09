import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

export const TracksContext = createContext('' as any);

const TracksContextProvider = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [tracks, setTracks] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [errorTracks, setErrorTracks] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [url, setUrl] = useState(
    `${process.env.REACT_APP_API_URL}/api/v1/tracks/`
  );

  useEffect(() => {
    if (userInfoContext?.profile && userInfoContext?.profile !== 1)
      setUrl(`${url}?company=${userInfoContext.company.id}`);
    //eslint-disable-next-line
  }, [userInfoContext]);

  useEffect(() => {
    if (searchText !== '') setUrl(`${url}&search=${searchText}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const getTracks = async (page) => {
    try {
      setLoadingTracks(true);
      let tempUrl: any = nextUrl || url;
      if (page < currentPage) tempUrl = prevUrl;

      // If page has not been loaded then concat
      if (!loadedPages.includes(page)) {
        const res = await axios({
          method: 'GET',
          url: tempUrl
        });
        setTracks((oldArr) => [...oldArr, ...res.data.results]);
        setLoadedPages((oldArr) => [...oldArr, page]);
        setTotalTracks(res.data.count);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
      }
      setCurrentPage(page);
      setErrorTracks(null);
      setLoadingTracks(false);
    } catch (error) {
      setLoadingTracks(false);
      setErrorTracks('Can not get tracks');
      console.error('error', error);
    }
  };

  const getTracksV2 = async (url: string, searchT?: string) => {
    try {
      setLoadingTracks(true);
      const webUrl = `${url}&search=${searchT}`;
      const res = await axios({
        method: 'GET',
        url: webUrl
      });
      setLoadingTracks(false);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
      return res;
    } catch (error) {
      setLoadingTracks(false);
      setErrorTracks('Can not get tracks');
      console.error('error', error);
    }
  };

  const getSearchTracks = async (text: string = '') => {
    try {
      setLoadingTracks(true);
      setSearchText(text);
      setLoadedPages([]);
      const tempUrl = `${url}&search=${text}`;
      const res = await axios({
        method: 'GET',
        url: tempUrl
      });
      setTracks(res.data.results);
      setTotalTracks(res.data.count);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
      setCurrentPage(1);
      setLoadingTracks(false);
    } catch (error) {
      setErrorTracks('Can not get tracks');
      console.error('error', error);
      setLoadingTracks(false);
    }
  };

  const getSearchTracksV2 = async (searchT: string) => {
    try {
      setLoadingTracks(true);
      setSearchText(searchT);
      setLoadedPages([]);
      const tempUrl = `${url}&search=${searchT}`;
      const res = await axios({
        method: 'GET',
        url: tempUrl
      });
      // console.log('Res', res);
      setTracks(res.data.results);
      setTotalTracks(res.data.count);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
      setCurrentPage(1);
      setLoadingTracks(false);
      return res;
    } catch (error) {
      setErrorTracks('Can not get tracks');
      console.error('error', error);
      setLoadingTracks(false);
    }
  };

  return (
    <TracksContext.Provider
      value={
        {
          getTracks,
          getTracksV2,
          tracks,
          setTracks,
          errorTracks,
          loadingTracks,
          setLoadingTracks,
          totalTracks,
          currentPage,
          setSearchText,
          searchText,
          getSearchTracks,
          getSearchTracksV2,
          url
        } as any
      }>
      {props.children}
    </TracksContext.Provider>
  );
};

export default TracksContextProvider;
