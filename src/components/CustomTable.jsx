import React from "react";
import { Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { DebounceInput } from "react-debounce-input";

export default function CustomTable({
  columns,
  data,
  sizePerPage,
  onPageChange,
  totalSize,
  expandRow,
  onSearch,
  showTopPagination,
  rowClasses,
  onRowClick
}) {
  const MySearch = (props) => {
    const handleChange = (e) => {
      onSearch(e.target.value);
    };
    return (
      <div>
        <DebounceInput
          className="form-control mb-3"
          placeholder="Buscar..."
          minLength={2}
          debounceTimeout={2000}
          onChange={handleChange}
        />
      </div>
    );
  };

  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    showTotal: true,
    totalSize,
    sizePerPage: sizePerPage || 10,
    onPageChange
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(`clicked on row with index: ${rowIndex}`);
      if (onRowClick) onRowClick(row);
    }
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div>
      {showTopPagination && (
        <div className="d-flex justify-content-center">
          <PaginationListStandalone {...paginationProps} />
        </div>
      )}
      <ToolkitProvider
        keyField="id"
        columns={columns}
        data={data}
        search
        bootstrap4>
        {(toolkitprops) => (
          <div>
            <MySearch {...toolkitprops.searchProps} />
            <BootstrapTable
              remote
              striped
              rowEvents={rowEvents}
              hover
              noDataIndication={() => <Spinner animation="border" size="xl" />}
              {...toolkitprops.baseProps}
              {...paginationTableProps}
              expandRow={expandRow}
              rowClasses={`rowClass ${rowClasses}`}
            />
          </div>
        )}
      </ToolkitProvider>
      <div className="d-flex justify-content-center">
        <PaginationListStandalone {...paginationProps} />
      </div>
    </div>
  );

  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {contentTable}
    </PaginationProvider>
  );
}
