import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { RequestsContext } from "../../contexts/RequestsContext";
import { Container, Card, ProgressBar, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import "./AdminRequestsHistory.scss";
import SingleRequestModalAdmin from "./SingleRequestModalAdmin/SingleRequestModalAdmin";

const AdminRequestsHistory = () => {
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const { requestsInfoContext } = useContext(RequestsContext);

  useEffect(() => {
    if (location.state) {
      handleOnSelect(location.state.event);
    }
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
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Card>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={requests}
            columns={columns}
            // expandRow={expandRow}
            selectRow={selectRow}
            filter={filterFactory()}
            pagination={paginationFactory()}
          />
        </Card>
      )}
      {modalShow && (
        <SingleRequestModalAdmin
          show={true}
          onHide={() => setModalShow(false)}
          selectedRow={selectedRow}
        />
      )}
    </Container>
  );
};

export default AdminRequestsHistory;
