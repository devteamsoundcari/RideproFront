import React from "react";
import { Card, Form, Button, Col } from "react-bootstrap";

type NewCompanyProps = any;

const NewCompany: React.FC<NewCompanyProps> = () => {
  return (
    <Card className="usuarios">
      <Card.Body>
        <Card.Title>Registrar nueva empresa</Card.Title>
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

          <Button variant="primary" type="submit">
            Registrar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default NewCompany;
