import React from "react";
import RegistrarNuevoUsuario from "./RegistrarNuevoUsuario/RegistrarNuevoUsuario";
import { Container, Row, Col } from "react-bootstrap";
import "./Usuarios.scss";

const Usuarios = () => {
  return (
    <Container>
      <Row>
        <Col>
          <RegistrarNuevoUsuario />
        </Col>
      </Row>
    </Container>
  );
};

export default Usuarios;
