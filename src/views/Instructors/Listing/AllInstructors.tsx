import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import './AllInstructors.scss';

const AllInstructors = ({ loading, instructors }) => {
  const columns = [
    {
      dataField: 'official_id',
      text: 'Identificación',
      filter: textFilter(),
      sort: true
    },
    {
      dataField: 'first_name',
      text: 'Nombre',
      filter: textFilter()
    },
    {
      dataField: 'last_name',
      text: 'Apellido',
      filter: textFilter()
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'municipality.department.name',
      text: 'Departamento',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'email',
      text: 'Email',
      filter: textFilter()
    },
    {
      dataField: 'cellphone',
      text: 'Teléfono',
      filter: textFilter()
    }
  ];

  return (
    <Card className="allUsers mt-3">
      <Card.Body>
        <Card.Title>
          Instructores{' '}
          {loading && (
            <Spinner animation="border" role="status" size="sm">
              <span className="sr-only">Cargando...</span>
            </Spinner>
          )}
        </Card.Title>
        <Card.Body>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={instructors}
            columns={columns}
            pagination={paginationFactory()}
            hover
            filter={filterFactory()}
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllInstructors;
