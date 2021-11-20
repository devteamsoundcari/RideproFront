import React, { useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import { getColumns } from './getColumns';
import { AuthContext } from '../../../contexts/AuthContext';
import { RequestsContext } from '../../../contexts/RequestsContext';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import { Spinner } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router';

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
              columns={getColumns(userInfoContext.profile)}
              onTableChange={onTableChange}
              filter={filterFactory()}
              {...paginationTableProps}
            />
            <div className="d-flex justify-content-center ">
              <PaginationListStandalone {...paginationProps} />
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
}
