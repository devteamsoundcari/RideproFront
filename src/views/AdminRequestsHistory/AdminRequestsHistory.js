import React, { useEffect, useState, useContext } from 'react';
import {
  useLocation,
  Route,
  Switch,
  useRouteMatch,
  useHistory
} from 'react-router-dom';
import { Container, Card, Alert } from 'react-bootstrap';
import { RequestsContext } from '../../contexts/RequestsContext';
import SingleRequestAdmin from './SingleRequestAdmin/SingleRequestAdmin';
import { TableWithPagination } from './TableWithPagination/TableWithPagination';
import './AdminRequestsHistory.scss';

const AdminRequestsHistory = () => {
  const location = useLocation();
  const history = useHistory();
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const {
    getRequestsList,
    requests,
    isLoadingRequests,
    count,
    getNextPageOfRequests
  } = useContext(RequestsContext);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [sizePerPage, setSizePerPage] = useState(25);
  const [loadedPages, setLoadedPages] = useState([1]);

  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (location.state) {
      handleOnSelect(location.state.event);
    }
    // eslint-disable-next-line
  }, [location]);

  // ========================= SETTING REQUESTS CONTEXT ON LOAD =======================================

  useEffect(() => {
    getRequestsList();
    // eslint-disable-next-line
  }, []);

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

  const handleOnSelect = (row) => {
    history.push(`${url}/${row.id}`);
  };

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
    <Container fluid id="client-requests-history">
      <Switch>
        <Route path={`${path}/:requestId`} component={SingleRequestAdmin} />

        <Route exact path={path}>
          <Card>
            {displayedRequests.length === 0 && !isLoadingRequests ? (
              <Alert variant="light">
                <Alert.Heading>¡Sin solicitudes!</Alert.Heading>
                <p>Para crear una solicitud, ingresa a "Solicitar".</p>
              </Alert>
            ) : (
              <TableWithPagination
                data={displayedRequests}
                page={currentPage}
                sizePerPage={sizePerPage}
                totalSize={count}
                onTableChange={handleTableChange}
              />
            )}
          </Card>
        </Route>
      </Switch>
    </Container>
  );
};

export default AdminRequestsHistory;
