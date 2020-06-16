import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestsContext } from "../../../contexts/RequestsContext";

import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import { createRequest, createDriver } from "../../../controllers/apiRequests";

const ConfirmServiceModal = (props) => {
  const history = useHistory();
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const { updateRequestsContex } = useContext(RequestsContext);

  const {
    participantsToRegisterContext,
    setParticipantsToRegisterContext,
    registeredParticipantsContext,
    setRegisteredParticipantsContext,
    unregisteredParticipantsContext,
    setUnregisteredParticipantsContext,
    allParticipantsInfoContext,
  } = useContext(ParticipantsContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessPropmt, setShowSuccessPrompt] = useState(false);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [
    alreadyRegisteredParticipants,
    setAlreadyRegisteredParticipants,
  ] = useState([]);
  const [unregisteredParticipants, setUnregisteredParticipants] = useState([]);
  const [displayData, setDisplayData] = useState(false);
  const [newRegistered, setNewRegistered] = useState(
    registeredParticipantsContext
  );
  const [finalParticipants, setFinalParticipants] = useState([]);
  const [newToRegister, setNewToRegister] = useState(
    participantsToRegisterContext
  );
  const [rides, setRides] = useState(props.rides);
  const [comment, setComment] = useState("");

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const isParticipantRegistered = (participant) => {
    const registeredIDs = allParticipantsInfoContext.map((p) => {
      return p.official_id;
    });

    for (let id of registeredIDs) {
      if (id === participant.official_id) {
        return true;
      }
    }
    return false;
  };

  const canBeRegistered = (arrToRegister) => {
    let badItems = [];
    for (let item of allParticipantsInfoContext) {
      for (let item2 of arrToRegister) {
        if (item.official_id === item2.official_id) {
          badItems.push(item2);
          // TODO: here a bug... we nedd to figure it out
          if (
            newRegistered.findIndex(
              (i) => i.official_id === item.official_id
            ) === -1
          ) {
            setNewRegistered((oldArr) => [...oldArr, item]);
            let nTR = newToRegister.filter(
              (x) => x.official_id !== item.official_id
            );
            setNewToRegister(nTR);
          }
        }
      }
    }
    return badItems;
  };

  // =============================== CHECK IF ALREADY REGISTERED PARTICIPANTS ========================================

  useEffect(() => {
    if (participantsToRegisterContext.length > 0) {
      for (const participant of participantsToRegisterContext) {
        if (isParticipantRegistered(participant)) {
          if (!participant.isRegistered) {
            setAlreadyRegisteredParticipants((current) => [
              ...current,
              participant,
            ]);
          }
          setRegisteredParticipants((current) => [
            ...current,
            allParticipantsInfoContext.find(
              (p) => p.official_id === participant.official_id
            ),
          ]);
        } else {
          setUnregisteredParticipants((current) => [...current, participant]);
        }
      }
    }
    // eslint-disable-next-line
  }, [participantsToRegisterContext]);

  useEffect(() => {
    if (alreadyRegisteredParticipants.length <= 0) {
      setDisplayData(true);
    } else {
      setDisplayData(false);
    }
  }, [alreadyRegisteredParticipants]);
  // =============================== REGISTER UNRESTIGERED DRIVERS ===================================

  const postParticipantToRegister = async (participant) => {
    const { registered } = participant;
    if (!registered) {
      let res = await createDriver(participant);
      if (res.status === 201) {
        return res.data.id;
      } else {
        return null;
      }
    }
    return participant.id;
  };

  const registerDrivers = async () => {
    return Promise.all(
      unregisteredParticipantsContext.map((participant) =>
        postParticipantToRegister(participant)
      )
    );
  };

  useEffect(() => {
    setUnregisteredParticipantsContext(unregisteredParticipants);
    setRegisteredParticipantsContext(registeredParticipants);
  }, [unregisteredParticipants, registeredParticipants]);

  // ======================================= HANDLE SUBMIT =================================
  const handleCreateService = async () => {
    setShowSpinner(true);
    setDisplayData(false);
    // SETUP ALL CONTEXTS...
    // REGITER PARTICIPANTS
    registerDrivers().then(async (registeredIDs) => {
      // THEN CREATE THE DATA TO THE SERVICE
      let driversIDs = [];
      registeredParticipantsContext.forEach((item) => driversIDs.push(item.id));
      registeredIDs.forEach((item) => driversIDs.push(item));

      const data = {
        service: props.service.id,
        customer: userInfoContext.id,
        municipality: props.place.city.id,
        place: "na",
        track: props.place.track.id,
        start_time: props.date.date,
        finish_time: props.date.date,
        company: userInfoContext.company,
        spent_credit: rides,
        drivers: driversIDs,
        accept_msg: comment,
      };
      // THEN CREATE THE SERVICE
      let res = await createRequest(data);
      // THEN CHECKOUT THE ANSWER
      if (res.create.status === 201 && res.decrease.status === 200) {
        setShowSpinner(false);
        setShowSuccessPrompt(true);
        updateRequestsContex();
        // Ubdate company context
        setUserInfoContext({
          ...userInfoContext,
          company: {
            ...userInfoContext.company,
            credit: res.decrease.data.credit,
          },
        });

        // EMAIL TYPE AND SUBJECT
        //     res.emailType = "newRequest";
        //     res.subject = "Solicitud Exitosa ✔️";
        //     res.email = res.create.data.customer.email;
        //     await sendEmail(res); // SEND WELCOME EMAIL TO USER
        //   }
      }
    });
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
            Ver servicios
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

  const handleContinue = () => {
    setAlreadyRegisteredParticipants([]);
    setNewToRegister(participantsToRegisterContext);
    setDisplayData(true);
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    if (props.service.service_type === "Persona") {
      setRides(props.service.ride_value * newToRegister.length);
    } else {
      setRides(props.service.ride_value);
    }
    //eslint-disable-next-line
  }, [newToRegister]);

  const handleCancel = () => {
    props.setShow(false);
  };

  const requestResume = () => {
    return (
      <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar servicio</Modal.Title>
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
            <strong>Ciudad: </strong>
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
            <strong>Lugar: </strong>
            {props.place.track.name
              ? `Mi pista (${props.place.track.name})`
              : "Pista ridepro"}
          </p>
          <p>
            <strong>Rides utilizados: </strong>
            {rides}
          </p>

          <strong>
            Participantes ({newToRegister.length}
            ):{" "}
          </strong>
          <ul>
            {newToRegister.map((participant, idx) => {
              return (
                <li key={idx}>
                  {participant.first_name} {participant.last_name} (
                  {participant.email})
                </li>
              );
            })}
          </ul>
          <strong>Comentarios adicionales:</strong>
          <Form.Control
            as="textarea"
            rows="4"
            value={comment}
            onChange={handleComment}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateService}>
            Solicitar servicio
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  };

  const displayErrorParticipants = () => {
    return (
      <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Los siguientes participantes ya han sido registrados:</h5>
          <ul>
            {alreadyRegisteredParticipants.map((participant, idx) => {
              return (
                <li key={idx}>
                  {participant.official_id} {participant.first_name}{" "}
                  {participant.last_name} ({participant.email})
                </li>
              );
            })}
          </ul>
          <p>
            Haz click en "Continuar" si deseas agendar el servicio con la
            información original que tenemos de estos participantes ó click en
            "Cancelar" para modificar los datos.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleContinue}>
            Continuar
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  };

  return (
    <Modal
      show={props.show}
      onHide={showSuccessPropmt ? handleOK : () => props.setShow(false)}
    >
      {showSpinner && loader()}
      {alreadyRegisteredParticipants.length > 0 && displayErrorParticipants()}
      {displayData && requestResume()}
      {showSuccessPropmt && successPropmt()}
    </Modal>
  );
};

export default ConfirmServiceModal;
