import React, { useContext } from 'react';
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';
import { Modal, Form, Spinner, Button } from 'react-bootstrap';
import { useProfile } from '../../../utils';
import { AuthContext } from '../../../contexts';
import { editPasswordFields, editPasswordSchema } from '../../../schemas';
import { FormInput } from '../../atoms';
import { yupResolver } from '@hookform/resolvers/yup';

export const ModalChangePassword = (props: any) => {
  const [profile] = useProfile();
  const { updatePassword, loadingAuth } = useContext(AuthContext) as any;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(editPasswordSchema)
  });

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
          await updatePassword(data);
          props.onExit();
          swal('Perfecto!', 'Contraseña actualizada correctamente', 'success');
        }
      })
      .catch(() => {
        swal('Oops!', 'No se pudo actualizar la información', 'error');
        throw new Error('Error updating profile');
      });
  };

  const exit = () => {
    props.onExit();
  };

  return (
    <Modal centered show={props.show} onHide={props.onHide} size="sm">
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white">Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {editPasswordFields.map((field, index) => (
            <FormInput
              field={field}
              register={register}
              errors={errors}
              key={`form-input=${index}`}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={exit}>
            Cerrar
          </Button>
          <Button className={`btn-${profile}`} type="submit">
            {loadingAuth ? <Spinner animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
