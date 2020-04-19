import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import { getUserRequests, fetchDriver } from "../../controllers/apiRequests";
import { IoIosArrowForward } from "react-icons/io";
import "./ServiceHistory.scss";

const ServicesHistory = () => {
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renderCancelRequesModal, setRenderCancelRequestModal] = useState(
    false
  );
  const today = new Date();

  // function addDays(date, days) {
  //   var result = new Date(date);
  //   result.setDate(result.getDate() + days);
  //   return result;
  // }

  const handleCancelRequest = (item) => {
    console.log("cancelar", item);
    setRenderCancelRequestModal(true);
  };

  // ================================ FETCH REQUESTS ON LOAD =====================================================

  useEffect(() => {
    async function fetchRequests(url) {
      const response = await getUserRequests(url);
      response.results.map(async (item) => {
        // ================= GETTING CANCELING DATE ====================
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 2);
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
  }, []);

  const getDrivers = async (driversUrls) => {
    return Promise.all(driversUrls.map((url) => fetchDriver(url)));
  };

  // ========================================= LOADING SPINNER =====================================

  useEffect(() => {
    // Sorting requests so that the most recent goes on top
    requests.sort((a, b) => {
      return a.id - b.id;
    });
    setSortedRequests(requests.reverse());
    // Show and hide spinner
    if (sortedRequests.length) {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, [requests]);

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
        <Accordion defaultActiveKey={0} className="serviceHistory">
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
              <Card key={index}>
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
                      <ProgressBar variant="success" now={20} />
                    </Col>
                  </Row>
                </Accordion.Toggle>
                <Accordion.Collapse
                  eventKey={index}
                  // className={index === 0 ? "show" : ""}
                >
                  <Card.Body>
                    <Card.Title>
                      <Row className="text-center">
                        <Col></Col>
                        <Col>Detalle de Programación</Col>
                        <Col>
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
                            <small>
                              {item.municipality.name} (
                              {item.municipality.department.name})
                            </small>
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
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}

          {renderCancelRequesModal && (
            <Modal
              size="sm"
              show={renderCancelRequesModal}
              onHide={() => setRenderCancelRequestModal(false)}
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
                  onClick={() => setRenderCancelRequestModal(false)}
                >
                  No
                </Button>
                <Button
                  variant="danger"
                  // onClick={() => removeUserFromList(showRemoveUserModal.idx)}
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
