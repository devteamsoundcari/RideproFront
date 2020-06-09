import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import {
  createRequest,
  createDriver,
  // sendEmail,
} from "../../../controllers/apiRequests";

const ConfirmServiceModal = (props) => {
  const history = useHistory();
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const {
    participantsToRegisterContext,
    setParticipantsToRegisterContext,
    registeredParticipantsContext,
    allParticipantsInfoContext,
    setRegisteredParticipantsContext,
  } = useContext(ParticipantsContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessPropmt, setShowSuccessPrompt] = useState(false);
  const [badParticipants, setBadParticipants] = useState([]);
  const [originalParticipants, setOriginalParticipants] = useState([]);
  const [displayData, setDisplayData] = useState(false);
  const [newRegistered, setNewRegistered] = useState(
    registeredParticipantsContext
  );
  const [newToRegister, setNewToRegister] = useState(
    participantsToRegisterContext
  );
  const [rides, setRides] = useState(props.rides);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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
      let result = canBeRegistered(participantsToRegisterContext);
      if (result.length > 0) {
        setBadParticipants(result);
      } else {
        setDisplayData(true);
      }
    } else {
      setDisplayData(true);
    }
    // eslint-disable-next-line
  }, [
    participantsToRegisterContext,
    registeredParticipantsContext,
    allParticipantsInfoContext,
  ]);

  // =============================== REGISTER UNRESTIGERED DRIVERS ===================================

  const postParticipantToRegister = async (participant) => {
    const { registered } = participant;
    if (!registered) {
      let res = await createDriver(participant);
      if (res.status === 201) {
        console.log("REGISTRADO ", res.data);
        return res.data.id;
      } else {
        console.log(res.request.response);
        return null;
      }
    }
    return participant.id;
  };

  const registerDrivers = async () => {
    return Promise.all(
      participantsToRegisterContext.map((participant) =>
        postParticipantToRegister(participant)
      )
    );
  };

  // ======================================= HANDLE SUBMIT =================================
  const handleCreateService = async () => {
    setShowSpinner(true);
    setDisplayData(false);
    // SETUP ALL CONTEXTS...
    setParticipantsToRegisterContext(newToRegister);
    setRegisteredParticipantsContext(newRegistered);
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
      };
      // THEN CREATE THE SERVICE
      let res = await createRequest(data);
      // THEN CHECKOUT THE ANSWER
      if (res.create.status === 201 && res.decrease.status === 200) {
        setShowSpinner(false);
        setShowSuccessPrompt(true);
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
    for (let item of participantsToRegisterContext) {
      for (let item2 of badParticipants) {
        if (item.official_id !== item2.official_id)
          setNewToRegister((oldArr) => [...oldArr, item]);
      }
    }
    setBadParticipants([]);
    setDisplayData(true);
  };

  useEffect(() => {
    if (props.service.service_type === "Persona") {
      console.log(newToRegister.length, newRegistered.length);
      let r =
        props.service.ride_value * newToRegister.length +
        props.service.ride_value * newRegistered.length;
      setRides(r);
    } else {
      setRides(props.service.ride_value);
    }
    //eslint-disable-next-line
  }, [newToRegister, newRegistered]);

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
            Participantes ({newRegistered.length + newToRegister.length}
            ):{" "}
          </strong>
          <ul>
            {newRegistered.map((participant, idx) => {
              return (
                <li key={idx}>
                  {participant.first_name} {participant.last_name} (
                  {participant.email})
                </li>
              );
            })}
            {newToRegister.map((participant, idx) => {
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
          <Modal.Title>Adveretencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Los siguientes participantes ya han sido registrados:</h5>
          <ul>
            {badParticipants.map((participant, idx) => {
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
    <Modal show={props.show} onHide={showSuccessPropmt ? handleOK : () => props.setShow(false)}>
      {showSpinner && loader()}
      {badParticipants.length > 0 && displayErrorParticipants()}
      {displayData && requestResume()}
      {showSuccessPropmt && successPropmt()}
      {/* {showSpinner || showSuccessPropmt ? "" : displayData()} */}
      {/* {displayData()} */}
    </Modal>
  );
};

export default ConfirmServiceModal;
