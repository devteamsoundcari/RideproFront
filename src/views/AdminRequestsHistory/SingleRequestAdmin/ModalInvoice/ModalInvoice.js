import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Form, Button, Col, Spinner } from "react-bootstrap";
import { AuthContext } from "../../../../contexts/AuthContext";
import {
  sendInvoice,
  updateRequest,
} from "../../../../controllers/apiRequests";
import swal from "sweetalert";

const ModalInvoice = ({ handleClose, requestInfo, onUpdate }) => {
  const { userInfoContext } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    data.file = file;
    data.seller = userInfoContext.id;
    data.buyer = requestInfo.customer.company.id;
    data.request = requestInfo.id;
    data.payment_method = "na";
    let response = await sendInvoice(data);
    let responseRequest = await updateRequest(
      { status: process.env.REACT_APP_STATUS_STEP_6 },
      requestInfo.id
    );
    console.log("response reuqest", responseRequest);
    if (response.status === 201 && responseRequest.status === 200) {
      swal("Perfecto", "El servicio fue actualizado correctamente", "success");
      setLoading(false);
      handleClose();
      onUpdate();
    } else {
      swal("Oops", "No pudimos actualizar el servicio", "error");
    }
  };

  return (
    <Modal show={true} size="sm" onHide={handleClose} className="modal-oc">
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Adjuntar factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="formDescription">
              <Form.Label>Facturado a:</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="description"
                ref={register({ required: true })}
              />
              {errors.description && (
                <small className="text-danger">Este campo es obligatorio</small>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formValue">
              <Form.Label>Factura No.</Form.Label>
              <Form.Control
                type="number"
                ref={register({ required: true })}
                name="bill_id"
              />
              {errors.bill_id && (
                <small className="text-danger">Este campo es obligatorio</small>
              )}
            </Form.Group>

            <Form.Group as={Col} controlId="formValue">
              <Form.Label>Valor:</Form.Label>
              <Form.Control
                type="number"
                placeholder="$"
                name="value"
                ref={register({ required: true })}
              />
              {errors.value && (
                <small className="text-danger">Este campo es obligatorio</small>
              )}
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formNotes">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows="2" name="notes" ref={register} />
          </Form.Group>

          <Form.Group controlId="formFile">
            <Form.Label>Adjuntar archivo</Form.Label>
            <Form.File
              id="custom-file"
              label={file ? file.name : ""}
              custom
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Guardar
            {loading && <Spinner animation="border" size="sm" />}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalInvoice;
