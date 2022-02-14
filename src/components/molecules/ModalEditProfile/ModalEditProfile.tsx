import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Col, Form, Spinner, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../../../contexts';
import { ModalEditProfilePicture } from '../ModalEditProfilePicture/ModalEditProfilePicture';
import { editUser } from '../../../controllers/apiRequests';
import './ModalEditProfile.scss';
import { useProfile } from '../../../utils';
import { editProfileFields, editProfileSchema } from '../../../schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from '../../atoms';

export const ModalEditProfile = (props: any) => {
  const [stage, setStage] = useState('waiting');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUserProfileEditModal, setShowUserProfileEditModal] = useState(false);
  const [submittedData, setSubmittedData] = useState();
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const [profile] = useProfile();
  const defaultValues = {
    name: userInfo.first_name,
    lastName: userInfo.last_name,
    email: userInfo.email,
    charge: userInfo.charge,
    gender: userInfo.gender
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(editProfileSchema)
  });
  const formValues = watch();
  const [canSave, setCanSave] = useState(false);

  const onSubmit = (data: any) => {
    setShowConfirmationModal(true);
    setStage('confirmation');
    setSubmittedData(data);
  };

  const exit = () => {
    props.onHide();
  };

  const save = async () => {
    setStage('loading');
    let data = Object.assign(submittedData!);
    data.company_id = userInfo.company.id;
    data.first_name = data.name;
    data.last_name = data.lastName;
    data.email = userInfo.email;
    let result = await editUser(data);
    if (result) {
      await updateUserInfo();
      setStage('success');
    }
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleAccept = () => {
    setShowConfirmationModal(false);
    setStage('waiting');
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
  }, [defaultValues, formValues]);

  const confirmationModal = () => {
    return (
      <Modal
        centered
        size="sm"
        className="child-modal"
        show={showConfirmationModal}
        onHide={hideConfirmationModal}>
        {stage === 'confirmation' && confirmationMessage()}
        {stage === 'loading' && loadingSpinner()}
        {stage === 'success' && successMessage()}
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
          <Button className={`btn-${userInfo.perfil}`} onClick={save}>
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
          <Button className={`btn-${userInfo.perfil}`} onClick={handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const profilePictureEditModal = () => {
    return (
      <ModalEditProfilePicture
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
      <Modal centered show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton className={`bg-${profile}`}>
          <Modal.Title className="text-white">
            <h5>
              Perfil <small className="text-capitalize">| {profile}</small>
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)} className="profile-edit-modal">
          <Modal.Body>
            <Form.Row>
              <Col md={6} className="text-center">
                <Image src={userInfo.picture} fluid roundedCircle className="shadow w-75" />
              </Col>
              <Col md={6} className="pl-3">
                <h6 className="mt-2">FOTO DE PERFIL</h6>
                <div className="recommendation">
                  <small>
                    Para una correcta visualización el aspecto de la imagen debe ser lo mas cuadrado
                    posible.
                  </small>
                </div>
                <Button variant="primary" size="sm" onClick={handleUserProfilePictureEditModal}>
                  Cambiar
                </Button>
              </Col>
            </Form.Row>
            <hr />
            {editProfileFields.map((field, index) => (
              <FormInput
                field={field}
                register={register}
                errors={errors}
                key={`form-input=${index}`}
              />
            ))}
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Género</Form.Label>
                <Form.Control
                  as="select"
                  autoComplete="off"
                  {...register('gender', { required: true })}>
                  <option>M</option>
                  <option>F</option>
                  <option>O</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Contraseña</Form.Label>
                <br />
                <Button variant="link" onClick={props.onClickOnChangePassword}>
                  <small>Cambiar contraseña</small>
                </Button>
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className={`btn-${userInfo.perfil}`} type="submit" disabled={!canSave}>
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
