import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Col, Form, Spinner, Button, Image } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { editUser } from "../../controllers/apiRequests";
import RegularExpressions from "../../utils/RegularExpressions";
import ProfilePictureEditModal from "./ProfilePictureEditModal";
import "./ProfileEditModal.scss";

const ProfileEditModal = (props: any) => {
  const [stage, setStage] = useState("waiting");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUserProfileEditModal, setShowUserProfileEditModal] = useState(false);
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
    data.email = userInfoContext.email;
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
          <Button className={`btn-${userInfoContext.perfil}`} onClick={save}>
            Si
          </Button>
          <Button variant="secondary" onClick={hideConfirmationModal}>
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
          <h4>Tus datos han sido modificados exitosamente.</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={`btn-${userInfoContext.perfil}`}
            onClick={handleAccept}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const profilePictureEditModal = () => {
    return (
      <ProfilePictureEditModal
        className="child-modal"
        show={showUserProfileEditModal}
        onHide={closeUserProfileEditModal}
      />
    );
  };

  const handleUserProfilePictureEditModal = () => {
    setShowUserProfileEditModal(true);
  };

  const closeUserProfileEditModal = () => {
    setShowUserProfileEditModal(false);
  };

  return (
    <>
      <Modal centered show={props.show} onHide={props.onHide} size="lg">
        <Modal.Header closeButton className={`bg-${userInfoContext.perfil}`}>
          <Modal.Title className="text-white">Perfil</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)} className="profile-edit-modal">
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
                  <small>El nombre no debe estar vacío.</small>
                )}
                {errors.name?.type === "pattern" && (
                  <small>Este nombre es inválido.</small>
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
                  <small>El apellido no debe estar vacío.</small>
                )}
                {errors.lastName?.type === "pattern" && (
                  <small>Este apellido es inválido.</small>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Correo electrónico</Form.Label>
                <Controller
                  as={<Form.Control type="email" disabled />}
                  name="email"
                  control={control}
                  disabled={true}
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
                  <small>El cargo no debe estar vacío.</small>
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
              <Form.Group as={Col}>
                <Form.Label>Contraseña</Form.Label>
                <br />
                <Button variant="link" onClick={props.onClickOnChangePassword}>
                  <small>Cambiar contraseña</small>
                </Button>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Label>Foto de perfil</Form.Label>{" "}
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleUserProfilePictureEditModal}
                >
                  <small>Editar</small>
                </Button>
                <Image src={userInfoContext.picture} fluid />
              </Col>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={`btn-${userInfoContext.perfil}`}
              type="submit"
              disabled={!canSave}
            >
              Guardar
            </Button>
            <Button variant="secondary" onClick={exit}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Form>
        {confirmationModal()}
        {profilePictureEditModal()}
      </Modal>
    </>
  );
};

export default ProfileEditModal;
