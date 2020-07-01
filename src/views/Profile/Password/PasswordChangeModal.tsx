import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Col, Form, Spinner, Button } from "react-bootstrap";
import { changePassword } from "../../../controllers/apiRequests";
import RegularExpressions from "../../../utils/RegularExpressions";

const PasswordChangeModal = (props: any) => {
  const [stage, setStage] = useState("waiting");
  const [submittedData, setSubmittedData] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const form = useForm();
  const { handleSubmit, errors, control, watch } = form;

  const onSubmit = (data: any) => {
    setShowConfirmationModal(true);
    setStage("confirmation");
    setSubmittedData(data);
  };

  const exit = () => {
    props.onExit();
  };

  const save = async () => {
    setStage("loading");
    let data = Object.assign(submittedData!);

    let result = await changePassword(data);
    if (result) {
      setStage("success");
    } else {
      setStage("failure")
    }
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleAccept = () => {
    setShowConfirmationModal(false);
    setStage("waiting");
    props.onExit();
  };

  const confirmationModal = () => {
    return (
      <Modal
        centered
        size="sm"
        className="child-modal"
        show={showConfirmationModal}
        onHide={hideConfirmationModal}
      >
        {stage === "confirmation" && confirmationMessage()}
        {stage === "loading" && loadingSpinner()}
        {stage === "success" && successMessage()}
        {stage === "failure" && incorrectPasswordMessage()}
      </Modal>
    );
  };

  const confirmationMessage = () => {
    return (
      <>
        <Modal.Body>
          <h4>¿Estás seguro de querer cambiar tu contraseña?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={save}>
            Si
          </Button>
          <Button variant="danger" onClick={hideConfirmationModal}>
            No, regresar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const loadingSpinner = () => {
    return (
      <>
        <Modal.Body>
          <Spinner animation="border" role="status" size="sm">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        </Modal.Body>
      </>
    );
  };

  const successMessage = () => {
    return (
      <>
        <Modal.Body>
          <h4>Tus contraseña ha sido modificada exitosamente</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const incorrectPasswordMessage = () => {
    return (
      <>
        <Modal.Header>
          Error
        </Modal.Header>
        <Modal.Body>
          <h4>Tu contraseña actual introducida es incorrecta. Intenta nuevamente.</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={hideConfirmationModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  }

  return (
    <Modal centered show={props.show} onHide={props.onHide} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Antigua contraseña</Form.Label>
              <Controller
                as={<Form.Control type="password" />}
                name="oldPassword"
                control={control}
                rules={{
                  required: true,
                }}
              />
              {errors.oldPassword?.type === "required" && (
                <small>La contraseña no debe estar vacía.</small>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Nueva contraseña</Form.Label>
              <Controller
                as={<Form.Control type="password" />}
                name="newPassword"
                control={control}
                rules={{
                  required: true,
                  pattern: RegularExpressions.password,
                }}
              />
              {errors.newPassword?.type === "required" && (
                <small>La contraseña no debe estar vacía.</small>
              )}
              {errors.newPassword?.type === "pattern" && (
                <small>
                  La contraseña debe tener ocho caracteres como mínimo y debe
                  incluir un número y un caracter especial
                  (@$!%*?&).
                </small>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Controller
                as={<Form.Control type="password" />}
                name="newPasswordConfirmation"
                control={control}
                rules={{
                  required: true,
                  validate: (value) => {
                    return value === watch("newPassword");
                  }
                }}
              />
              {errors.newPasswordConfirmation?.type === "validate" && (
                <small>Las contraseñas deben coincidir.</small>
              )}
            </Form.Group>
          </Form.Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit">
            Guardar
          </Button>
          <Button variant="secondary" onClick={exit}>
            Salir
          </Button>
        </Modal.Footer>
      </Form>
      {showConfirmationModal && confirmationModal()}
    </Modal>
  );
}

export default PasswordChangeModal;
