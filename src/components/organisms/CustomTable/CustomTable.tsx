import React from 'react';
import BootstrapTable, { SelectRowProps } from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import './CustomTable.scss';

interface ICustomTableProps {
  columns: any;
  data: any;
  onSelectRow?: (x: any) => void;
  renderSearch?: boolean;
  loading: boolean;
}

export const CustomTable: React.FunctionComponent<ICustomTableProps> = ({
  data,
  columns,
  onSelectRow,
  renderSearch,
  loading
}) => {
  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    showTotal: true,
    totalSize: data.length
  };

  const selectRow: SelectRowProps<any> = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: 'lightgreen' as any,
    onSelect: (row) => (onSelectRow ? onSelectRow(row) : ('' as any))
  };

  const MySearch = (props) => {
    let input;
    const handleChange = () => {
      props.onSearch(input.value);
    };
    return (
      <div>
        <input
          className="form-control"
          disabled={loading}
          placeholder="Buscar..."
          ref={(n) => (input = n)}
          onChange={handleChange}
          type="text"
        />
      </div>
    );
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div className="custom-table">
      <PaginationListStandalone {...paginationProps} />
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={data}
        columns={columns}
        selectRow={selectRow}
        filter={filterFactory()}
        pagination={paginationFactory()}
        rowClasses={'custom-row'}
        {...paginationTableProps}
      />
      <PaginationListStandalone {...paginationProps} />
    </div>
  );

  const tableWithSearch = ({ paginationProps, paginationTableProps }) => (
    <div>
      <PaginationListStandalone {...paginationProps} />
      <ToolkitProvider
        keyField="id"
        columns={columns}
        data={data}
        search
        rowClasses={'custom-row'}
        selectRow={selectRow}
        filter={filterFactory()}
        pagination={paginationFactory()}>
        {(toolkitProps) => (
          <div>
            <MySearch {...toolkitProps.searchProps} />
            <BootstrapTable striped hover {...toolkitProps.baseProps} {...paginationTableProps} />
          </div>
        )}
      </ToolkitProvider>
      <PaginationListStandalone {...paginationProps} />
    </div>
  );

  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {renderSearch ? tableWithSearch : contentTable}
    </PaginationProvider>
  );
};
