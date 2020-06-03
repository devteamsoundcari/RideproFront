import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { getTracks } from "../../controllers/apiRequests";
import {
  Table,
  Container,
  Card,
  Row,
  Col,
  ProgressBar,
  Alert,
  Button,
  Badge,
  Tabs,
  Spinner,
  Tab,
  Nav,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import "./AdminRequestHistory.scss";
import {
  getUserRequests,
  fetchDriver,
  cancelRequestId,
} from "../../controllers/apiRequests";

const AdminRequestHistory = () => {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [defaultKey] = useState(location.state ? location.state.id : 0);
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);

  // const { setRequestInfoContext } = useContext(RequestContext)

  const [renderCancelRequesModal, setRenderCancelRequestModal] = useState({
    show: false,
    item: null,
  });

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

  // ==================================================================================
  const handleCancelRequest = (item) => {
    setRenderCancelRequestModal({ show: true, item: item });
  };

  // =============== CANCELING THE REQUEST AND REFIND CREDITS ========================================================

  const cancelRequest = async () => {
    let data = {
      id: renderCancelRequesModal.item.id,
      company: renderCancelRequesModal.item.customer.company.id,
      refund_credits:
        renderCancelRequesModal.item.drivers.length *
          renderCancelRequesModal.item.service.ride_value +
        renderCancelRequesModal.item.customer.company.credit,
    };
    let res = await cancelRequestId(data);
    if (res.canceled.status === 200 && res.refund.status === 200) {
      setRequests([]);
      setRenderCancelRequestModal({ show: false });
      setUpdateList(!updateList);
      // SET COMPANY CONTEXT
      setUserInfoContext({
        ...userInfoContext,
        company: {
          ...userInfoContext.company,
          credit: res.refund.data.credit,
        },
      });
    } else {
      alert("No se pudo cancelar");
    }
  };

  // ================================ FETCH REQUESTS ON LOAD =====================================================

  useEffect(() => {
    let urlType = userInfoContext.profile === 2 ? "user_requests" : "requests";
    async function fetchRequests(url) {
      const response = await getUserRequests(url);
      response.results.map(async (item) => {
        // ================= GETTING CANCELING DATE ====================
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        item.cancelDate = cancelDate;
        // =========== GETTING INFO OF EACH DRIVER =================
        getDrivers(item.drivers).then((data) => {
          item.drivers = data;
          setRequests((prev) => [...prev, item]);
        });
        return true;
      });
      if (response.next) {
        return await fetchRequests(response.next);
      }
    }
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/${urlType}/`);
  }, [updateList, userInfoContext.profile]);

  const getDrivers = async (driversUrls) => {
    return Promise.all(driversUrls.map((url) => fetchDriver(url)));
  };

  // ========================================= LOADING SPINNER =====================================

  useEffect(() => {
    console.log("reqiest", requests);
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
      case 1:
        return (
          <div className="text-center">
            <small>Esperando confirmación</small>
            <ProgressBar variant="danger" now={20} label={`${60}%`} srOnly />
          </div>
        );
      case 2:
        return <ProgressBar now={80} label={`${80}%`} srOnly />;
      default:
        return <p>Undefined</p>;
    }
  };

  const trackFormatter = (cell) => {
    if (cell !== null) {
      return cell.name;
    } else {
      return <Alert variant="danger">Sin pista</Alert>;
    }
  };

  const cityFormatter = (cell) =>
    cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();

  const dateFormatter = (cell) => {
    let d = new Date(cell);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return d.toLocaleTimeString("es-ES", options);
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
      dataField: "municipality.department.name",
      text: "Departamento",
      sort: true,
    },
    {
      dataField: "municipality.name",
      text: "Ciudad",
      sort: true,
      formatter: cityFormatter,
      filter: textFilter(),
    },
    {
      dataField: "track",
      text: "Lugar/Pista",
      formatter: trackFormatter,
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
  ];

  const expandRow = {
    parentClassName: "selected-row",
    className: "selected-expanding-row",
    showExpandColumn: true,
    onlyOneExpanding: true,
    renderer: (row) => (
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Link eventKey="first">General</Nav.Link>
              <Nav.Link eventKey="second">
                Lugar{" "}
                {row.track === null ? <Badge variant="danger">!</Badge> : ""}
              </Nav.Link>
              <Nav.Link eventKey="third">
                Participantes ({row.drivers.length})
              </Nav.Link>
            </Nav>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Servicio</th>
                      <th>Tipo de Servicio</th>
                      <th>Creditos pagados</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{row.service.name}</td>
                      <td>{row.service.service_type}</td>
                      <td>{row.spent_credit}</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
                <p>
                  You can render anything here, also you can add additional data
                  on every row object
                </p>
                <p>
                  expandRow.renderer callback will pass the origin row object to
                  you
                </p>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <Table striped responsive hover size="sm">
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.drivers.map((driver, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{driver.official_id}</td>
                          <td>
                            {driver.first_name} {driver.last_name}
                          </td>
                          <td>
                            {driver.first_name} {driver.last_name}
                          </td>
                          <td>{driver.cellphone}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    ),
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <FaEyeSlash />;
      }
      return <FaEye />;
    },
  };

  return (
    <Container fluid="md" className="admin-requests-history">
      {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Historial de solicitudes</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2"></div>
        </div>
      </div> */}
      {requests.length === 0 ? (
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
            expandRow={expandRow}
            filter={filterFactory()}
            pagination={paginationFactory()}
          />
        </Card>
      )}
    </Container>
  );
};

export default AdminRequestHistory;
