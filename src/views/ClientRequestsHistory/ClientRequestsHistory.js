import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AiFillDollarCircle } from "react-icons/ai";
import { Container, Card, ProgressBar, Spinner, Alert } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { RequestsContext } from "../../contexts/RequestsContext";
import { getTracks } from "../../controllers/apiRequests";
import { AuthContext } from "../../contexts/AuthContext";
import SingleRequestModal from "./SingleRequestModal/SingleRequestModal";
import "./ClientRequestsHistory.scss";

const useMountEffect = (func) => useEffect(func, []);

const ClientRequestsHistory = () => {
  const location = useLocation();
  //eslint-disable-next-line
  const [tracks, setTracks] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const { requestsInfoContext, updateRequestInfo, loadingContext } = useContext(
    RequestsContext
  );
  const { userInfoContext } = useContext(AuthContext);

  useEffect(() => {
    if (location.state) {
      handleOnSelect(location.state.event);
    }
  }, [location]);

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (url) => {
    let tempTracks = [];
    const response = await getTracks(url);
    response.results.forEach(async (item) => {
      tempTracks.push(item);
    });
    setTracks(tempTracks);
    if (response.next) {
      return await getTracks(response.next);
    }
  };

  useEffect(() => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
  }, []);

  useMountEffect(() => {
    let token = localStorage.getItem("token");
    let requestsSocket = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
    );

    requestsSocket.addEventListener("open", () => {
      let payload = {
        action: "subscribe_to_requests_from_customer",
        customer: userInfoContext.id,
        request_id: userInfoContext.id,
      };
      requestsSocket.send(JSON.stringify(payload));
    });

    requestsSocket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      updateRequestInfo(data.data.id);
    });
  });

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
            <small>Confirmar programación</small>
            <ProgressBar
              variant="confirm-event"
              now={40}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <small>Servicio programado</small>
            <ProgressBar
              variant="event-confirmed"
              now={50}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      case 4:
        return (
          <div className="text-center">
            <small>Servicio programado</small>
            <ProgressBar
              variant="event-confirmed"
              now={50}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      case 5:
        return (
          <div className="text-center">
            <small>Servicio programado</small>
            <ProgressBar
              variant="event-confirmed"
              now={50}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      default:
        return <p>Undefined</p>;
    }
  };

  // const trackFormatter = (cell) => {
  //   if (cell !== null) {
  //     return cell.name;
  //   } else {
  //     return <Alert variant="danger">Sin pista</Alert>;
  //   }
  // };

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

  const handleOnSelect = (row) => {
    console.log("row", row);
    setSelectedRow(row);
    setModalShow(true);
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
              data={requests}
              columns={columns}
              selectRow={selectRow}
              filter={filterFactory()}
              pagination={paginationFactory()}
            />
          )}
        </Card>
      )}
      {modalShow && (
        <SingleRequestModal
          show={true}
          onHide={() => setModalShow(false)}
          selectedRow={selectedRow}
        />
      )}
    </Container>
  );
};

export default ClientRequestsHistory;
