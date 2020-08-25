import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import useDropdown from "../../../utils/useDropdown";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { AuthContext } from "../../../contexts/AuthContext";
import { createSale } from "../../../controllers/apiRequests";

const NewCredit = ({ handleClose, users, onUpdate }) => {
  const [userNames, setUserNames] = useState([]);
  const { userInfoContext } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { register, handleSubmit, errors } = useForm();
  const [file, setFile] = useState(null);
  const [selectedUser, UsersDropdown] = useDropdown(
    "Cliente *",
    "Seleccione...",
    userNames
  );

  useEffect(() => {
    let onlyClients = users.filter((user) => user.profile === 2);
    let newArr = onlyClients.map((user) => {
      return {
        id: user.id,
        name: `${user.email} - ${user.first_name} ${user.last_name}`,
      };
    });
    newArr.sort((a, b) => a.name.localeCompare(b.name));
    setUserNames(newArr);
  }, [users]);

  const onSubmit = async (data) => {
    if (selectedUser === "Seleccione...") {
      swal("Error", `Por favor seleccione un cliente`, "error");
    } else {
      data.bill_id = parseInt(selectedUser + new Date().getUTCMilliseconds());
      data.buyer = parseInt(selectedUser);
      data.file = file;
      data.seller = userInfoContext.id;
      data.payment_method = paymentMethod;
      data.user = users.find((item) => item.id === parseInt(selectedUser));
      const response = await createSale(data); // SAVE A NEW USER IN DB
      if (
        response.sale.status === 201 &&
        response.creditsAssigned.status === 200
      ) {
        onUpdate();
        swal("Perfecto!", `Venta realizada existosamente`, "success");
        handleClose();
      } else {
        swal("Opps!", `Algo paso, no pudimos completar la venta`, "error");
        console.error("No se pudo agregar la venta.");
      }
    }
  };

  return (
    <Modal show={true} onHide={handleClose} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Asignar créditos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <UsersDropdown />
          <Form.Row>
            <Form.Group as={Col} controlId="formGridRides">
              <Form.Label>Cantidad de Rides *</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                ref={register({ required: true })}
              />
              {errors.credits && (
                <small className="text-danger">
                  Ingrese numero de creditos
                </small>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} className="text-center">
              <Form.Label>Forma de pago *</Form.Label>
              <div key={`inline-radio`} className="mt-2">
                <Form.Check
                  inline
                  type="radio"
                  label="COP"
                  name="COP"
                  checked={paymentMethod === "cash"}
                  onClick={() => setPaymentMethod("cash")}
                />
                <Form.Check
                  type="radio"
                  inline
                  label="Horas ARL"
                  name="hours"
                  checked={paymentMethod === "hours"}
                  onClick={() => setPaymentMethod("hours")}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Cupos ARL"
                  name="cupos"
                  checked={paymentMethod === "cupos"}
                  onClick={() => setPaymentMethod("cupos")}
                />
              </div>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridValue">
              <Form.Label>Valor *</Form.Label>
              <Form.Control
                type="number"
                name="value"
                ref={register({ required: true })}
              />
              {errors.value && (
                <small className="text-danger">Ingrese numero el valor</small>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridNotes">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows="1"
                name="notes"
                ref={register}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Label>Adjuntar OC</Form.Label>
            <Form.File
              id="custom-file"
              label={file ? file.name : ""}
              custom
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Row>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default NewCredit;
