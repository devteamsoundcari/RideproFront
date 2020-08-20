import React, { useEffect, useState } from "react";
import RegistrarNuevoUsuario from "./RegistrarNuevoUsuario/RegistrarNuevoUsuario";
import { Row, Col, Button } from "react-bootstrap";
import "./Usuarios.scss";
import AllUsers from "./AllUsers/AllUsers";
import { getUsers } from "../../../controllers/apiRequests";

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async (url) => {
    const response = await getUsers(url);
    setUsers((oldArr) => [...oldArr, ...response.results]);
    if (response.next) {
      return await fetchUsers(response.next);
    }
  };
  useEffect(() => {
    fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
    // eslint-disable-next-line
  }, []);

  return (
    <Row>
      <Col>
        <Button
          variant="primary"
          type="submit"
          onClick={() => setShowModal(true)}
        >
          Registrar usuario
        </Button>
        {showModal && (
          <RegistrarNuevoUsuario
            handleClose={() => setShowModal(false)}
            onUpdate={() => {
              setUsers([]);
              fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
            }}
          />
        )}
        <AllUsers users={users} />
      </Col>
    </Row>
  );
};

export default Usuarios;
