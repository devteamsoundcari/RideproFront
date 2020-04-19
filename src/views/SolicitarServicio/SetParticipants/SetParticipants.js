import React, { useState, useContext, useEffect } from "react";
import { Form, Container, Table, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./SetParticipants.scss";
import { AuthContext } from "../../../contexts/AuthContext";
import { ServiceContext } from "../../../contexts/ServiceContext";
import { getAllDrivers } from "../../../controllers/apiRequests";

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
    let temp = rides + parseInt(serviceInfoContext.ride_value);
    // let temp = 100;
    if (temp <= userInfoContext.company.credit) {
      // if (true) {
      // for (var index in participantsDB) {
      //   // data.register = false;
      //   if (participantsDB[index].official_id === data.id) {
      //     // ==== HERE IS BEACUSE USER ALREADY EXISTS
      //     data.name = participantsDB[index].first_name;
      //     data.lastName = participantsDB[index].last_name;
      //     data.email = participantsDB[index].email;
      //     data.id = participantsDB[index].id;
      //     data.phone = participantsDB[index].cellphone;
      //     data.registered = true;
      //     break; // return false;
      //   } else {
      //     // USER DOESNT EXISTS
      //     data.registered = false;
      //   }
      // }
      let userIsRegistered = isParticipantRegistered(participantsDB, data);
      if (userIsRegistered.res) {
        data = userIsRegistered.obj;
        data.registered = true;
        alert(
          `ADVERTENCIA: Identificacion: ${userIsRegistered.obj.official_id} Nombre: ${userIsRegistered.obj.first_name} ${userIsRegistered.obj.last_name} ya ha sido parte de otros servicios`
        );
      } else {
        data.registered = false;
      }
      setParticipants([...participants, data]);
      setRides(temp);
    } else {
      alert("Se quedo sin creditos");
    }
  };

  // ============================= REMOVE PARTICIPANT FROM LIST ============================================

  const removeUserFromList = (idx) => {
    console.log("si", idx);
    let tempRides = rides - parseInt(serviceInfoContext.ride_value);
    if (tempRides <= userInfoContext.company.credit) {
      const temp = [...participants];
      temp.splice(idx, 1);
      setParticipants(temp);
      setRides(tempRides);
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
                  placeholder="No. Identifiacion"
                  name="official_id"
                  ref={register({
                    required: true,
                    patter: /^[0-9]*$/i,
                  })}
                />
                {errors.official_id && <small>Identificacion Invalida</small>}
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
                {errors.first_name && <small>Nombre Invalido</small>}
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
                {errors.last_name && <small>Apellido Invalido</small>}
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
                {errors.email && <small>Email Invalido</small>}
              </td>
              <td>
                <Form.Control
                  type="number"
                  placeholder="Telefono"
                  name="cellphone"
                  ref={register({
                    required: true,
                    pattern: /^\d{10}$/i,
                  })}
                />
                {errors.cellphone && <small>10 Digitos</small>}
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
        <Modal.Body>Estas segur@ de que quieres remover el usuario?</Modal.Body>
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
            Si, estoy segur@
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SetParticipants;
