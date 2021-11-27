import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_DRIVERS_FILTER } from '../utils';

const apiClient = ApiClientSingleton.getApiInstance();

export const SearchFiltersContext: any = createContext('');

export const SearchFiltersContextProvider = (props: any) => {
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filterBy, setFilterBy] = useState('official_id');
  const [searchCriteria, setSearchCriteria] = useState('');

  const searchRequest = async () => {
    setLoadingSearch(true);
    const url = `${API_DRIVERS_FILTER}?official_id=${
      filterBy === 'official_id' ? searchCriteria : '!'
    }&f_name=${filterBy === 'f_name' ? searchCriteria : '!'}&l_name=${
      filterBy === 'l_name' ? searchCriteria : '!'
    }&email=${filterBy === 'email' ? searchCriteria : '!'}`;
    try {
      const response = await apiClient.get(url);
      // TODO: there will be pagination in this results
      setResults(response.data.results);
      setLoadingSearch(false);
    } catch (error) {
      setLoadingSearch(true);
      return error;
    }
  };

  return (
    <SearchFiltersContext.Provider
      value={
        {
          results,
          setResults,
          loadingSearch,
          filterBy,
          setFilterBy,
          setSearchCriteria,
          searchCriteria,
          searchRequest
        } as any
      }>
      {props.children}
    </SearchFiltersContext.Provider>
  );
};
