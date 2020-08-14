import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Spinner, Table } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestsContext } from "../../../contexts/RequestsContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import {
  createRequest,
  createDriver,
  sendEmail,
} from "../../../controllers/apiRequests";
import "./ServiceConfirmationModal.scss";
import { formatAMPM, dateFormatter } from "../../../utils/helpFunctions";

const ConfirmServiceModal = (props) => {
  const history = useHistory();
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const { updateRequests } = useContext(RequestsContext);

  const {
    participantsToRegisterContext,
    // setParticipantsToRegisterContext,
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
  const [newToRegister, setNewToRegister] = useState(
    participantsToRegisterContext
  );
  const [rides, setRides] = useState(props.rides);
  const [comment, setComment] = useState("");

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
    //eslint-disable-next-line
  }, [unregisteredParticipants, registeredParticipants]);

  // ======================================= HANDLE SUBMIT =================================
  const handleCreateService = async () => {
    setShowSpinner(true);
    setDisplayData(false);
    // SETUP ALL CONTEXTS...
    // REGITER PARTICIPANTS
    registerDrivers().then(async (registeredIDs) => {
      // THEN CREATE THE DATA TO THE SERVICE
      //================================================================================

      let driversIDs = [];
      registeredParticipantsContext.forEach((item) => driversIDs.push(item.id));
      registeredIDs.forEach((item) => driversIDs.push(item));

      const data = {
        service: props.service.id,
        customer: userInfoContext,
        municipality: props.place.city.id,
        place: "na",
        track: props.place.track.id,
        start_time: props.date.date,
        finish_time: props.date.date,
        company: userInfoContext.company,
        spent_credit: rides,
        drivers: driversIDs,
        accept_msg: comment !== "" ? comment : "na",
        new_request: 1,
        fare_track: 0.0,
      };
      // THEN CREATE THE SERVICE
      let res = await createRequest(data);
      // THEN CHECKOUT THE ANSWER
      if (
        res.response.status === 201 &&
        res.creditDecreasingResponse.status === 200
      ) {
        setShowSpinner(false);
        setShowSuccessPrompt(true);
        updateRequests();
        setUserInfoContext({
          ...userInfoContext,
          credit: res.creditDecreasingResponse.data.credit,
        });

        let emailParticipants = unregisteredParticipantsContext.concat(
          registeredParticipantsContext
        );

        const payload = {
          id: res.response.data.id,
          emailType: "newRequest",
          subject: "Solicitud exitosa ⌛",
          email: userInfoContext.email,
          name: userInfoContext.name,
          date: data.start_time,
          spent_credits: data.spent_credit,
          participantes: emailParticipants,
          service: props.service.name,
          municipality: {
            city: props.place.city.name,
            department: props.place.department.name,
          },
        };
        await sendEmail(payload); // SEND SERVICE REQUESTED EMAIL TO USER
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
        <Modal.Body className="texxt-center">
          <h3>
            ¡Solicitud creada! <FaCheckCircle />
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
          <ul>
            <li>
              <strong>Servicio: </strong>
              {props.service.name}
            </li>
            <li>
              <strong>Fecha: </strong>
              {props.date && props.date.date
                ? dateFormatter(props.date.date)
                : "None"}
            </li>
            <li>
              <strong>Hora: </strong>
              {props.date && props.date.date
                ? formatAMPM(props.date.date)
                : "None"}
            </li>
            <li>
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
            </li>
            <li>
              <strong>Lugar: </strong>
              {props.place.track.name
                ? `Mi pista (${props.place.track.name})`
                : "Pista ridepro"}
            </li>
            <li>
              <strong>Rides utilizados: </strong>
              {rides}
            </li>
          </ul>
          <hr />
          <strong>
            Participantes ({newToRegister.length}
            ):{" "}
          </strong>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {newToRegister.map((participant, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      {participant.first_name} {participant.last_name}
                    </td>
                    <td>{participant.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <hr />

          <strong>Comentarios adicionales:</strong>
          <Form.Control
            as="textarea"
            rows="2"
            value={comment}
            onChange={handleComment}
          />
          <hr />
          <div className="w-100 text-center">
            <p>
              <AiOutlineWarning /> Importante <br />
              <small>
                Recuerda que puedes cancelar sin penalidad hasta 5 horas antes
                del evento. Luego de este plazo se te cargara una penalidad
                dependiendo el servicio.
              </small>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button size="sm" variant="primary" onClick={handleCreateService}>
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
      className="modal-confirm-service"
    >
      {showSpinner && loader()}
      {alreadyRegisteredParticipants.length > 0 && displayErrorParticipants()}
      {displayData && requestResume()}
      {showSuccessPropmt && successPropmt()}
    </Modal>
  );
};

export default ConfirmServiceModal;
