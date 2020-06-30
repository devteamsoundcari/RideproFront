import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";

const NotEnoughCreditsModal = (props: any) => {
  const { userInfoContext } = useContext(AuthContext);

  return (
    <Modal
      centered
      show={props.show}
      className={props.className}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <h2>No tienes suficientes créditos</h2>
      </Modal.Header>
      <Modal.Body>
        <h5>
          Modificar los participantes para esta solicitud tendría un costo
          adicional de ${props.creditCost}. Actualmente tienes un balance de $
          {userInfoContext.credit}.
        </h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotEnoughCreditsModal;
