import * as React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';

export interface IPaginationTableProps {
  data: any;
  page: number;
  sizePerPage: number;
  onPageChange: any;
  totalSize: number;
  columns: any;
  onRowClick: any;
  onTableSearch?: (searchText: string) => any;
  textToShow?: string;
}

export function PaginationTable({
  data,
  page,
  sizePerPage,
  onPageChange,
  totalSize,
  columns,
  onTableSearch,
  onRowClick,
  textToShow
}: IPaginationTableProps) {
  const [searchText, setSearchText] = React.useState<string>('');
  return (
    <div>
      {onTableSearch && (
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar"
            aria-label="Search button"
            aria-describedby="search-button"
            onChange={(e: any) => setSearchText(e.target.value)}
            onKeyPress={(e: any) => {
              if (e.key === 'Enter') onTableSearch(searchText);
            }}
          />
          <InputGroup.Text
            id="search-button"
            role="button"
            onClick={() => onTableSearch(searchText)}>
            Buscar
          </InputGroup.Text>
        </InputGroup>
      )}
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize,
          paginationSize: 1,
          withFirstAndLast: false
        })}>
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <div>
              <PaginationListStandalone {...paginationProps} />
            </div>
            <BootstrapTable
              remote
              bootstrap4
              keyField="id"
              rowClasses="track-row"
              data={data}
              columns={columns}
              selectRow={onRowClick}
              onTableChange={(_, { page }) => onPageChange(page)}
              {...paginationTableProps}
            />
            <div>
              <p>
                {textToShow ? textToShow : 'Total de pistas'}: {totalSize}
              </p>
            </div>
            <div>
              <PaginationListStandalone {...paginationProps} />
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
}
