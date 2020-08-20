import React from "react";
import { Form, Button, Col, Modal } from "react-bootstrap";

type NewCompanyProps = any;

const NewCompany: React.FC<NewCompanyProps> = ({ handleClose }) => {
  return (
    <Modal show={true} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar nueva empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridNit">
              <Form.Label>Nit</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridArl">
              <Form.Label>Arl</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLogo">
              <Form.Label>Logo</Form.Label>
              <Form.File id="custom-file" label="Vacio" custom />
            </Form.Group>
          </Form.Row>
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
export default NewCompany;
