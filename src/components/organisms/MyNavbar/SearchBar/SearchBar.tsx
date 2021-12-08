import React, { useContext } from 'react';
import { Button, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { RequestsContext } from '../../../../contexts';
import { useParams, useNavigate } from 'react-router-dom';

export interface ISearchBarProps {}

export function SearchBar(props: ISearchBarProps) {
  const { requestId } = useParams();
  let navigate = useNavigate();

  const {
    isLoadingRequests,
    getRequestsList,
    searchParams,
    setSearchParams,
    resetPagination,
    setResetPagination
  } = useContext(RequestsContext);

  const search = (value) => {
    getRequestsList(0, value ? value : '');
    setResetPagination(!resetPagination);
    if (requestId) navigate('..', { replace: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchParams !== null) {
        search(searchParams);
      }
    }
  };

  return (
    <InputGroup className="w-25 rounded ml-3">
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
