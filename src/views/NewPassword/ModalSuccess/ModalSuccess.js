import React from "react";
import { Modal } from "react-bootstrap";

const ModalSuccess = props => {
  return (
    <Modal size="sm" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Perfecto!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tu contraseña ha sido restablecida</p>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSuccess;
