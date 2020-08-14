import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import useDropdown from "../../../utils/useDropdown";

type NewCreditProps = any;

const NewCredit: React.FC<NewCreditProps> = ({ handleClose, users }) => {
  const [userNames, setUserNames] = useState([]);
  const [selectedDepartment, DepartmentsDropdown] = useDropdown(
    "Cliente",
    "Seleccione...",
    userNames
  );

  useEffect(() => {
    let onlyClients = users.filter((user) => user.profile === 2);
    let newArr = onlyClients.map((user: any) => {
      return {
        name: `${user.email} - ${user.first_name} ${user.last_name}`,
      };
    });
    console.log("reaa", newArr);
    setUserNames(newArr);
  }, [users]);

  return (
    <Modal show={true} onHide={handleClose} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Asignar créditos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DepartmentsDropdown />
        <Form.Row>
          <Form.Group as={Col} controlId="formGridRides">
            <Form.Label>Rides</Form.Label>
            <Form.Control type="number" />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group
            as={Col}
            controlId="formGridPaymentMethod"
            className="text-center"
          >
            <Form.Label>Forma de pago</Form.Label>
            <div key={`inline-radio`} className="mt-2">
              <Form.Check
                inline
                type="radio"
                label="COP"
                name="formHorizontalRadios"
              />
              <Form.Check
                type="radio"
                inline
                label="Horas ARL"
                name="formHorizontalRadios"
              />
              <Form.Check
                inline
                type="radio"
                label="Cupos ARL"
                name="formHorizontalRadios"
              />
            </div>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridRides">
            <Form.Label>Valor</Form.Label>
            <Form.Control type="number" />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Label>Adjuntar OC</Form.Label>
          <Form.File id="custom-file" label="Custom file input" custom />
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewCredit;
