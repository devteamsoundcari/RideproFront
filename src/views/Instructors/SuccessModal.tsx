import React from "react";
import { Modal } from "react-bootstrap";

const SuccessModal = props => {
  return (
    <Modal size="sm" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Instructor registrado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Felicitaciones!</h6>
        <p>
          El instructor <strong>{props.data.email}</strong> ha sido registrado.{" "}
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
