import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { RequestsContext } from '../../../contexts';
import { TableWithPagination } from '../../molecules';
import './AdminRequestsHistory.scss';

export const AdminRequestsHistory = () => {
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const { requests, count, getNextPageOfRequests } =
    useContext(RequestsContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sizePerPage] = useState(25);
  const [loadedPages, setLoadedPages] = useState([1]);

  const sortById = (data) =>
    data.sort((a, b) => {
      return b.id - a.id;
    });

  const findMissingNumbers = (arr) => {
    // eslint-disable-next-line no-sequences
    const sparse = arr.reduce((sparse, i) => ((sparse[i] = 1), sparse), []);
    return [...sparse.keys()].filter((i) => i && !sparse[i]);
  };

  useEffect(() => {
    const totalOfRequests = requests.length;
    const requestsToSort = sortById(requests);
    if (totalOfRequests >= 1) {
      if (currentPage === 1) {
        setDisplayedRequests(requestsToSort);
      } else {
        const skippedPages = findMissingNumbers(loadedPages).length;
        let currentIndex = (currentPage - 1) * sizePerPage;
        currentIndex = currentIndex - skippedPages * sizePerPage;
        const slicedRequests = requestsToSort.slice(
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
      const sortedRequests = sortById(requests).slice(
        currentIndex,
        currentIndex + sizePerPage
      );
      setDisplayedRequests(sortedRequests);
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
