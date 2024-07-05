import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { getInstructors } from '../../../controllers/apiRequests';
import { PaginationTable } from '../../PaginationTable/PaginationTable';
import './AllInstructors.scss';
import { SelectRowProps } from 'react-bootstrap-table-next';

interface Instructor {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  official_id: string;
  documents: string;
  picture: string;
}

const AllInstructors = () => {
  const columns = [
    {
      dataField: 'official_id',
      text: 'Identificación',
      sort: true
    },
    {
      dataField: 'first_name',
      text: 'Nombre'
    },
    {
      dataField: 'last_name',
      text: 'Apellido'
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      sort: true
    },
    {
      dataField: 'municipality.department.name',
      text: 'Departamento',
      sort: true
    },
    {
      dataField: 'email',
      text: 'Email'
    },
    {
      dataField: 'cellphone',
      text: 'Teléfono'
    }
  ];
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [totalInstructors, setTotalInstructors] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const SIZE_PER_PAGE = 25;
  const [loading, setLoading] = useState(false);

  const fetchInstructors = async (url: string, type: string) => {
    setLoading(true);
    if (type === 'page') {
      let tempArr: any[] = [];
      const response: {
        results: object[];
        count: number;
      } = await getInstructors(url);
      response.results.forEach(async (item: any) => {
        tempArr.push(item);
      });
      setInstructors((x): any => [...x, ...tempArr]);
      setTotalInstructors(response.count);
    } else if (type === 'word') {
      const response = await getInstructors(url);
      setInstructors(response.results);
      setTotalInstructors(response.count);
      setCurrentPage(1);
    }
    setLoading(false);
  };

  const search = (
    value: number | string,
    param: string,
    type: string,
    pageToGo?: number
  ) => {
    if (value !== '') {
      const url = `https://app-db.ridepro.co/api/v1/instructors/?${param}=${value}`;
      fetchInstructors(url, type);
      if (pageToGo) {
        setCurrentPage(pageToGo);
      } else {
        setCurrentPage(1);
      }
    }
    if (value === '') {
      const url = `https://app-db.ridepro.co/api/v1/instructors/`;
      fetchInstructors(url, type);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    search(page, 'page', 'page');
    setCurrentPage(page);
  };

  const selectRow: SelectRowProps<any> = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    // @ts-ignore
    bgColor: 'lightgreen'
  };

  useEffect(() => {
    fetchInstructors(
      `${process.env.REACT_APP_API_URL}/api/v1/instructors/`,
      'page'
    );
    //eslint-disable-next-line
  }, []);

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
          <PaginationTable
            onTableSearch={(text) => search(text, 'search', 'word', 1)}
            columns={columns}
            data={instructors.slice(
              (currentPage - 1) * SIZE_PER_PAGE,
              (currentPage - 1) * SIZE_PER_PAGE + SIZE_PER_PAGE
            )}
            page={currentPage}
            sizePerPage={SIZE_PER_PAGE}
            totalSize={totalInstructors}
            onPageChange={(page: number) => handlePageChange(page)}
            onRowClick={selectRow}
            textToShow={'Total de instructores'}
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllInstructors;
