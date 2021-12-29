import React, { useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { RequestsContext } from '../../../contexts';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import { StatusRenderer } from '../../atoms';
import './TableWithPagination.scss';
import { Link, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { dateToCalendar, dateDDMMYYY, dateFromNow } from '../../../utils/dateFormatter';

export interface ITableWithPaginationProps {
  data: any;
  currentPage: number;
  sizePerPage: number;
  onTableChange: any;
  totalSize: number;
}

export function TableWithPagination({
  data,
  currentPage,
  sizePerPage,
  onTableChange,
  totalSize
}: ITableWithPaginationProps) {
  const { pathname } = useLocation();
  const { isLoadingRequests } = useContext(RequestsContext);

  // STATUS FORMATTER
  const statusFormatter = (cell, row) => <StatusRenderer rowStep={row.status.step} />;

  // CITY FORMATTER
  const cityFormatter = (cell) => cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();

  const dateFormatter = (cell) => {
    const top = dateDDMMYYY(cell);
    const bottom = dateToCalendar(cell);
    return (
      <div>
        <small>{top}</small>
        {top !== bottom && (
          <>
            <br />
            <small className="text-capitalize-first">{bottom}</small>
          </>
        )}
      </div>
    );
  };

  // WAITING TIME FORMATTER
  const waitingTimeFormatter = (cell, row) => {
    const lastInteraction = dateFromNow(row.updated_at);
    return <small>{lastInteraction}</small>;
  };

  const linkCodeFormatter = (cell: number) => {
    return (
      <Link to={`${pathname}/${cell}`} className="font-weight-bold">
        {cell}
      </Link>
    );
  };

  const columns = [
    {
      dataField: 'id',
      text: 'Cód.',
      headerClasses: 'small-column',
      formatter: linkCodeFormatter
    },
    {
      dataField: 'customer.company.name',
      text: 'Cliente'
    },

    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      formatter: cityFormatter
    },
    {
      dataField: 'service.name',
      text: 'Producto'
    },
    {
      dataField: 'start_time',
      text: 'Fecha de Programación',
      formatter: dateFormatter
    },
    {
      dataField: 'finish_time',
      text: 'Última interacción',
      formatter: waitingTimeFormatter
    },
    {
      dataField: 'status.name',
      text: 'Estado',
      formatter: statusFormatter
    }
  ];
  const handleNextPage = ({ page, onPageChange }) => {
    return onPageChange(page + 1);
  };

  const handlePrevPage = ({ page, onPageChange }) => onPageChange(page - 1);

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          // showTotal: false,
          sizePerPage
          // totalSize
        })}>
        {({ paginationProps, paginationTableProps }) => (
          <div
            className="d-flex align-center align-items-center flex-column justify-content-center"
            id="table-pagination">
            <div className="btn-group mb-3 mt-3" role="group">
              <button
                className="btn btn-primary"
                disabled={isLoadingRequests || paginationProps.page === 1 || currentPage === 1}
                onClick={() => handlePrevPage(paginationProps)}>
                Anterior
              </button>
              <button
                disabled={isLoadingRequests || data.length < sizePerPage}
                className="btn btn-success"
                onClick={() => handleNextPage(paginationProps)}>
                Siguiente
              </button>
            </div>
            <BootstrapTable
              remote
              bootstrap4
              keyField="id"
              data={data}
              columns={columns}
              onTableChange={onTableChange}
              filter={filterFactory()}
              noDataIndication={() => <Spinner animation="border" role="status" />}
              {...paginationTableProps}
            />
            <div className="btn-group mb-3 mt-3" role="group">
              <button
                className="btn btn-primary"
                disabled={isLoadingRequests || paginationProps.page === 1 || currentPage === 1}
                onClick={() => handlePrevPage(paginationProps)}>
                Anterior
              </button>
              <button
                disabled={isLoadingRequests || data.length < sizePerPage}
                className="btn btn-success"
                onClick={() => handleNextPage(paginationProps)}>
                Siguiente
              </button>
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
}
