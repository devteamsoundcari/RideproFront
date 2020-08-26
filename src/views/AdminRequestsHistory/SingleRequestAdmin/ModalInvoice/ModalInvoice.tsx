import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { AuthContext } from "../../../../contexts/AuthContext";

type ModalInvoiceProps = any;

const ModalInvoice: React.FC<ModalInvoiceProps> = ({ handleClose }) => {
  const { userInfoContext } = useContext(AuthContext);
  return (
    <Modal show={true} size="lg" onHide={handleClose} className="modal-oc">
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Adjuntar factura</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
    </Modal>
  );
};

export default ModalInvoice;
