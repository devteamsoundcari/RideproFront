import React from "react";
import RegistrarNuevoUsuario from "./RegistrarNuevoUsuario/RegistrarNuevoUsuario";
import { Row, Col } from "react-bootstrap";
import "./Usuarios.scss";
import AllUsers from "./AllUsers/AllUsers";

const Usuarios = () => {
  return (
    <Row>
      <Col>
        <RegistrarNuevoUsuario />
        <AllUsers />
      </Col>
    </Row>
  );
};

export default Usuarios;
