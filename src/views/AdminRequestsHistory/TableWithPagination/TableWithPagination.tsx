import React, { useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import { AuthContext } from '../../../contexts/AuthContext';
import { RequestsContext } from '../../../contexts/RequestsContext';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import { Spinner } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router';
import OperacionesStatus from '../../../utils/OperacionesStatus';
import TecnicoStatus from '../../../utils/TecnicoStatus';
import AdminStatus from '../../../utils/AdminStatus';

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
  const { userInfoContext } = useContext(AuthContext);
  const { isLoadingRequests } = useContext(RequestsContext);
  const history = useHistory();
  let { url } = useRouteMatch();

  const handleOnSelect = (row) => {
    history.push(`${url}/${row.id}`);
  };

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: handleOnSelect
  };

  // STATUS FORMATTER
  const statusFormatter = (cell, row) => {
    if (userInfoContext.profile === 3) {
      return <OperacionesStatus step={row.status.step} />;
    } else if (userInfoContext.profile === 1) {
      return <AdminStatus step={row.status.step} />;
    } else {
      return <TecnicoStatus step={row.status.step} />;
    }
  };

  // CITY FORMATTER
  const cityFormatter = (cell) =>
    cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();
  const dateFormatter = (cell) => {
    let d = new Date(cell);
    const dateTimeFormat = new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [{ value: month }, , { value: day }, , { value: year }] =
      dateTimeFormat.formatToParts(d);
    return `${month}/${day}/${year}`;
  };

  // WAITING TIME FORMATTER
  const waitingTimeFormatter = (cell, row) => {
    let created = new Date(row.updated_at);
    let now = new Date();
    let difference = Math.abs(now.getTime() - created.getTime());
    let hourDifference = difference / 1000 / 3600;
    let days = Math.floor(hourDifference / 24);
    if (userInfoContext.profile === 3 && row.status.step > 5) {
      return <small>Completado el {dateFormatter(created)}</small>;
    } else if (userInfoContext.profile === 5 && row.status.step > 4) {
      return <small>Completado el {dateFormatter(created)}</small>;
    } else {
      if (hourDifference > 24) {
        return (
          <small>
            Hace {days} {days > 1 ? 'días' : 'día'}
          </small>
        );
      }
      return <small>hace {Math.floor(hourDifference)} horas</small>;
    }
  };

  const columns = [
    {
      dataField: 'id',
      text: 'Cód.',
      headerClasses: 'small-column'
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
          <div className="d-flex align-center flex-column justify-content-center">
            <div className="d-flex justify-content-center mt-3">
              <PaginationListStandalone {...paginationProps} />
              {isLoadingRequests && (
                <Spinner animation="border" className="mt-1" variant="info" />
              )}
            </div>
            <BootstrapTable
              remote
              bootstrap4
              keyField="id"
              data={data}
              selectRow={selectRow}
              columns={columns}
              onTableChange={onTableChange}
              filter={filterFactory()}
              {...paginationTableProps}
            />
            <div className="d-flex justify-content-center ">
              <PaginationListStandalone {...paginationProps} />
              {isLoadingRequests && (
                <Spinner animation="border" className="mt-1" variant="info" />
              )}
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
}
