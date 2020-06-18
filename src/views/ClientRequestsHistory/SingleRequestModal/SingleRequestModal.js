import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Button,
  ProgressBar,
  Table,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import { EditableTable } from "../../../utils/EditableTable";
import RegularExpressions from "../../../utils/RegularExpressions";
import {
  cancelRequestId,
  getAllDrivers,
} from "../../../controllers/apiRequests";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestsContext } from "../../../contexts/RequestsContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import ServiceEditConfirmationModal from "./ServiceEditConfirmationModal";
import "./SingleRequestModal.scss";


const SingleRequestModal = (props) => {
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    requestsInfoContext,
    setRequestsInfoContext,
    canceledRequestContext,
    setCanceledRequestContext,
  } = useContext(RequestsContext);

  const {
    allParticipantsInfoContext,
    setAllParticipantsInfoContext,
    setRegisteredParticipantsContext,
    setParticipantsToRegisterContext
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
  } = props.selectedRow;

  const [allRegisteredDrivers, setAllRegisteredDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState(drivers.map((driver) => {
      driver.isRegistered = true;
      return driver;
    }));
  const initialRegisteredDrivers = [...drivers];
  const [registeredDrivers, setRegisteredDrivers] = useState([...drivers]);
  const [newDrivers, setNewDrivers] = useState([]);
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
    const items = [];
    async function fetchDrivers(url) {
      const response = await getAllDrivers(url);
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
      setAllRegisteredDrivers(items);
      setAllParticipantsInfoContext(items);
    }
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers_company/`);
    // eslint-disable-next-line
  }, []);

  const handleAllDrivers = (x) => {
    setAllDrivers(x);
  };

  const handleNewDriversValidation = (x) => {
    setAreDriversValid(x);
  };

  const saveDrivers = () => {
    setShowConfirmationModal(true);
  }

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

  const dateFormatter = () => {
    let d = new Date(start_time);
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
    } else {
      // Check cancelation rules and disccount credit
      alert("Te vamos a descontar rides");
    }
  };

  const handleCancelEvent = async () => {
    setShowCancellationModal(true);
  };

  const loadingSpinner = () => {
    return (
      <Modal.Body>
        <Spinner animation="border" variant="danger" />
      </Modal.Body>
    );
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

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header className="align-items-center">
        <div>
          <h4 className="mb-0">{service.name}</h4>
          <p className="mb-0 mt-1">
            {municipality.name.charAt(0).toUpperCase() +
              municipality.name.slice(1).toLowerCase()}
            {" - "}
            {municipality.department.name}
          </p>
        </div>
        <p className="mb-0">{dateFormatter()}</p>
        <div>{renderStatus()}</div>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={6}>
              <ul className="list-unstyled">
                <li>
                  Lugar:{" "}
                  {track ? (
                    track.name
                  ) : (
                    <small>Pista Ridepro (Pendiente)</small>
                  )}
                </li>
                <li>Hora: {formatAMPM(start)}</li>
                <li>Rides gastados: {spent_credit}</li>
              </ul>
            </Col>
            <Col md={6}>
              <p>Observaciones:</p>
            </Col>
          </Row>
          <hr />
          <Row>
            {status.step !== 1 && (
              <React.Fragment>
                <h6>Instructores</h6>
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th>Identificación</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver, idx) => (
                      <tr key={idx}>
                        <td>{driver.official_id}</td>
                        <td>{driver.first_name}</td>
                        <td>{driver.last_name}</td>
                        <td>{driver.email}</td>
                        <td>{driver.cellphone}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </React.Fragment>
            )}
            <h6>Participantes</h6>
            <EditableTable
              size="sm"
              dataSet={allDrivers}
              fields={fields}
              onValidate={handleNewDriversValidation}
              onUpdate={handleAllDrivers}
              readOnly={true}
            />
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {
          <Button
            variant="dark"
            onClick={saveDrivers}
            {...(!canSaveDrivers ? { disabled: "true" } : {})}
          >
            Guardar
          </Button>
        }
        {status.step !== 0 && (
          <Button variant="danger" onClick={handleCancelEvent}>
            Cancelar solicitud
          </Button>
        )}
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
      {showCancellationModal && (
        <Modal
          show={true}
          centered
          size="sm"
          className="childModal"
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
    </Modal>
  );
};

export default SingleRequestModal;
