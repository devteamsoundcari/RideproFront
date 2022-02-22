import React from 'react';
import { Modal } from 'react-bootstrap';

export const ModalSuccess = (props) => {
  return (
    <Modal size="sm" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Tu relax</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Hemos enviado un correo a <strong>{props.data}</strong> con las
          indicaciones.
        </p>
      </Modal.Body>
    </Modal>
  );
};
