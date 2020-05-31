import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";

const RemoveModalConfirmation = () => {
  const { userInfoContext } = useContext(AuthContext);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState({
    show: false,
    idx: null,
  });

  return (
    <Modal
      size="sm"
      show={showRemoveUserModal.show}
      onHide={() => setShowRemoveUserModal({ show: false })}
    >
      <Modal.Header closeButton>
        <Modal.Title>Advertencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`¿Estás ` +
          `${
            {
              M: "seguro",
              F: "segura",
              O: "segur@",
            }[userInfoContext.gender]
          } de que quieres remover este usuario?`}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowRemoveUserModal({ show: false })}
        >
          No
        </Button>
        <Button
          variant="danger"
          onClick={() => console.log(showRemoveUserModal.idx)}
        >
          {`Si, estoy ` +
            `${
              {
                M: "seguro",
                F: "segura",
                O: "segur@",
              }[userInfoContext.gender]
            }`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveModalConfirmation;
