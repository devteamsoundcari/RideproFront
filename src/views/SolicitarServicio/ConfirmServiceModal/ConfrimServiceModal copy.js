import React, { useState, useContext } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthContext";
import { createRequest, createDriver } from "../../../controllers/apiRequests";

const ConfirmServiceModal = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessPropmt, setSuccessPrompt] = useState(false);
  const [participantsIDs, setParticipantsIDs] = useState([]);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const regiterUsers = async () => {
    // ============================== ADDING DRIVERS TO DB (PARTICIPANTS)======================

    props.participants
      .map(async (participant) => {
        const { registered } = participant;
        // IF THE DRIVER IS NOT REGISTERED YET THEN REGISTER
        if (!registered) {
          let res = await createDriver(participant);
          if (res.status === 201) {
            console.log("RES", res);
            setParticipantsIDs([...setParticipantsIDs, res.id]);
          } else {
            console.log(res.request.response);
          }
        } else {
          setParticipantsIDs([...participantsIDs, participant.id]);
        }
      })
      .then(() => {
        console.log("q pasa", participantsIDs);
      });
  };

  const handleCreateService = async () => {
    setShowSpinner(true);
    await regiterUsers().then(console.log("after awati", participantsIDs));

    // =============================== CREATTING REQUEST ===============================
    // const data = {
    //   service: props.service.id,
    //   customer: userInfoContext.id,
    //   municipality: props.place.city.id,
    //   place: props.place.place,
    //   start_time: props.date.date,
    //   finish_time: props.date.date,
    //   company: userInfoContext.company,
    //   used_credits: props.rides,
    // };
    // let res = await createRequest(data);
    // console.log("q pasa", res);
    // if (res.status === 201) {
    //   setShowSpinner(false);
    //   setSuccessPrompt(true);
    // }
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
            {props.participants.map((participant) => {
              return (
                <li>
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

  const successPropmt = () => {
    return (
      <React.Fragment>
        <Modal.Body>
          <h3>
            Servicio Creado! <FaCheckCircle />
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShow(false)}>
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
