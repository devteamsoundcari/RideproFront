import React, { useEffect, useState, useContext } from "react";
import {
  useLocation,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { AiFillDollarCircle } from "react-icons/ai";
import { Container, Card, ProgressBar, Spinner, Alert } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { RequestsContext } from "../../contexts/RequestsContext";
import SingleRequestModal from "./SingleRequestModal/SingleRequestModal";
import SingleRequestClient from "./SingleRequestClient/SingleRequestClient";
import "./ClientRequestsHistory.scss";
import ClientStatus from "../../utils/ClientStatus";

const ClientRequestsHistory = () => {
  const location = useLocation();
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const { requests, isLoadingRequests } = useContext(RequestsContext);
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (location.state) {
      handleOnSelect(location.state.event);
    }
  }, [location]);

  // ================================ FETCH REQUESTS ON LOAD =====================================================

  useEffect(() => {
    if (requests.length > 1) {
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

  const dateFormatter = (cell) => {
    let d = new Date(cell);
    const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(d);
    return `${month}/${day}/${year}`;
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

  const columns = [
    {
      dataField: "id",
      text: "Cód.",
      headerClasses: "small-column",
      sort: true,
    },
    {
      dataField: "created_at",
      text: "Fecha de solicitud",
      formatter: dateFormatter,
      sort: true,
    },
    {
      dataField: "municipality.name",
      text: "Ciudad",
      formatter: cityFormatter,
      sort: true,
    },
    {
      dataField: "service.name",
      text: "Producto",
      sort: true,
    },
    {
      dataField: "start_time",
      text: "Fecha de Programación",
      formatter: dateFormatter,
      sort: true,
    },
    {
      dataField: "status.name",
      text: "Estado",
      formatter: statusFormatter,
      sort: true,
    },
    {
      dataField: "spent_credit",
      text: "Rides",
      headerClasses: "small-column",
      formatter: creditFormatter,
      headerFormatter: headerCreditFormatter,
    },
  ];

  // const handleOnSelect = (row) => {
  //   console.log("row", row);
  //   setSelectedRow(row);
  //   setModalShow(true);
  // };
  const handleOnSelect = (row) => {
    history.push(`${url}/${row.id}`);
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: handleOnSelect,
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
                <BootstrapTable
                  bootstrap4
                  keyField="id"
                  data={displayedRequests}
                  columns={columns}
                  selectRow={selectRow}
                  filter={filterFactory()}
                  pagination={paginationFactory()}
                />
              )}
            </Card>
          </Route>
          <Route path={`${path}/:requestId`} component={SingleRequestClient} />
        </Switch>
      )}
      {/* {modalShow && (
        <SingleRequestModal
          show={true}
          onHide={() => setModalShow(false)}
          selectedRow={selectedRow}
        />
      )} */}
    </Container>
  );
};

export default ClientRequestsHistory;
