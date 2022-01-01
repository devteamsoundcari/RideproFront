import React from 'react';
import BootstrapTable, { SelectRowProps } from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import './CustomTable.scss';

interface ICustomTableProps {
  columns: any;
  data: any;
  onSelectRow: (x: any) => void;
}

export const CustomTable: React.FunctionComponent<ICustomTableProps> = ({
  data,
  columns,
  onSelectRow
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
    onSelect: (row) => onSelectRow(row)
  };

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div>
      <PaginationListStandalone {...paginationProps} />
      <div>
        <div>
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
        </div>
      </div>
      <PaginationListStandalone {...paginationProps} />
    </div>
  );

  return (
    <PaginationProvider pagination={paginationFactory(options)}>{contentTable}</PaginationProvider>
  );
};
