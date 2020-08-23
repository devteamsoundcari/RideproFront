import React, { useState, useEffect } from "react";
import { Form, Button, Col, Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
function AttachCompanyToUser({ handleClose, onUpdate }) {
  const { register, handleSubmit, errors } = useForm();
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true); // HIDE SPINNER
    // const response = await createCompany(data, filename); // SAVE A NEW USER IN DB
    // IF SUCCESS
    // if (response) {
    //   setLoading(false); // HIDE SPINNER
    //   onUpdate();
    //   swal("Perfecto!", `${data.name} fue registrada existosamente`, "success");
    //   handleClose();
    // } else {
    //   setLoading(false); // HIDE SPINNER
    //   console.error(response);
    // }
  };

  return (
    <Modal show={true} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar nueva empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                ref={register({ required: true })}
              />
              {errors.name && (
                <small className="text-danger">El nombre es obligatorio</small>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="formGridNit">
              <Form.Label>Nit</Form.Label>
              <Form.Control type="number" name="nit" ref={register} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="address" ref={register} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="number" name="phone" ref={register} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridArl">
              <Form.Label>Arl</Form.Label>
              <Form.Control type="text" name="arl" ref={register} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLogo">
              <Form.Label>Logo</Form.Label>
              <Form.File
                id="custom-file"
                type="file"
                label={filename ? filename.name : ""}
                custom
                name="logo"
                ref={register}
                onChange={(e) => setFilename(e.target.files[0])}
              />
            </Form.Group>
          </Form.Row>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

            <Button variant="primary" type="submit">
              {loading ? (
                <Spinner animation="border" role="status" size="sm">
                  <span className="sr-only">Cargando...</span>
                </Spinner>
              ) : (
                "Registrar"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AttachCompanyToUser;
