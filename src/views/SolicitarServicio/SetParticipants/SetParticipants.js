import React, { useState, useContext, useEffect } from "react";
import { Form, Container, Table, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./SetParticipants.scss";
import { AuthContext } from "../../../contexts/AuthContext";
import { ServiceContext } from "../../../contexts/ServiceContext";
import { getAllDrivers } from "../../../controllers/apiRequests";
import UploadExcelFile from "../UploadExcelFile/UploadExcelFile";

function isParticipantRegistered(x, y) {
  for (var index in x) {
    if (x[index].official_id === y.official_id) {
      return {
        res: true,
        obj: x[index],
      };
    }
  }
  return {
    res: false,
    obj: null,
  };
}

const SetParticipants = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const { serviceInfoContext } = useContext(ServiceContext);
  const { handleSubmit, register, errors } = useForm();
  const [participants, setParticipants] = useState([]);
  const [participantsDB, setParticipantsDB] = useState([]);
  const [rides, setRides] = useState(0);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState({
    show: false,
    idx: null,
  });

  // ==================================== ADD PARTICIPANTS TO LIST ===========================================

  const handleAddItem = (data) => {
    let rideVal = parseInt(serviceInfoContext.ride_value);
    // let temp = 100;
    if (rideVal + rides <= userInfoContext.company.credit) {
      // if (true) {
      let userIsRegistered = isParticipantRegistered(participantsDB, data); // Check if driver is already in db
      if (userIsRegistered.res) {
        data = userIsRegistered.obj;
        data.registered = true;
        alert(
          `ADVERTENCIA: Identificación: ${userIsRegistered.obj.official_id} Nombre: ${userIsRegistered.obj.first_name} ${userIsRegistered.obj.last_name} ya ha sido parte de otros servicios`
        );
      } else {
        data.registered = false;
      }
      // Check if the users is already on the list... if so skip with alert
      let alreadyAdded = participants.filter(
        (person) => person.official_id === data.official_id
      );
      if (alreadyAdded.length === 0) {
        setParticipants((prevParticipants) => [...prevParticipants, data]);
        setRides((prevRides) => prevRides + rideVal);
      } else {
        alert("No se puede añadir el mismo participante dos veces.");
      }
    } else {
      alert("Créditos insuificientes");
    }
  };

  // ============================= REMOVE PARTICIPANT FROM LIST ============================================

  const removeUserFromList = (idx) => {
    let rideVal = parseInt(serviceInfoContext.ride_value);
    if (rideVal > 0) {
      const temp = [...participants];
      temp.splice(idx, 1);
      setParticipants(() => temp);
      setRides((prevRides) => prevRides - rideVal);
      setShowRemoveUserModal({ show: false, idx: null });
    }
  };

  const handleRemoveItem = (idx) => {
    setShowRemoveUserModal({ show: true, idx });
  };

  // ================================== GETTING ALL DRIVER FROM DB =================================================

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
      setParticipantsDB(items);
    }
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers/`);
  }, []);

  // ============================================  HANDLE SUMBIT  ================================================

  const handleFinalizar = () => {
    props.setParticipants(participants, rides);
  };

  // =============================================================================================================
  // const handleFile = (data, info) => {
  //   let keys = ["official_id", "first_name", "last_name", "email", "cellphone"];
  //   data
  //     .map((x) => x.map((y, i) => ({ [keys[i]]: y })))
  //     .map((z) => (z = { ...z[0], ...z[1], ...z[2], ...z[3], ...z[4] }))
  //     .map((y) =>
  //       setParticipants((prevParticipants) => [...prevParticipants, y])
  //     );
  // };
  // =============================================================================================================

  return (
    <Container className="setParticipants">
      <Button
        variant="primary"
        size="bg"
        onClick={handleFinalizar}
        className="finalizarBtn"
        disabled={rides ? false : true}
      >
        Finalizar
      </Button>
      <UploadExcelFile addItem={handleAddItem} />
      <Form onSubmit={handleSubmit(handleAddItem)}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Identificacion</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>
                Rides: {rides}/{userInfoContext.company.credit}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control
                  type="number"
                  placeholder="No. Identificación"
                  name="official_id"
                  ref={register({
                    required: true,
                    patter: /^[0-9]*$/i,
                  })}
                />
                {errors.official_id && <small>Identificacion inválida</small>}
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  name="first_name"
                  ref={register({
                    required: true,
                    pattern: /^[A-Za-z]+$/i,
                  })}
                />
                {errors.first_name && <small>Nombre inválido</small>}
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Apellido"
                  name="last_name"
                  ref={register({
                    required: true,
                    pattern: /^[A-Za-z]+$/i,
                  })}
                />
                {errors.last_name && <small>Apellido inválido</small>}
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="email"
                  ref={register({
                    required: true,
                    pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i,
                  })}
                />
                {errors.email && <small>Email inválido</small>}
              </td>
              <td>
                <Form.Control
                  type="number"
                  placeholder="Teléfono"
                  name="cellphone"
                  ref={register({
                    required: true,
                    pattern: /^\d{10}$/i,
                  })}
                />
                {errors.cellphone && (
                  <small>El número de teléfono debe contener 10 dígitos</small>
                )}
              </td>
              <td>
                <Button variant="success" type="submit">
                  <span>
                    <FaPlus />
                  </span>{" "}
                  Agregar
                </Button>
              </td>
            </tr>
            {participants.map((participant, index) => {
              return (
                <tr key={index}>
                  <td>{participant.official_id}</td>
                  <td>{participant.first_name}</td>
                  <td>{participant.last_name}</td>
                  <td>{participant.email}</td>
                  <td>{participant.cellphone}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <span>
                        <FaMinus />
                      </span>{" "}
                      Quitar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Form>
      <Modal
        size="sm"
        show={showRemoveUserModal.show}
        onHide={() => setShowRemoveUserModal({ show: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`¿Estás ` +
            `${
              {
                M: "seguro",
                F: "segura",
                O: "segur@",
              }[userInfoContext.gender]
            } de que quieres remover este usuario?`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRemoveUserModal({ show: false })}
          >
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => removeUserFromList(showRemoveUserModal.idx)}
          >
            {`Si, estoy ` +
              `${
                {
                  M: "seguro",
                  F: "segura",
                  O: "segur@",
                }[userInfoContext.gender]
              }`}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SetParticipants;
