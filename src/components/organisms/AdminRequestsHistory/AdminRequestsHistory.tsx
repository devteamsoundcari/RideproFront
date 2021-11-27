import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { RequestsContext } from '../../../contexts';
import { TableWithPagination } from '../../molecules';
import './AdminRequestsHistory.scss';

export const AdminRequestsHistory = () => {
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const { requests, count, getNextPageOfRequests, getRequestsList } =
    useContext(RequestsContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sizePerPage] = useState(25);
  const [loadedPages, setLoadedPages] = useState([1]);

  useEffect(() => {
    getRequestsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findMissingNumbers = (arr) => {
    // eslint-disable-next-line no-sequences
    const sparse = arr.reduce((sparse, i) => ((sparse[i] = 1), sparse), []);
    return [...sparse.keys()].filter((i) => i && !sparse[i]);
  };

  useEffect(() => {
    const totalOfRequests = requests.length;
    if (totalOfRequests >= 1) {
      if (currentPage === 1) {
        setDisplayedRequests(requests);
      } else {
        const skippedPages = findMissingNumbers(loadedPages).length;
        let currentIndex = (currentPage - 1) * sizePerPage;
        currentIndex = currentIndex - skippedPages * sizePerPage;
        const slicedRequests = requests.slice(
          currentIndex,
          currentIndex + sizePerPage
        );
        setDisplayedRequests(slicedRequests);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  const handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setCurrentPage(page);
    if (!loadedPages.includes(page)) {
      getNextPageOfRequests(page);
      setLoadedPages(loadedPages.concat([page]));
    } else {
      console.log(
        'slice',
        currentIndex,
        currentIndex ? currentIndex + sizePerPage : sizePerPage - 1
      );
      const slicedRequests = requests.slice(
        currentIndex,
        currentIndex ? currentIndex + sizePerPage : sizePerPage - 1
      );
      setDisplayedRequests(slicedRequests);
    }
  };

  return (
    <Container fluid id="#admin-requests-history">
      <TableWithPagination
        data={displayedRequests}
        page={currentPage}
        sizePerPage={sizePerPage}
        totalSize={count}
        onTableChange={handleTableChange}
      />
    </Container>
  );
};
