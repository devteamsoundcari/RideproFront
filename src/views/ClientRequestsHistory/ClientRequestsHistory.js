import React, { useEffect, useState, useContext } from 'react';
import {
  useLocation,
  Route,
  Switch,
  useRouteMatch,
  useHistory
} from 'react-router-dom';
import { AiFillDollarCircle } from 'react-icons/ai';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { RequestsContext } from '../../contexts/RequestsContext';
import { AuthContext } from '../../contexts/AuthContext';
import SingleRequestClient from './SingleRequestClient/SingleRequestClient';
import './ClientRequestsHistory.scss';
import ClientStatus from '../../utils/ClientStatus';
import { dateFormatter } from '../../utils/helpFunctions';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

const ClientRequestsHistory = () => {
  const location = useLocation();
  const history = useHistory();
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const { requests, isLoadingRequests } = useContext(RequestsContext);
  const { userInfoContext } = useContext(AuthContext);
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (location.state) {
      handleOnSelect(location.state.event);
    }
    // eslint-disable-next-line
  }, [location]);

  // ================================ FETCH REQUESTS ON LOAD =====================================================

  useEffect(() => {
    if (requests.length >= 1) {
      let requestsToSort = [...requests];
      requestsToSort.sort((a, b) => {
        return b.id - a.id;
      });
      setDisplayedRequests(requestsToSort);
    }
  }, [requests]);

  // ========================================= LOADING SPINNER =====================================

  const statusFormatter = (cell, row) => {
    return <ClientStatus step={row.status.step} />;
  };

  const cityFormatter = (cell) =>
    cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();

  const formatDate = (cell) => {
    return dateFormatter(cell);
  };

  const formatName = (cell) => {
    return `${cell.first_name} ${cell.last_name}`;
  };
  const headerCreditFormatter = () => {
    return (
      <span className="credit-header">
        <AiFillDollarCircle />
      </span>
    );
  };

  const creditFormatter = (cell) => {
    return (
      <p className="credit-spent">
        <small>$</small>
        {cell}
      </p>
    );
  };

  const columnsClient = [
    {
      dataField: 'id',
      text: 'Cód.',
      headerClasses: 'small-column',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'created_at',
      text: 'Fecha de solicitud',
      formatter: formatDate,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      formatter: cityFormatter,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'service.name',
      text: 'Producto',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'start_time',
      text: 'Fecha de Programación',
      formatter: formatDate,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'status.name',
      text: 'Estado',
      formatter: statusFormatter,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'spent_credit',
      text: 'Rides',
      headerClasses: 'small-column',
      formatter: creditFormatter,
      headerFormatter: headerCreditFormatter
    }
  ];

  const columnsSuperClient = [
    {
      dataField: 'id',
      text: 'Cód.',
      headerClasses: 'small-column',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'customer.company.name',
      text: 'Empresa',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'customer',
      text: 'Solicitador por',
      formatter: formatName,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'created_at',
      text: 'Fecha de solicitud',
      formatter: formatDate,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      formatter: cityFormatter,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'service.name',
      text: 'Producto',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'start_time',
      text: 'Fecha de Programación',
      formatter: formatDate,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'status.name',
      text: 'Estado',
      formatter: statusFormatter,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'spent_credit',
      text: 'Rides',
      headerClasses: 'small-column',
      formatter: creditFormatter,
      headerFormatter: headerCreditFormatter
    }
  ];

  const handleOnSelect = (row) => {
    history.push(`${url}/${row.id}`);
  };

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: handleOnSelect
  };

  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <button className="btn btn-success float-right m-3" onClick={handleClick}>
        Exportar a CSV
      </button>
    );
  };

  const renderTable = () => {
    return (
      <ToolkitProvider
        bootstrap4
        keyField="id"
        data={displayedRequests}
        columns={
          userInfoContext.profile === 2 ? columnsClient : columnsSuperClient
        }
        // filter={filterFactory()}
        pagination={paginationFactory()}
        exportCSV={{
          fileName: `ridepro-${dateFormatter(new Date())}.csv`
        }}>
        {(props) => (
          <div>
            <MyExportCSV {...props.csvProps} />
            <BootstrapTable
              {...props.baseProps}
              selectRow={selectRow}
              filter={filterFactory()}
            />
          </div>
        )}
      </ToolkitProvider>
    );
  };

  return (
    <Container fluid="md" id="client-requests-history">
      {isLoadingRequests ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Switch>
          <Route exact path={path}>
            <Card>
              {requests.length === 0 ? (
                <Alert variant="light">
                  <Alert.Heading>¡Sin solicitudes!</Alert.Heading>
                  <p>Para crear una solicitud, ingresa a "Solicitar".</p>
                </Alert>
              ) : (
                renderTable()
              )}
            </Card>
          </Route>
          <Route path={`${path}/:requestId`} component={SingleRequestClient} />
        </Switch>
      )}
    </Container>
  );
};

export default ClientRequestsHistory;
