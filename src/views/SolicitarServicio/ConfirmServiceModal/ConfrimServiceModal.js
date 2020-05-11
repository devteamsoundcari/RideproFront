import React, { useState, useContext } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  createRequest,
  createDriver,
  sendEmail,
} from "../../../controllers/apiRequests";

const ConfirmServiceModal = (props) => {
  const history = useHistory();
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessPropmt, setSuccessPrompt] = useState(false);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // =============================== REGISTER UNRESTIGERED DRIVERS ===================================

  const anAsyncFunction = async (participant) => {
    const participantsIDs = [];
    const { registered } = participant;
    if (!registered) {
      let res = await createDriver(participant);
      if (res.status === 201) {
        participantsIDs.push(res.data.id);
      } else {
        console.log(res.request.response);
      }
    } else {
      participantsIDs.push(participant.id);
    }
    return participantsIDs;
  };

  const registerDrivers = async () => {
    return Promise.all(
      props.participants.map((participant) => anAsyncFunction(participant))
    );
  };

  const handleCreateService = async () => {
    setShowSpinner(true);
    registerDrivers().then(async (driversIDs) => {
      // =============================== CREATTING REQUEST ===============================
      const data = {
        service: props.service.id,
        customer: userInfoContext.id,
        municipality: props.place.city.id,
        place: props.place.place,
        start_time: props.date.date,
        finish_time: props.date.date,
        company: userInfoContext.company,
        used_credits: props.rides,
        drivers: driversIDs,
      };
      console.log("PARA POSTMAN", data);
      let res = await createRequest(data);
      if (res.create.status === 201 && res.decrease.status === 200) {
        setShowSpinner(false);
        setSuccessPrompt(true);
        // Ubdate company context
        setUserInfoContext({
          ...userInfoContext,
          company: {
            ...userInfoContext.company,
            credit: res.decrease.data.credit,
          },
        });

        // EMAIL TYPE AND SUBJECT
        res.emailType = "newRequest";
        res.subject = "Solicitud Exitosa ✔️";
        res.email = res.create.data.customer.email;
        await sendEmail(res); // SEND WELCOME EMAIL TO USER
      }
    });
  };

  const displayData = () => {
    return (
      <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Servicio: </strong>
            {props.service.name}
          </p>
          <p>
            <strong>Fecha: </strong>
            {props.date && props.date.date
              ? props.date.date.toLocaleDateString("es-ES", options)
              : "None"}
          </p>
          <p>
            <strong>Hora: </strong>
            {props.date && props.date.date
              ? props.date.date.toLocaleTimeString()
              : "None"}
          </p>
          <p>
            <strong>Lugar: </strong>
            {props.place.place && `"${props.place.place}" - `}
            {props.place.city && props.place.city.name
              ? props.place.city.name
              : "None"}{" "}
            (
            {props.place.department && props.place.department.name
              ? props.place.department.name
              : "None"}
            )
          </p>
          <p>
            <strong>Rides utilizados: </strong>
            {props.rides}
          </p>

          <strong>Participantes ({props.participants.length}): </strong>
          <ul>
            {props.participants.map((participant, idx) => {
              return (
                <li key={idx}>
                  {participant.first_name} {participant.last_name} (
                  {participant.email})
                </li>
              );
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShow(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateService}>
            Solicitar Servicio
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  };

  const handleOK = () => {
    props.setShow(false);
    history.push({
      pathname: "/cliente/historial",
    });
  };

  const successPropmt = () => {
    return (
      <React.Fragment>
        <Modal.Body>
          <h3>
            Solicitud Creada! <FaCheckCircle />
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOK}>
            Ver Servicios
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  };

  const loader = () => {
    return (
      <Modal.Body>
        <Spinner animation="border" variant="danger" />
      </Modal.Body>
    );
  };

  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
      {showSpinner && loader()}
      {showSuccessPropmt && successPropmt()}
      {showSpinner || showSuccessPropmt ? "" : displayData()}
      {/* {displayData()} */}
    </Modal>
  );
};

export default ConfirmServiceModal;
