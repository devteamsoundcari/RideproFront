import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Button,
  ProgressBar,
  Tab,
  Tabs,
  Nav,
  Row,
  Col,
  Container,
  Spinner,
  Table,
  Form,
} from "react-bootstrap";
import swal from "sweetalert";
import { EditableTable } from "../../../utils/EditableTable";
import RegularExpressions from "../../../utils/RegularExpressions";
import {
  cancelRequestId,
  getAllDrivers,
  sendEmail,
  updateRequest,
} from "../../../controllers/apiRequests";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestsContext } from "../../../contexts/RequestsContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import ServiceEditConfirmationModal from "./ServiceEditConfirmationModal";
import NotEnoughCreditsModal from "./NotEnoughCreditsModal";
import "./SingleRequestModal.scss";
import { TiCogOutline } from "react-icons/ti";
import {
  MdHelpOutline,
  MdLocalPhone,
  MdPeople,
  MdLocationOn,
} from "react-icons/md";
import { FaEnvelope } from "react-icons/fa";

const SingleRequestModal = (props) => {
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showNotEnoughCreditsModal, setShowNotEnoughCreditsModal] = useState(
    false
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updateRequestsContext } = useContext(RequestsContext);
  const [selectedOption, setSelectedOption] = useState(0);

  const {
    setAllParticipantsInfoContext,
    setRegisteredParticipantsContext,
    setParticipantsToRegisterContext,
    newParticipantsContext,
    setNewParticipantsContext,
  } = useContext(ParticipantsContext);

  const {
    service,
    municipality,
    id,
    customer,
    status,
    track,
    start,
    spent_credit,
    drivers,
    start_time,
    accept_msg,
    created_at,
    operator,
    optional_place1,
    optional_date1,
    optional_place2,
    optional_date2,
    new_request,
  } = props.selectedRow;

  const [additionalCredits, setAdditionalCredits] = useState(0);
  const [driversForReplacing, setDriversForReplacing] = useState([]);
  const [allDrivers, setAllDrivers] = useState(
    drivers.map((driver) => {
      driver.isRegistered = true;
      return driver;
    })
  );
  const [initialRegisteredDrivers, setInitialRegisteredDrivers] = useState([
    ...drivers,
  ]);
  const [registeredDrivers, setRegisteredDrivers] = useState([...drivers]);
  const [newDrivers, setNewDrivers] = useState([]);
  //eslint-disable-next-line
  const [areDriversValid, setAreDriversValid] = useState(true);
  const [canSaveDrivers, setCanSaveDrivers] = useState(false);
  const fields = {
    official_id: {
      name: "Identificación",
      format: "string",
      regex: /^E?\d+$/,
      unique: true,
      errorMessages: {
        regex: "Por favor, ingresa un número válido.",
        unique: "Oops, este documento ya esta siendo usado por otra persona.",
      },
    },
    first_name: {
      name: "Nombre",
      regex: RegularExpressions.name,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un nombre válido.",
      },
    },
    last_name: {
      name: "Apellido",
      regex: RegularExpressions.name,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un apellido válido.",
      },
    },
    email: {
      name: "Email",
      regex: RegularExpressions.email,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un email válido.",
      },
    },
    cellphone: {
      name: "Teléfono",
      regex: /^\d{7,10}$/,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un teléfono válido..",
      },
    },
    isRegistered: {
      name: "",
      format: "boolean",
      hidden: true,
      default: false,
    },
  };

  useEffect(() => {
    if (newParticipantsContext.length > 0) {
      setDriversForReplacing(
        newParticipantsContext.map((driver) => {
          driver.isRegistered = true;
          return driver;
        })
      );
      setInitialRegisteredDrivers(newParticipantsContext);
      setRegisteredDrivers(newParticipantsContext);
      setNewDrivers([]);
      setAreDriversValid(true);
      setCanSaveDrivers(false);
    }
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers_company/`);
    //eslint-disable-next-line
  }, [newParticipantsContext]);

  useEffect(() => {
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers_company/`);
    // eslint-disable-next-line
  }, []);

  const fetchDrivers = async (url) => {
    const items = [];
    const response = await getAllDrivers(url);
    if (response) {
      if (response.next) {
        response.results.map((item) => {
          items.push(item);
          return true;
        });
        return await fetchDrivers(response.next);
      }
      response.results.map((item) => {
        items.push(item);
        return true;
      });
    }
    setAllParticipantsInfoContext(items);
  };

  const handleHide = () => {
    setAllParticipantsInfoContext([]);
    setNewParticipantsContext([]);
  };

  const handleClose = () => {
    setAllParticipantsInfoContext([]);
    setNewParticipantsContext([]);
    props.onHide();
  };

  const hideNotEnoughCreditsModal = () => {
    setShowNotEnoughCreditsModal(false);
  };

  const handleAllDrivers = (x) => {
    setAllDrivers(x);
  };

  const handleNewDriversValidation = (x) => {
    setAreDriversValid(x);
  };

  const saveDrivers = () => {
    if (userInfoContext.credit >= additionalCredits) {
      setShowConfirmationModal(true);
    } else {
      setShowNotEnoughCreditsModal(true);
    }
  };

  const isParticipantAlreadyRegistered = (participant) => {
    if (participant.isRegistered === true) {
      return true;
    }
  };

  useEffect(() => {
    let registeredIDs = registeredDrivers.map((driver) => {
      return driver.official_id;
    });
    let unregistered = allDrivers.filter((driver) => {
      let index = registeredIDs.findIndex((id) => {
        return id === driver.official_id;
      });
      return index < 0 ? true : false;
    });
    let registered = allDrivers.filter((driver) => {
      let index = registeredIDs.findIndex((id) => {
        return id === driver.official_id;
      });
      return index >= 0 ? true : false;
    });
    setRegisteredDrivers(registered);
    setRegisteredParticipantsContext(registered);
    setNewDrivers(unregistered);
    setParticipantsToRegisterContext(allDrivers);
    setAdditionalCredits(unregistered.length * service.ride_value);
    //eslint-disable-next-line
  }, [allDrivers]);

  useEffect(() => {
    if (
      registeredDrivers.length !== initialRegisteredDrivers.length ||
      newDrivers.length > 0
    ) {
      if (registeredDrivers.length === 0) {
        setCanSaveDrivers(false);
      } else {
        setCanSaveDrivers(true);
      }
    } else {
      setCanSaveDrivers(false);
    }
    //eslint-disable-next-line
  }, [newDrivers, registeredDrivers]);

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const dateFormatter = (date) => {
    let d = new Date(date);
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

  const cancelEvent = async () => {
    setLoading(true);
    if (status.step === 1) {
      let payload = {
        id,
        company: customer.company.id,
        refund_credits: customer.company.credit + spent_credit,
      };
      const res = await cancelRequestId(payload);
      if (res.canceled.status === 200 && res.refund.status === 200) {
        setLoading(false);
        setSuccess(true);
        updateRequestsContext();
        setUserInfoContext({
          ...userInfoContext,
          company: {
            ...userInfoContext.company,
            credit: res.refund.data.credit,
          },
        });

        const payload = {
          id: res.canceled.data.id,
          emailType: "canceledRequest",
          subject: "Solicitud cancelada ❌",
          email: userInfoContext.email,
          name: userInfoContext.name,
          date: res.canceled.data.start_time,
          refund_credits: res.canceled.data.spent_credit,
          service: res.canceled.data.service.name,
          municipality: {
            city: res.canceled.data.municipality.name,
            department: res.canceled.data.municipality.department.name,
          },
        };
        await sendEmail(payload); // SEND SERVICE CANCELED EMAIL TO USER
      } else {
        alert("No se pudo cancelar");
      }
    } else {
      // Check cancelation rules and disccount credit
      alert("Te vamos a descontar rides");
    }
  };

  const handleCancelEvent = async () => {
    setShowCancellationModal(true);
  };

  const renderStatus = () => {
    switch (status.step) {
      case 0:
        return (
          <div className="text-center">
            <small>Evento cancelado</small>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <small>Servicio solicitado</small>
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
            <small>Confirmar servicio</small>
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

  const notEnoughCreditsModal = () => {
    return (
      <NotEnoughCreditsModal
        show={showNotEnoughCreditsModal}
        onHide={hideNotEnoughCreditsModal}
        creditCost={additionalCredits}
        className="child-modal"
      />
    );
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
      className="single-request-modal"
      onHide={handleHide}
    >
      <Modal.Header className="align-items-center">
        <div>
          <span className="invoice-number mr-50">Solicitud#</span>
          <span>{id}</span>
          <h4 className="mb-0">{service.name}</h4>
          <p className="mb-0 mt-1">
            {municipality.name.charAt(0).toUpperCase() +
              municipality.name.slice(1).toLowerCase()}
            {" - "}
            {municipality.department.name}
          </p>
          <small>${spent_credit} Rides</small>
        </div>
        <div>
          <p className="mb-0">
            {" "}
            <small className="text-muted">Fecha de solicitud: </small>
            <span>{dateFormatter(created_at)}</span>
          </p>
          {renderStatus()}
        </div>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={6}>
              <ul className="list-unstyled">
                <li>Fecha: {dateFormatter(start_time)}</li>
                <li>Hora: {formatAMPM(start)}</li>
                {operator && (
                  <li>
                    Encargado de actividad RidePro:{" "}
                    <small>
                      {operator.first_name} {operator.last_name}
                    </small>
                  </li>
                )}
                <li>
                  Lugar:{" "}
                  {track ? (
                    track.name
                  ) : (
                    <small>Pista Ridepro (Pendiente)</small>
                  )}
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <div className="comments">
                <p>Observaciones:</p>
                <small>{accept_msg}</small>
              </div>
            </Col>
          </Row>
          <hr />
          <Tabs
            defaultActiveKey="place"
            id="uncontrolled-tab-request"
            className="uncontrolled-tab-request"
          >
            <Tab
              eventKey="place"
              title={
                <span>
                  <MdLocationOn /> Lugar y Fecha
                </span>
              }
              disabled={new_request ? true : false}
            >
              <Row>
                <Col>
                  <Row>
                    <Col>
                      {optional_date1 && status.step < 3 ? (
                        <div className="d-flex align-items-center justify-content-between">
                          <Table bordered hover size="sm" className="ml-4 mr-4">
                            <thead className="bg-primary text-white">
                              <tr>
                                <th>Ciudad</th>
                                <th>Lugar</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {track
                                    ? track.municipality.name
                                    : optional_place1.municipality.name}
                                </td>
                                <td>
                                  {track ? track.name : optional_place1.name}
                                </td>
                                <td>
                                  {dateFormatter(new Date(optional_date1))}
                                </td>
                                <td>{formatAMPM(new Date(optional_date1))}</td>
                              </tr>
                            </tbody>
                          </Table>
                          <Form.Check
                            type="radio"
                            label="Opción 1"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios1"
                            style={{ width: "7rem" }}
                            onChange={() => setSelectedOption(1)}
                          />
                        </div>
                      ) : (
                        ""
                      )}

                      {optional_date2 && status.step < 3 ? (
                        <div className="d-flex align-items-center justify-content-between">
                          <Table bordered hover size="sm" className="ml-4 mr-4">
                            <thead className="bg-primary text-white">
                              <tr>
                                <th>Ciudad</th>
                                <th>Lugar</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {track
                                    ? track.municipality.name
                                    : optional_place2.municipality.name}
                                </td>
                                <td>
                                  {track ? track.name : optional_place2.name}
                                </td>
                                <td>
                                  {dateFormatter(new Date(optional_date2))}
                                </td>
                                <td>{formatAMPM(new Date(optional_date2))}</td>
                              </tr>
                            </tbody>
                          </Table>
                          <Form.Check
                            type="radio"
                            label="Opción 2"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios2"
                            style={{ width: "7rem" }}
                            onChange={() => setSelectedOption(2)}
                          />
                        </div>
                      ) : (
                        ""
                      )}

                      {track && status.step > 2 ? (
                        <div className="d-flex align-items-center justify-content-between">
                          <Table bordered hover size="sm" className="ml-4 mr-4">
                            <thead className="bg-primary text-white">
                              <tr>
                                <th>Ciudad</th>
                                <th>Lugar</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{track.municipality.name}</td>
                                <td>{track.name}</td>
                                <td>{dateFormatter(new Date(start_time))}</td>
                                <td>{formatAMPM(new Date(start_time))}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      {selectedOption !== 0 && (
                        <Button
                          variant="success"
                          onClick={() => {
                            swal({
                              title: "Confirmando programación",
                              text: `Tu solicitud se llevara acabo el ${
                                selectedOption === 1
                                  ? dateFormatter(optional_date1)
                                  : selectedOption === 2
                                  ? dateFormatter(optional_date2)
                                  : ""
                              } en ${
                                track
                                  ? track.name
                                  : selectedOption === 1
                                  ? optional_place1.name
                                  : selectedOption === 2
                                  ? optional_place2.name
                                  : ""
                              } - ${
                                track
                                  ? track.municipality.name
                                  : selectedOption === 1
                                  ? optional_place1.municipality.name
                                  : selectedOption === 2
                                  ? optional_place2.municipality.name
                                  : ""
                              } - ${
                                track
                                  ? track.municipality.department.name
                                  : selectedOption === 1
                                  ? optional_place1.municipality.department.name
                                  : selectedOption === 2
                                  ? optional_place2.municipality.department.name
                                  : ""
                              } a las ${
                                selectedOption === 1
                                  ? formatAMPM(new Date(optional_date1))
                                  : selectedOption === 2
                                  ? formatAMPM(new Date(optional_date2))
                                  : ""
                              }`,
                              icon: "info",
                              buttons: ["No, volver", "Si, confirmar servicio"],
                              dangerMode: true,
                            }).then(async (willUpdate) => {
                              if (willUpdate) {
                                let payload1 = {
                                  track:
                                    track !== null
                                      ? track.id
                                      : optional_place1
                                      ? optional_place1.id
                                      : "",
                                  start_date: optional_date1,
                                  status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`,
                                };
                                let payload2 = {
                                  track:
                                    track !== null
                                      ? track.id
                                      : optional_place2
                                      ? optional_place2.id
                                      : "",
                                  start_date: optional_date2,
                                  status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`,
                                };
                                // console.log("payload", payload);
                                console.log(payload1, payload2);
                                let res = await updateRequest(
                                  selectedOption === 1 ? payload1 : payload2,
                                  id
                                );
                                console.log(res);
                                if (res.status === 200) {
                                  handleClose();
                                  updateRequestsContext();
                                  swal("Solicitud actualizada!", {
                                    icon: "success",
                                  });
                                } else {
                                  swal(
                                    "Oops, no se pudo actualizar el servicio.",
                                    {
                                      icon: "error",
                                    }
                                  );
                                }
                              }
                            });
                          }}
                        >
                          Aceptar programación
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>

            <Tab
              eventKey="participants"
              title={
                <span>
                  <MdPeople /> Participantes
                </span>
              }
            >
              {status.step === 1 ? (
                <EditableTable
                  size="sm"
                  dataSet={allDrivers}
                  fields={fields}
                  onValidate={handleNewDriversValidation}
                  onUpdate={handleAllDrivers}
                  readOnly={true}
                  readOnlyIf={isParticipantAlreadyRegistered}
                  recordsForReplacing={driversForReplacing}
                />
              ) : (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver, idx) => {
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
              )}
            </Tab>

            <Tab eventKey="options" title={<TiCogOutline />}>
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row className="mt-2">
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="first">
                          <TiCogOutline /> General
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">
                          <MdHelpOutline /> Ayuda
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <Row>
                          <Col md={12}>
                            <p>
                              Tus solicitudes podran ser canceladas sin costo
                              siempre y cuando la misma no haya sido confirmada.
                              <br />
                              <br />
                              Si tu solicitud ha sido procesada por el equipo de
                              RidePro, el costo de la cancelación estara basado
                              en las horas restantes para el dia del evento.
                            </p>
                            {status.step !== 0 && (
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={status.step !== 1 ? true : false}
                                onClick={handleCancelEvent}
                              >
                                Cancelar solicitud
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <Row className="mt-2">
                          <Col md={12}>
                            <div class="row">
                              <div class="col-12 text-center">
                                <p class="p-2 text-muted">
                                  Si tienes unca solicitud, o no encuentras la
                                  respuesta a tus dudas, ponte en contacto con
                                  nosotos!
                                </p>
                              </div>
                            </div>
                            <div class="row d-flex justify-content-center">
                              <div class="col-sm-12 col-md-4 text-center border rounded p-2 mr-md-2 m-1 help-icon">
                                <span className="text-muted ">
                                  <MdLocalPhone />
                                </span>
                                <h5>+ (810) 2548 2568</h5>
                                <p class="text-muted font-medium-1">
                                  {" "}
                                  Disponibles 24*7. Estaremos felices de ayudar
                                </p>
                              </div>
                              <div class="col-sm-12 col-md-4 text-center border rounded p-2 m-1  help-icon">
                                <span className="text-muted">
                                  <FaEnvelope />
                                </span>
                                <h5>
                                  <a href="contacto@ridepro.co">
                                    contacto@ridepro.co
                                  </a>
                                </h5>
                                <p class="text-muted font-medium-1">
                                  La manera mas rapida de respuesta.
                                </p>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Tab>
          </Tabs>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {status.step === 1 && (
          <Button
            variant="dark"
            onClick={saveDrivers}
            {...(!canSaveDrivers ? { disabled: "true" } : {})}
          >
            Guardar
          </Button>
        )}

        <Button onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
      {showCancellationModal && (
        <Modal
          show={true}
          centered
          size="sm"
          className="child-modal"
          onHide={loading ? "" : () => setShowCancellationModal(false)}
        >
          {loading ? (
            <React.Fragment>
              <Modal.Header>
                <Modal.Title>Cancelando...</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </Modal.Body>
            </React.Fragment>
          ) : success ? (
            <React.Fragment>
              <Modal.Header>
                <Modal.Title>¡Listo!</Modal.Title>
              </Modal.Header>
              <Modal.Body>La solicitud fue cancelada exitosamente</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                  Volver
                </Button>
              </Modal.Footer>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Modal.Header closeButton>
                <Modal.Title>Atención!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                ¿Estas seguro que deseas cancelar esta solicitud?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowCancellationModal(false)}
                >
                  No, volver
                </Button>
                <Button variant="primary" onClick={cancelEvent}>
                  Si, cancelar
                </Button>
              </Modal.Footer>
            </React.Fragment>
          )}
        </Modal>
      )}
      {showConfirmationModal && (
        <ServiceEditConfirmationModal
          show={true}
          setShow={(e) => setShowConfirmationModal(e)}
          request={props.selectedRow}
        />
      )}
      {showNotEnoughCreditsModal && notEnoughCreditsModal()}
    </Modal>
  );
};

export default SingleRequestModal;
