import React, { useContext } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import BootstrapTable from 'react-bootstrap-table-next';
import { AuthContext } from '../../../contexts';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import { allStatus } from '../../../allStatus';
import { StatusRenderer } from '../../atoms';
import './TableWithPagination.scss';
import { Link, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
moment.locale('es');

export interface ITableWithPaginationProps {
  data: any;
  page: number;
  sizePerPage: number;
  onTableChange: any;
  totalSize: number;
}

export function TableWithPagination({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize
}: ITableWithPaginationProps) {
  const { pathname } = useLocation();
  const { userInfo } = useContext(AuthContext);

  // STATUS FORMATTER
  const statusFormatter = (cell, row) => {
    const foundProfile = allStatus.find(
      (user) => user.profile.profile === userInfo.profile
    );
    const foundStep = foundProfile?.steps.find(
      ({ step }) => step === row.status.step
    );
    return <StatusRenderer step={foundStep} />;
  };

  // CITY FORMATTER
  const cityFormatter = (cell) =>
    cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();

  const dateFormatter = (cell) => {
    return (
      <div>
        <small>{moment(cell).format('DD/MM/YYYY')}</small>
        <br />
        <small className="text-capitalize-first">
          {moment(cell).calendar()}
        </small>
      </div>
    );
  };
  //  moment(cell).format('DD/MM/YYYY');

  // WAITING TIME FORMATTER
  const waitingTimeFormatter = (cell, row) => {
    const lastInteraction = moment(moment(row.updated_at)).fromNow();
    return <small>{lastInteraction}</small>;
  };

  const linkCodeFormatter = (cell: number) => {
    return (
      <Link
        to={`${pathname}/${cell}`}
        target="_blank"
        className="font-weight-bold">
        {cell}
      </Link>
    );
  };

  const columns = [
    {
      dataField: 'id',
      text: 'Cód.',
      headerClasses: 'small-column',
      formatter: linkCodeFormatter,
      sort: true
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

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize
        })}>
        {({ paginationProps, paginationTableProps }) => (
          <div
            className="d-flex align-center flex-column justify-content-center"
            id="table-pagination">
            <div className="d-flex justify-content-end mt-3">
              <PaginationListStandalone {...paginationProps} />
            </div>
            <BootstrapTable
              remote
              bootstrap4
              keyField="id"
              data={data}
              columns={columns}
              onTableChange={onTableChange}
              filter={filterFactory()}
              noDataIndication={() => (
                <Spinner animation="border" role="status" />
              )}
              {...paginationTableProps}
            />
            <div className="d-flex justify-content-end">
              <PaginationListStandalone {...paginationProps} />
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
}
