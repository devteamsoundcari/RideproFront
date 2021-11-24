import React, { useState, useEffect } from 'react';
import {
  Nav,
  Navbar,
  NavDropdown,
  Image,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
  Form,
  Spinner
} from 'react-bootstrap';

export interface IFiltersInputProps {
  selectedFilter: (opt: string) => void;
}

export function FiltersInput({ selectedFilter }: IFiltersInputProps) {
  const [filterBy, setFilterBy] = useState('official_id');

  useEffect(() => {
    selectedFilter(filterBy);
  }, [filterBy, selectedFilter]);

  return (
    <InputGroup className="w-75 rounded">
      <FormControl
        disabled={isLoadingRequests || loading}
        className="border rounded"
        placeholder={isLoadingRequests ? 'Cargando eventos...' : 'Buscar'}
        value={searchParams || ''}
        onChange={(e) => setSearchParams(e.target.value)}
      />
      {/* <InputGroup.Append>
      <Button
        variant="outline-secondary"
        disabled={isLoadingRequests || loading}
        onClick={() => {
          if (searchParams !== null) {
            search(searchParams, filterOption);
          }
        }}>
        {isLoadingRequests || loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          'Buscar'
        )}
      </Button>
    </InputGroup.Append> */}
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
