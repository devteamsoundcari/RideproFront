import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Col, Form, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { editUser } from "../../controllers/apiRequests";
import RegularExpressions from "../../utils/RegularExpressions";
import "./ProfileEditModal.scss"

const CompanyEditModal = (props: any) => {
  const [stage, setStage] = useState("waiting");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submittedData, setSubmittedData] = useState();
  const { userInfoContext, updateUserInfo } = useContext(AuthContext);
  const defaultValues = {
    name: userInfoContext.name,
    lastName: userInfoContext.lastName,
    email: userInfoContext.email,
    charge: userInfoContext.charge,
    gender: userInfoContext.gender,
  };
  const form = useForm({ defaultValues: defaultValues });
  const { handleSubmit, errors, control, watch } = form;
  const formValues = watch();
  const [canSave, setCanSave] = useState(false);

  const onSubmit = (data: any) => {
    setShowConfirmationModal(true);
    setStage("confirmation");
    setSubmittedData(data);
  };

  const exit = () => {
    props.onHide();
  };

  const save = async () => {
    setStage("loading");
    let data = Object.assign(submittedData!);

    data.company_id = userInfoContext.company.id;
    data.first_name = data.name;
    data.last_name = data.lastName;
    let result = await editUser(data);
    if (result) {
      await updateUserInfo();
      setStage("success");
    }
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleAccept = () => {
    setShowConfirmationModal(false);
    setStage("waiting");
  };

  useEffect(() => {
    const defaultValuesKeys = Object.keys(defaultValues).sort();
    const currentFormValuesKeys = Object.keys(formValues).sort();

    if (defaultValuesKeys.length !== currentFormValuesKeys.length) {
      setCanSave(true);
      return;
    }

    for (let key of defaultValuesKeys) {
      if (defaultValues[key] !== formValues[key]) {
        setCanSave(true);
        return;
      }
    }

    setCanSave(false);
  }, [defaultValues, form, formValues]);

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
      </Modal>
    );
  };

  const confirmationMessage = () => {
    return (
      <>
        <Modal.Body>
          <h4>¿Estás seguro de cambiar tus datos?</h4>
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
          <h4>Tus datos han sido modificados exitosamente</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  return (
    <Modal centered show={props.show} onHide={props.onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Nombre</Form.Label>
              <Controller
                as={<Form.Control type="text" />}
                name="name"
                control={control}
                rules={{
                  required: true,
                  pattern: RegularExpressions.name,
                }}
              />
              {errors.name?.type === "required" && (
                <p>El nombre no debe estar vacío.</p>
              )}
              {errors.name?.type === "pattern" && (
                <p>Este nombre es inválido.</p>
              )}
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Apellido</Form.Label>
              <Controller
                as={<Form.Control type="text" />}
                name="lastName"
                control={control}
                rules={{
                  required: "El apellido no debe estar en blanco.",
                  pattern: RegularExpressions.name,
                }}
              />
              {errors.lastName?.type === "required" && (
                <p>El apellido no debe estar vacío.</p>
              )}
              {errors.lastName?.type === "pattern" && (
                <p>Este apellido es inválido.</p>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Correo electrónico</Form.Label>
              <Controller
                as={<Form.Control type="email" />}
                name="email"
                control={control}
                rules={{
                  required: "El correo electrónico no debe estar en blanco.",
                  pattern: RegularExpressions.email,
                }}
              />
              {errors.email?.type === "required" && (
                <p>El correo electrónico no debe estar vacío.</p>
              )}
              {errors.email?.type === "pattern" && (
                <p>Este correo electrónico es inválido.</p>
              )}
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Cargo</Form.Label>
              <Controller
                as={<Form.Control type="text" />}
                name="charge"
                control={control}
                rules={{
                  required: "El cargo no debe estar en blanco.",
                }}
              />
              {errors.charge?.type === "required" && (
                <p>El cargo no debe estar vacío.</p>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Género</Form.Label>
              <Controller
                as={
                  <Form.Control as="select">
                    <option>M</option>
                    <option>F</option>
                    <option>O</option>
                  </Form.Control>
                }
                name="gender"
                control={control}
                defaultValue={userInfoContext.gender}
              />
            </Form.Group>
          </Form.Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="sucess" type="submit" disabled={!canSave}>
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
};

export default CompanyEditModal;
