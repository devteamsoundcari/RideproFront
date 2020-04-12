import React, { useState, useContext } from "react";
import { Form, Container, Col, Table, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./SetParticipants.scss";
import { AuthContext } from "../../../contexts/AuthContext";

const SetParticipants = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const { handleSubmit, register } = useForm();
  const [participants, setParticipants] = useState([]);
  const [rides, setRides] = useState(0);

  const handleAddItem = (data) => {
    setParticipants([...participants, data]);
    // props.setPlace(data);
  };

  const handleRemoveItem = (idx) => {
    // assigning the list to temp variable
    const temp = [...participants];
    // // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    setParticipants(temp);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(handleAddItem)} className="setParticipants">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>
                Rides: {0}/{userInfoContext.company.credit}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control
                  required
                  type="text"
                  placeholder="Nombre"
                  name="name"
                  ref={register({
                    required: true,
                  })}
                />
              </td>
              <td>
                <Form.Control
                  required
                  type="text"
                  placeholder="Apellido"
                  name="lastName"
                  ref={register({
                    required: true,
                  })}
                />
              </td>
              <td>
                <Form.Control
                  required
                  type="text"
                  placeholder="Email"
                  name="email"
                  ref={register({
                    required: true,
                  })}
                />
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
                  <td>{participant.name}</td>
                  <td>{participant.lastName}</td>
                  <td>{participant.email}</td>
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
      {/* <Table striped bordered hover size="sm">
        <tbody>
          {participants.map((participant) => {
            return (
              <tr key={participant.email}>
                <td>{participant.name}</td>
                <td>{participant.lastName}</td>
                <td>{participant.email}</td>
                <td>
                  <Button variant="success">
                    <span>
                      <FaPlus />
                    </span>{" "}
                    Agregar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table> */}
    </Container>
  );
};

export default SetParticipants;
