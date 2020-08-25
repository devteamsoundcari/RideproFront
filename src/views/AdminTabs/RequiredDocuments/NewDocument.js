import React, { useState } from "react";
import { Form, Button, Col, Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { createDocument } from "../../../controllers/apiRequests";
import swal from "sweetalert";

const NewDocument = ({ handleClose, onUpdate }) => {
  const { register, handleSubmit, errors } = useForm();
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true); // HIDE SPINNER
    const response = await createDocument(data, filename); // SAVE A NEW USER IN DB
    // IF SUCCESS
    if (response) {
      setLoading(false); // HIDE SPINNER
      onUpdate();
      swal("Perfecto!", `${data.name} fue registrado existosamente`, "success");
      handleClose();
    } else {
      setLoading(false); // HIDE SPINNER
      console.error(response);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} size="lg">
      <Modal.Body>
        <Modal.Title>Registrar nuevo documento</Modal.Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridDocument">
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

            <Form.Group as={Col} controlId="formGridtemplate">
              <Form.Label>Plantilla</Form.Label>
              <Form.File
                id="custom-file"
                type="file"
                label={filename ? filename.name : ""}
                custom
                name="template"
                ref={register}
                onChange={(e) => setFilename(e.target.files[0])}
              />
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="docDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="description" ref={register} />
          </Form.Group>
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
};
export default NewDocument;
