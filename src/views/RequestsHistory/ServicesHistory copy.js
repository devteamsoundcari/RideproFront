import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Card,
  Row,
  Col,
  Table,
  ProgressBar,
  Accordion,
  Button,
  ButtonGroup,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import {
  getUserRequests,
  fetchDriver,
  cancelRequestId,
} from "../../controllers/apiRequests";
import { IoIosArrowForward } from "react-icons/io";
import "./ServiceHistory.scss";

const ServicesHistory = (props) => {
  const today = new Date();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [defaultKey] = useState(location.state ? location.state.id : 0);
  const { setUserInfoContext } = useContext(AuthContext);

  const [renderCancelRequesModal, setRenderCancelRequestModal] = useState({
    show: false,
    item: null,
  });
  // function addDays(date, days) {
  //   var result = new Date(date);
  //   result.setDate(result.getDate() + days);
  //   return result;
  // }

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
      console.log("DATA", res.refund.data);
      // SET COMPANY CONTEXT
      setUserInfoContext((prevState) => ({
        ...prevState,
        company: res.refund.data,
      }));
    } else {
      alert("No se pudo cancelar");
    }
  };

  // ================================ FETCH REQUESTS ON LOAD =====================================================

  useEffect(() => {
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
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/user_requests/`);
  }, [updateList]);

  const getDrivers = async (driversUrls) => {
    return Promise.all(driversUrls.map((url) => fetchDriver(url)));
  };

  // ========================================= LOADING SPINNER =====================================

  useEffect(() => {
    // Sorting requests so that the most recent goes on top
    if (requests.length > 1) {
      requests.sort((a, b) => {
        return a.id - b.id;
      });
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

  // useEffect(() => {
  //   sortedRequests.forEach((item, index) => {
  //     if (location.state && item.id === location.state.id) {
  //       console.log("funcona", index, location.state.id);
  //       setDefaultKey(index);
  //     }
  //   });
  // }, [location.state, sortedRequests]);

  //  ========================================================================================
  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Historial de Solicitudes</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2"></div>
        </div>
      </div>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {!loading && (
        <Accordion defaultActiveKey={defaultKey} className="serviceHistory">
          {sortedRequests.map((item, index) => {
            // console.log(
            //   "Hoy: ",
            //   today,
            //   "Cancelacion: ",
            //   item.cancelDate,
            //   "Es menotr hoy? ",
            //   today < item.cancelDate
            // );

            const newCreatedAtDate = new Date(
              item.created_at
            ).toLocaleDateString();

            const newCreatedAtTime = new Date(
              item.created_at
            ).toLocaleTimeString();

            const newStartDate = new Date(item.start_time).toLocaleDateString();
            const newStartTime = new Date(item.start_time).toLocaleTimeString();

            return (
              <Card
                key={index}
                style={{
                  backgroundColor: item.status.step === 0 ? "#ddd" : "",
                  color: item.status.step === 0 ? "#818182" : "",
                  textDecoration: item.status.step === 0 ? "line-through" : "",
                }}
              >
                <Accordion.Toggle as={Card.Header} eventKey={index}>
                  <Row style={{ alignItems: "center" }}>
                    <Col md={1}>
                      <IoIosArrowForward className="arrow" />
                      <IoIosArrowForward className="arrow" />
                    </Col>
                    <Col md={1}>
                      <strong>Cod: </strong>
                      {item.id}
                    </Col>
                    <Col className="text-center">
                      <strong>Fecha de Creación: </strong>
                      {newCreatedAtDate}
                    </Col>
                    <Col>
                      <strong>Producto: </strong>
                      {item.service.name}
                    </Col>

                    <Col className="text-center">
                      <small>{item.status.name}</small>
                      {item.status.step !== 0 && (
                        <ProgressBar variant="success" now={20} />
                      )}
                    </Col>
                  </Row>
                </Accordion.Toggle>
                <Accordion.Collapse
                  eventKey={index}
                  // className={index === 0 ? "show" : ""}
                >
                  <Card.Body>
                    <Form>
                      <Card.Title>
                        <Row className="text-center">
                          <Col></Col>
                          <Col>Detalle de Programación</Col>
                          <Col>
                            {item.status.step !== 0 && (
                              <ButtonGroup size="sm">
                                {today < item.cancelDate && (
                                  <Button
                                    variant="danger"
                                    onClick={() => handleCancelRequest(item)}
                                  >
                                    Cancelar
                                  </Button>
                                )}
                                <Button variant="info">Modificar</Button>
                              </ButtonGroup>
                            )}
                          </Col>
                        </Row>
                      </Card.Title>
                      <Table bordered hover size="sm" responsive="md">
                        <thead>
                          <tr>
                            {/* <th>Creado por:</th> */}
                            <th>Ciudad</th>
                            <th>Lugar</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {/* <td>
                          <small>
                            {" "}
                            {item.customer.first_name} {item.customer.last_name}
                          </small>
                        </td> */}
                            <td>
                              <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Small text"
                                disabled={item.status.step === 0 ? true : false}
                                value={`${item.municipality.name} (${item.municipality.department.name})`}
                                onChange={(e) => console.log(e.target.value)}
                              />
                            </td>
                            <td>
                              <small>{item.place}</small>
                            </td>
                            <td>
                              <small>{newStartDate}</small>
                              <br />
                            </td>
                            <td>
                              <small>{newStartTime}</small>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Card.Title>
                        <Row>
                          <Col className="text-center">
                            <h6>Participantes Inscritos</h6>
                          </Col>
                        </Row>
                      </Card.Title>
                      <Table bordered hover size="sm" responsive="md">
                        <thead>
                          <tr>
                            <th>Identificacion</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Telefono</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.drivers.map((driver, idx) => {
                            return (
                              <tr key={idx}>
                                <td>{driver.official_id}</td>
                                <td>{driver.first_name}</td>
                                <td>{driver.last_name}</td>
                                <td>{driver.email}</td>
                                <td>{driver.cellphone}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}

          {renderCancelRequesModal.show && (
            <Modal
              size="sm"
              show={renderCancelRequesModal.show}
              onHide={() => setRenderCancelRequestModal({ show: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>Advertencia</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Estas segur@ de que quieres cancelar esta solicitud de servicio?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setRenderCancelRequestModal({ show: false })}
                >
                  No
                </Button>
                <Button
                  variant="danger"
                  // onClick={() => removeUserFromList(showRemoveUserModal.idx)}
                  onClick={cancelRequest}
                >
                  Si, estoy segur@
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Accordion>
      )}
    </React.Fragment>
  );
};

export default ServicesHistory;
