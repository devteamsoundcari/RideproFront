import React, { useContext, useState } from "react";
import {
  Modal,
  Button,
  ProgressBar,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import { cancelRequestId } from "../../../controllers/apiRequests";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestsContext } from "../../../contexts/RequestsContext";
import "./SingleRequestModalAdmin.scss";
import { FaStopwatch } from "react-icons/fa";
import InfoTabs from "./InfoTabs/InfoTabs";

const SingleRequestModal = (props) => {
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updateRequestsContex } = useContext(RequestsContext);
  const {
    service,
    municipality,
    created_at,
    id,
    customer,
    status,
    track,
    start,
    spent_credit,
    start_time,
    accept_msg,
  } = props.selectedRow;

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
        updateRequestsContex();
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
    setShowCancelModal(true);
  };

  const waitingTimeFormatter = () => {
    let created = new Date(created_at);
    let now = new Date();
    var difference = Math.abs(now.getTime() - created.getTime());
    var hourDifference = difference / 1000 / 3600;
    return Math.floor(hourDifference);
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
      className="single-request-modal"
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
        <p className="mb-0">{dateFormatter(start_time)}</p>
        {waitingTimeFormatter() > 0 ? (
          <div className="mb-0 waiting-time">
            <FaStopwatch />
            <strong>{waitingTimeFormatter()}</strong>
            <small>horas</small>
          </div>
        ) : (
          <div className="mb-0 waiting-time">
            <FaStopwatch />
            <small>Menos de 1 hora</small>
          </div>
        )}

        <div>{renderStatus()}</div>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="service-details">
            <Col md={6}>
              <ul className="list-unstyled">
                <li>
                  <small>Codigo de servicio: </small>
                  {id}
                </li>
                <lo>
                  <small>Cliente: </small>
                  {customer.company.name}
                </lo>
                <li>
                  <small>Fecha de solicitud: </small>
                  {dateFormatter(created_at)}
                </li>
                <li>
                  <small>Rides gastados: </small>
                  {spent_credit}
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="list-unstyled">
                <li>
                  <small>Lugar: </small>
                  {track ? track.name : "Pista Ridepro (Pendiente)"}
                </li>
                <li>
                  <small>Hora: </small>
                  {formatAMPM(start)}
                </li>
              </ul>
              <div className="comments">
                <p>Observaciones:</p>
                <small>{accept_msg}</small>
              </div>
            </Col>
          </Row>
          <Row>
            <InfoTabs request={props.selectedRow} />
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {/* {status.step !== 0 && userInfoContext.profile === 2?  (
          <Button variant="danger" onClick={handleCancelEvent}>
            Cancelar solicitud
          </Button>
        ):""} */}
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
      {showCancelModal && (
        <Modal
          show={true}
          centered
          size="sm"
          className="cancelModal"
          onHide={loading ? "" : () => setShowCancelModal(false)}
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
                <Modal.Title>Listo!</Modal.Title>
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
                  onClick={() => setShowCancelModal(false)}
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
    </Modal>
  );
};

export default SingleRequestModal;