import React, { useEffect, useState, useContext } from "react";
import {
  useLocation,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { Container, Card, ProgressBar, Spinner, Alert } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { RequestsContext } from "../../contexts/RequestsContext";
import { AuthContext } from "../../contexts/AuthContext";
import SingleRequestAdmin from "./SingleRequestAdmin/SingleRequestAdmin";
import "./AdminRequestsHistory.scss";

const useMountEffect = (func) => useEffect(func, []);

const AdminRequestsHistory = () => {
  const location = useLocation();
  // eslint-disable-next-line
  const [selectedRow, setSelectedRow] = useState({});
  const history = useHistory();
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const { requestsInfoContext, updateRequestInfo, loadingContext } = useContext(
    RequestsContext
  );
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
    setRequests(requestsInfoContext);
  }, [requestsInfoContext]);

  // ========================================= LOADING SPINNER =====================================

  useEffect(() => {
    // Sorting requests so that the most recent goes on top
    if (requests.length > 1) {
      requests.sort((a, b) => {
        return a.id - b.id;
      });
      // setRequestInfoContext(requests.reverse());
      setSortedRequests(requests.reverse());
      // Show and hide spinner
      if (sortedRequests.length) {
        setLoading(false);
      }
    } else {
      setSortedRequests(requests);
      if (requests.length > 0) {
        setLoading(false);
      }
    }
    //eslint-disable-next-line
  }, [requests]);

  useMountEffect(() => {
    let token = localStorage.getItem("token");
    let requestsSocket = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
    );

    requestsSocket.addEventListener("open", () => {
      let payload = {
        action: "subscribe_to_requests",
        request_id: userInfoContext.id,
      };
      requestsSocket.send(JSON.stringify(payload));
    });

    requestsSocket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      updateRequestInfo(data.data.id);
    });
  });

  //  ========================================================================================
  const statusFormatter = (cell, row) => {
    switch (row.status.step) {
      case 0:
        return (
          <div className="text-center">
            <small>Evento cancelado</small>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <small>Esperando confirmación</small>
            <ProgressBar
              variant="event-requested"
              now={20}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <small>Esperando al cliente</small>
            <ProgressBar
              variant="confirm-event"
              now={30}
              label={`${40}%`}
              srOnly
            />
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <small>Programación aceptada</small>
            <ProgressBar
              variant="event-confirmed"
              now={30}
              label={`${40}%`}
              srOnly
            />
          </div>
        );
      case 4:
        return (
          <div className="text-center">
            <small>Confirmar recepción de documentos</small>
            <ProgressBar
              variant={"confirm-docs"}
              now={70}
              label={`${80}%`}
              srOnly
            />
          </div>
        );
      case 5:
        return (
          <div className="text-center">
            <small>Evento Finalizado</small>
            <ProgressBar
              variant={"event-finished"}
              now={100}
              label={`${100}%`}
              srOnly
            />
          </div>
        );
      default:
        return <p>Undefined</p>;
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
    let created = new Date(row.created_at);
    let now = new Date();
    var difference = Math.abs(now.getTime() - created.getTime());
    var hourDifference = difference / 1000 / 3600;
    return `${Math.floor(hourDifference)} h`;
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
      text: "Tiempo de espera",
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
      {loadingContext ? (
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
                  <p>
                    Para crear una solicitud, ingresa a "Solicitar".
                  </p>
                </Alert>
              ) : 
              (<BootstrapTable
                bootstrap4
                keyField="id"
                data={requests}
                columns={columns}
                selectRow={selectRow}
                filter={filterFactory()}
                pagination={paginationFactory()}
              />)
              }
            </Card>
          </Route>
          <Route path={`${path}/:requestId`} component={SingleRequestAdmin} />
        </Switch>
      )}
    </Container>
  );
};

export default AdminRequestsHistory;
