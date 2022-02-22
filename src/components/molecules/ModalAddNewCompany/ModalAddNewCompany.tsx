import React, { useContext, useState } from 'react';
import { Modal, Form, Col, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { CompaniesContext } from '../../../contexts';
import { useProfile } from '../../../utils';

export interface IModalAddNewCompanyProps {
  handleClose: () => void;
}

export function ModalAddNewCompany({ handleClose }: IModalAddNewCompanyProps) {
  const [profile] = useProfile();
  const { createCompany, loadingCompanies } = useContext(CompaniesContext);
  const { register, handleSubmit, errors } = useForm();
  const [logoFile, setLogoFile] = useState<any>('');

  const onSubmit = async (data) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === '') data[key] = 'NA';
      if (key === 'logo' && data[key].length <= 0) delete data[key];
      else if (key === 'logo' && data[key].length >= 1) data[key] = logoFile;
    });
    try {
      const res = await createCompany(data);
      if (res) {
        swal('Perfecto!', `${data.name} fue registrada existosamente`, 'success');
        handleClose();
      } else throw new Error('Error al registrar');
    } catch (error) {
      swal('Error!', `${error}`, 'error');
    }
  };
  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white">Registrar nueva empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" ref={register({ required: true })} />
              {errors.name && <small className="text-danger">El nombre es obligatorio</small>}
            </Form.Group>
            <Form.Group as={Col} controlId="formGridNit">
              <Form.Label>Nit</Form.Label>
              <Form.Control type="number" name="nit" ref={register()} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="address" ref={register()} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="number" name="phone" ref={register()} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridArl">
              <Form.Label>Arl</Form.Label>
              <Form.Control type="text" name="arl" ref={register()} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLogo">
              <Form.Label>Logo</Form.Label>
              <Form.File
                id="custom-file"
                type="file"
                label={logoFile ? logoFile.name : ''}
                custom
                name="logo"
                ref={register()}
                onChange={(e) => {
                  setLogoFile(e.target.files[0]);
                }}
              />
            </Form.Group>
          </Form.Row>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>

            <Button variant="primary" type="submit" disabled={loadingCompanies}>
              {loadingCompanies ? (
                <Spinner animation="border" role="status" size="sm">
                  <span className="sr-only">Cargando...</span>
                </Spinner>
              ) : (
                'Registrar'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
