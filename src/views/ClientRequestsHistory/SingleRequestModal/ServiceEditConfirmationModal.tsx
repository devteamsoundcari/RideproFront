import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
// import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import { RequestsContext } from "../../../contexts/RequestsContext";
import { editRequest, createDriver } from "../../../controllers/apiRequests";
import "./SingleRequestModal.scss";

const ServiceEditConfirmationModal = (props) => {
  // const history = useHistory();
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const { updateRequestsContext } = useContext(RequestsContext);

  const {
    participantsToRegisterContext,
    // setParticipantsToRegisterContext,
    registeredParticipantsContext,
    setRegisteredParticipantsContext,
    unregisteredParticipantsContext,
    setUnregisteredParticipantsContext,
    allParticipantsInfoContext,
    // setAllParticipantsInfoContext,
    // newParticipantsContext,
    setNewParticipantsContext,
  } = useContext(ParticipantsContext);

  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [registeredParticipants, setRegisteredParticipants] = useState<any[]>(
    []
  );
  const [
    alreadyRegisteredParticipants,
    setAlreadyRegisteredParticipants,
  ] = useState<any[]>([]);
  const [unregisteredParticipants, setUnregisteredParticipants] = useState<
    any[]
  >([]);
  const [displayData, setDisplayData] = useState(false);
  // const [newRegistered, setNewRegistered] = useState(
  //   registeredParticipantsContext
  // );
  const [finalParticipants, setFinalParticipants] = useState<any[]>([]);
  const [newToRegister, setNewToRegister] = useState(
    participantsToRegisterContext
  );
  const [rides, setRides] = useState(props.rides);
  // const [comment, setComment] = useState("");

  // const options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // };

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

  // =============================== CHECK IF ALREADY REGISTERED PARTICIPANTS ========================================

  useEffect(() => {
    let alreadyRegisteredParticipants: any[] = [];
    let registeredParticipants: any[] = [];
    let unregisteredParticipants: any[] = [];
    let finalParticipants: any[] = [];

    if (participantsToRegisterContext.length > 0) {
      for (let participant of participantsToRegisterContext) {
        if (isParticipantRegistered(participant)) {
          if (!participant.isRegistered) {
            alreadyRegisteredParticipants.push(participant);
          }
          let registeredParticipant = allParticipantsInfoContext.find(
            (p) => p.official_id === participant.official_id
          );
          registeredParticipants.push(registeredParticipant);
          finalParticipants.push(registeredParticipant);
        } else {
          unregisteredParticipants.push(participant);
          finalParticipants.push(participant);
        }
      }

      setAlreadyRegisteredParticipants(alreadyRegisteredParticipants);
      setRegisteredParticipants(registeredParticipants);
      setUnregisteredParticipants(unregisteredParticipants);
      setFinalParticipants(finalParticipants);
    }
    // eslint-disable-next-line
  }, [participantsToRegisterContext]);

  useEffect(() => {
    if (alreadyRegisteredParticipants.length <= 0 && !showSuccessPrompt) {
      setDisplayData(true);
    } else {
      setDisplayData(false);
    }
    //eslint-disable-next-line
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
    //eslint-disable-next-line
  }, [unregisteredParticipants, registeredParticipants]);

  // ======================================= HANDLE SUBMIT =================================
  const handleEditService = async () => {
    setShowSpinner(true);
    setDisplayData(false);
    // SETUP ALL CONTEXTS...
    // REGITER PARTICIPANTS
    registerDrivers().then(async (registeredIDs) => {
      // THEN CREATE THE DATA TO THE SERVICE
      let driversIDs: any[] = [];
      registeredParticipantsContext.forEach((item) => driversIDs.push(item.id));
      registeredIDs.forEach((item) => driversIDs.push(item));

      const request = { ...props.request };
      const data = {
        service: request.service.id,
        customer: userInfoContext.id,
        municipality: request.municipality.id,
        place: "na",
        track: request.track ? request.track.id : null,
        start_time: request.start_time,
        finish_time: request.finish_time,
        company: userInfoContext.company,
        prev_credits: request.spent_credit,
        spent_credit: rides,
        drivers: driversIDs,
        accept_msg: request.accept_msg,
        new_request: request.new_request,
        fare_track: 0.0,
      };
      // THEN CREATE THE SERVICE
      let res = await editRequest(request.id, data);
      // THEN CHECKOUT THE ANSWER
      if (
        res.response.status === 200 &&
        res.creditDecreasingResponse.status === 200
      ) {
        setShowSpinner(false);
        setShowSuccessPrompt(true);
        updateRequestsContext();
        setUserInfoContext({
          ...userInfoContext,
          credit: res.creditDecreasingResponse.data.credit
        });
        setNewParticipantsContext(finalParticipants);
      }
    });
  };

  const handleOK = () => {
    props.setShow(false);
  };

  const successPrompt = () => {
    return (
      <React.Fragment>
        <Modal.Body>
          <h3>
            ¡Solicitud modificada! <FaCheckCircle />
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

  useEffect(() => {
    if (props.request.service.service_type === "Persona") {
      setRides(props.request.service.ride_value * newToRegister.length);
    } else {
      setRides(props.request.service.ride_value);
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
          <Modal.Title>Confirmar modificación del servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Servicio: </strong>
            {props.request.service.name}
          </p>
          <p>
            <strong>Rides utilizados: </strong>
            {rides}
          </p>

          <strong>
            Participantes ({finalParticipants.length}
            ):{" "}
          </strong>
          <ul>
            {finalParticipants.map((participant, idx) => {
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
          <Button variant="primary" onClick={handleEditService}>
            Modificar servicio
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
      centered
      show={props.show}
      onHide={showSuccessPrompt ? handleOK : () => props.setShow(false)}
      className="child-modal"
    >
      {showSpinner && loader()}
      {alreadyRegisteredParticipants.length > 0 && displayErrorParticipants()}
      {displayData && requestResume()}
      {showSuccessPrompt && successPrompt()}
    </Modal>
  );
};

export default ServiceEditConfirmationModal;
