import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Form, Button, Col, Spinner } from 'react-bootstrap';
import { PERFIL_ADMIN, useProfile } from '../../../../utils';
import { AuthContext, SingleRequestContext } from '../../../../contexts';
import swal from 'sweetalert';

const ModalInvoice = ({ handleClose }) => {
  const { userInfo } = useContext(AuthContext);
  const { currentRequest, addRequestBill, updateRequestId } = useContext(SingleRequestContext);
  const [profile] = useProfile();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      file: file,
      seller: userInfo.id,
      buyer: currentRequest.customer.company.id,
      request: currentRequest.id,
      payment_method: 'na'
    };
    let response = await addRequestBill(payload);
    let responseRequest = await updateRequestId(currentRequest.id, {
      new_request: 0, // It wont be a new request anymore
      operator: userInfo.id,
      status: PERFIL_ADMIN.steps.STATUS_SERVICIO_FINALIZADO.id
    });
    if (response.status === 201 && responseRequest.status === 200) {
      swal('Perfecto', 'El servicio fue actualizado correctamente', 'success');
      setLoading(false);
      handleClose();
    } else {
      swal('Oops', 'No pudimos actualizar el servicio', 'error');
      setLoading(false);
    }
  };

  return (
    <Modal show={true} size="sm" onHide={handleClose} className="modal-oc">
      <Modal.Header className={`bg-${profile}`} closeButton>
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
              <Form.Control type="number" ref={register({ required: true })} name="bill_id" />
              {errors.bill_id && <small className="text-danger">Este campo es obligatorio</small>}
            </Form.Group>

            <Form.Group as={Col} controlId="formValue">
              <Form.Label>Valor:</Form.Label>
              <Form.Control
                type="number"
                placeholder="$"
                name="value"
                ref={register({ required: true })}
              />
              {errors.value && <small className="text-danger">Este campo es obligatorio</small>}
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formNotes">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows={2} name="notes" ref={register} />
          </Form.Group>

          <Form.Group controlId="formFile">
            <Form.Label>Adjuntar archivo</Form.Label>
            <Form.File
              required
              id="custom-file"
              label={file?.name || ''}
              custom
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
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
