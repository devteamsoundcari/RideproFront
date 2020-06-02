import React, { useEffect, useState } from "react";
import RegistrarNuevoUsuario from "./RegistrarNuevoUsuario/RegistrarNuevoUsuario";
import { Row, Col } from "react-bootstrap";
import "./Usuarios.scss";
import AllUsers from "./AllUsers/AllUsers";
import { getUsers } from "../../controllers/apiRequests";

const Usuarios = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async (url) => {
    let tempUsers = [];
    const response = await getUsers(url);
    console.log("fuck", response);
    response.results.forEach(async (item) => {
      tempUsers.push(item);
    });
    setUsers(tempUsers);
    if (response.next) {
      return await getUsers(response.next);
    }
  };
  useEffect(() => {
    fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
  }, []);

  return (
    <Row>
      <Col>
        <RegistrarNuevoUsuario />
        <AllUsers users={users} />
      </Col>
    </Row>
  );
};

export default Usuarios;
