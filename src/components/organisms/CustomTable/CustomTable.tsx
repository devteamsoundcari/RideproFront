import React from 'react';
import BootstrapTable, { SelectRowProps } from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import './CustomTable.scss';
import { Spinner } from 'react-bootstrap';

interface ICustomTableProps {
  columns: any;
  data: any;
  onSelectRow?: (row: any, isSelect?: any, rowIndex?: any, e?: any) => void;
  renderSearch?: boolean;
  loading: boolean;
  showPagination?: boolean;
  paginationSize?: number;
  hideSelectColumn?: boolean;
  showExpandRow?: boolean;
  expandComponent?: any;
  keyField: string;
  selectionMode?: 'radio' | 'checkbox';
}

export const CustomTable: React.FunctionComponent<ICustomTableProps> = ({
  keyField,
  data,
  columns,
  onSelectRow,
  renderSearch,
  loading,
  showPagination = true,
  paginationSize = 10,
  hideSelectColumn = true,
  showExpandRow = false,
  expandComponent,
  selectionMode = 'radio'
}) => {
  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    showTotal: true,
    totalSize: data.length,
    sizePerPageList: [
      {
        text: String(paginationSize),
        value: paginationSize
      }
    ]
  };

  const selectRow: SelectRowProps<any> = {
    mode: selectionMode,
    clickToSelect: true,
    hideSelectColumn: hideSelectColumn,
    selectColumnPosition: 'right',
    bgColor: 'lightgreen' as any,
    onSelect: (row, isSelect, rowIndex, e) =>
      onSelectRow ? onSelectRow(row, isSelect, rowIndex, e) : ('' as any)
  };

  const expandRow = {
    parentClassName: 'parent-row',
    className: 'expanding-foo',
    onlyOneExpanding: true,
    // renderer: (row) => <ExpandSection row={row} />,
    renderer: (row) => expandComponent(row),
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <b>-</b>;
      }
      return <b>+</b>;
    }
  };

  const MySearch = (props) => {
    let input;
    const handleChange = () => {
      props.onSearch(input.value);
    };
    return (
      <div className={showPagination ? 'w-75' : 'w-100'}>
        <input
          className="form-control"
          disabled={loading}
          placeholder={loading ? 'Cargando...' : 'Buscar...'}
          ref={(n) => (input = n)}
          onChange={handleChange}
          type="text"
        />
      </div>
    );
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div className="custom-table">
      {showPagination && <PaginationListStandalone {...paginationProps} />}
      <BootstrapTable
        bootstrap4
        keyField={keyField}
        data={data}
        columns={columns}
        selectRow={selectRow}
        filter={filterFactory()}
        pagination={paginationFactory(options)}
        rowClasses={'custom-row'}
        noDataIndication={indication}
        expandRow={showExpandRow ? expandRow : {}}
        {...paginationTableProps}
      />
      {showPagination && <PaginationListStandalone {...paginationProps} />}
    </div>
  );

  const indication = loading ? (
    <Spinner animation="border" variant="secondary" />
  ) : (
    <>No hay datos</>
  );

  const tableWithSearch = ({ paginationProps, paginationTableProps }) => (
    <div className="custom-table">
      {showPagination && <PaginationListStandalone {...paginationProps} />}
      <ToolkitProvider
        keyField={keyField}
        columns={columns}
        data={data}
        search
        rowClasses={'custom-row'}
        selectRow={selectRow}
        filter={filterFactory()}
        pagination={paginationFactory(options)}>
        {(toolkitProps) => (
          <div>
            <MySearch {...toolkitProps.searchProps} />
            <BootstrapTable
              striped
              hover
              {...toolkitProps.baseProps}
              {...paginationTableProps}
              selectRow={selectRow}
              noDataIndication={indication}
              expandRow={showExpandRow ? expandRow : {}}
            />
          </div>
        )}
      </ToolkitProvider>
      {showPagination && <PaginationListStandalone {...paginationProps} />}
    </div>
  );

  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {renderSearch ? tableWithSearch : contentTable}
    </PaginationProvider>
  );
};
