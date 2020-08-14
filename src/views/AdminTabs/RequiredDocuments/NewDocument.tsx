import React from "react";
import { Card, Form, Button, Col } from "react-bootstrap";

type NewDocumentProps = any;

const NewDocument: React.FC<NewDocumentProps> = () => {
  return (
    <Card className="usuarios">
      <Card.Body>
        <Card.Title>Registrar nuevo documento</Card.Title>
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

          <Button variant="primary" type="submit">
            Registrar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default NewDocument;
