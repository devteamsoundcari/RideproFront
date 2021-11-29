import React, { useContext, useState } from 'react';
import { Button, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { RequestsContext } from '../../../contexts/RequestsContext';
import './SearchBar.scss';

export interface ISearchBarProps {}

export function SearchBar(props: ISearchBarProps) {
  const { isLoadingRequests, getRequestsList } = useContext(RequestsContext);
  const [searchParams, setSearchParams] = useState(null as any);

  const search = (value) => getRequestsList(0, value ? value : '');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchParams !== null) {
        search(searchParams);
      }
    }
  };

  return (
    <InputGroup className="w-75 rounded">
      <FormControl
        disabled={isLoadingRequests}
        className="border rounded"
        placeholder={isLoadingRequests ? 'Cargando eventos...' : 'Buscar'}
        value={searchParams || ''}
        onChange={(e) => setSearchParams(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroup.Append>
        <Button
          variant="outline-secondary"
          disabled={isLoadingRequests}
          onClick={() => {
            if (searchParams !== null) {
              search(searchParams);
            }
          }}>
          {isLoadingRequests ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Buscar'
          )}
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
