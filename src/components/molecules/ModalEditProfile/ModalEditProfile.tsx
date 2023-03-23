import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Col, Form, Spinner, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../../../contexts';
import { ModalEditProfilePicture } from '../ModalEditProfilePicture/ModalEditProfilePicture';
import './ModalEditProfile.scss';
import { useProfile } from '../../../utils';
import { editProfileFields, editProfileSchema } from '../../../schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormInput } from '../../atoms';
import swal from 'sweetalert';

export const ModalEditProfile = (props: any) => {
  const [showUserProfileEditModal, setShowUserProfileEditModal] = useState(false);
  const { userInfo, updateUserData, loadingAuth } = useContext(AuthContext) as any;
  const [profile] = useProfile();
  const defaultValues = {
    first_name: userInfo.first_name,
    last_name: userInfo.last_name,
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
    swal({
      title: 'Importante',
      text: '¿Estas segur@ de editar tu información?',
      icon: 'warning',
      buttons: ['Volver', 'Continuar'],
      dangerMode: true
    })
      .then(async (willUpdate) => {
        if (willUpdate) {
          const payload = {
            ...data,
            company_id: userInfo.company.id
          };
          await updateUserData(payload);
          swal('Perfecto!', 'Información actualizada correctamente', 'success');
        }
      })
      .catch(() => {
        swal('Oops!', 'No se pudo actualizar la información', 'error');
        throw new Error('Error updating profile');
      });
  };

  const exit = () => {
    props.onHide();
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
            <div className="image-cropper">
              <Image src={userInfo.picture} className="shadow" />
            </div>
            <Col className="pl-3">
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
          <Button variant="secondary" onClick={exit}>
            Cerrar
          </Button>
          <Button className={`btn-${profile}`} type="submit" disabled={!canSave}>
            {loadingAuth ? <Spinner animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
      {profilePictureEditModal()}
    </Modal>
  );
};
