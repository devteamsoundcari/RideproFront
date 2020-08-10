import React, { useEffect, useState, useContext } from "react";
import {
  useLocation,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { RequestsContext } from "../../contexts/RequestsContext";
import SingleRequestAdmin from "./SingleRequestAdmin/SingleRequestAdmin";
import "./AdminRequestsHistory.scss";
import { AuthContext } from "../../contexts/AuthContext";
import OperacionesStatus from "../../utils/OperacionesStatus";
import TecnicoStatus from "../../utils/TecnicoStatus";

const AdminRequestsHistory = () => {
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

  useEffect(() => {
    if (requests.length >= 1) {
      let requestsToSort = [...requests];
      requestsToSort.sort((a, b) => {
        return b.id - a.id;
      });
      setDisplayedRequests(requestsToSort);
    }
  }, [requests]);

  const statusFormatter = (cell, row) => {
    if (userInfoContext.profile === 3) {
      return <OperacionesStatus step={row.status.step} />;
    } else {
      return <TecnicoStatus step={row.status.step} />;
    }
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
  const waitingTimeFormatter = (cell, row) => {
    let created = new Date(row.updated_at);
    let now = new Date();
    var difference = Math.abs(now.getTime() - created.getTime());
    var hourDifference = difference / 1000 / 3600;
    if (row.status.step === 8) {
      return "Completado";
    } else {
      return <small>hace {Math.floor(hourDifference)} horas</small>;
    }
  };
  const columns = [
    {
      dataField: "id",
      text: "Cód.",
      headerClasses: "small-column",
      sort: true,
    },
    {
      dataField: "customer.company.name",
      text: "Cliente",
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
      dataField: "finish_time",
      text: "Última interacción",
      formatter: waitingTimeFormatter,
      sort: true,
    },
    {
      dataField: "status.name",
      text: "Estado",
      formatter: statusFormatter,
      sort: true,
    },
  ];

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
              {displayedRequests.length === 0 ? (
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
          <Route path={`${path}/:requestId`} component={SingleRequestAdmin} />
        </Switch>
      )}
    </Container>
  );
};

export default AdminRequestsHistory;
