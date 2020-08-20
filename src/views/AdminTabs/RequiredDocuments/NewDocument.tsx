import React from "react";
import { Modal, Form, Button, Col } from "react-bootstrap";

type NewDocumentProps = any;

const NewDocument: React.FC<NewDocumentProps> = ({ handleClose }) => {
  return (
    <Modal show={true} onHide={handleClose} size="lg">
      <Modal.Body>
        <Modal.Title>Registrar nuevo documento</Modal.Title>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridDocument">
              <Form.Label>Nombre</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridtemplate">
              <Form.Label>Plantilla</Form.Label>
              <Form.File id="custom-file" label="Vacio" custom />
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="docDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows="2" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewDocument;
