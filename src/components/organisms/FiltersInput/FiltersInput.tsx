import React, { useContext } from 'react';
import { SearchFiltersContext } from '../../../contexts';
import {
  InputGroup,
  FormControl,
  Button,
  Form,
  Spinner
} from 'react-bootstrap';

export function FiltersInput() {
  const {
    setSearchCriteria,
    loadingSearch,
    searchCriteria,
    searchRequest,
    setFilterBy,
    filterBy
  } = useContext(SearchFiltersContext);

  return (
    <InputGroup className="w-75 rounded" id="filters-input">
      <FormControl
        disabled={loadingSearch}
        className="border rounded"
        placeholder={loadingSearch ? 'Cargando eventos...' : 'Buscar'}
        value={searchCriteria || ''}
        onChange={(e) => setSearchCriteria(e.target.value)}
      />
      <InputGroup.Append>
        <Button
          variant="outline-secondary"
          disabled={loadingSearch}
          onClick={() => {
            if (searchCriteria !== null) searchRequest();
          }}>
          {loadingSearch ? <Spinner animation="border" size="sm" /> : 'Buscar'}
        </Button>
      </InputGroup.Append>
      <InputGroup.Append className="ml-3">
        <Form.Check
          inline
          onChange={(x: any) => setFilterBy(x.target.value)}
          as="input"
          label="POR Cedula"
          type="radio"
          value="official_id"
          id="search-official_id"
          checked={filterBy === 'official_id'}
        />
        <Form.Check
          as="input"
          onChange={(x: any) => setFilterBy(x.target.value)}
          inline
          label="POR Nombre"
          type="radio"
          value="f_name"
          id="search-f_name"
          checked={filterBy === 'f_name'}
        />
        <Form.Check
          as="input"
          onChange={(x: any) => setFilterBy(x.target.value)}
          inline
          label="POR Apellido"
          type="radio"
          value="l_name"
          checked={filterBy === 'l_name'}
          id="search-l_name"
        />
        <Form.Check
          as="input"
          onChange={(x: any) => setFilterBy(x.target.value)}
          inline
          label="POR EMAIL"
          type="radio"
          value="email"
          checked={filterBy === 'email'}
          id="search-email"
        />
      </InputGroup.Append>
    </InputGroup>
  );
}
