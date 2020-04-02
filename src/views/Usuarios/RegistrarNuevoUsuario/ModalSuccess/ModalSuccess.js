import React from "react";
import { Modal } from "react-bootstrap";

const ModalSuccess = props => {
  return (
    <Modal size="sm" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Usuario Registrado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Felicitaciones!</h6>
        <p>
          El usuario <strong>{props.data.email}</strong> ha sido registrado.{" "}
          <strong>{props.data.name}</strong> recibira un email con la inforacion
          de ingreso
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSuccess;
