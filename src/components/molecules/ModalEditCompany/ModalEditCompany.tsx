import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { editCompany } from '../../../controllers/apiRequests';
import { Modal, Col, Form, Spinner, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../../../contexts';
import { ModalEditCompanyLogo } from '../ModalEditCompanyLogo/ModalEditCompanyLogo';
import './ModalEditCompany.scss';
import { getProfile } from '../../../utils';

export const ModalEditCompany = (props: any) => {
  const { handleSubmit, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [showCompanyLogoEditModal, setShowCompanyEditModal] = useState(false);
  const {
    userInfo: { company, profile }
  } = useContext(AuthContext);
  // eslint-disable-next-line
  const [data, setData] = useState({
    name: company.name,
    nit: company.nit,
    address: company.address,
    arl: company.arl,
    phone: company.phone
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await editCompany(company.id, data);

    if (response) {
      setLoading(false);
    }
  };

  const updateData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;

    setData((current) => ({
      ...current,
      [inputName]: inputValue
    }));
  };

  // eslint-disable-next-line
  const loadingSpinner = () => {
    if (loading) {
      return (
        <Spinner animation="border" role="status" size="sm">
          <span className="sr-only">Cargando...</span>
        </Spinner>
      );
    } else {
      return null;
    }
  };

  const companyLogoEditModal = () => {
    return (
      <ModalEditCompanyLogo
        className="child-modal"
        show={showCompanyLogoEditModal}
        onHide={closeCompanyLogoEditModal}
      />
    );
  };

  const handleCompanyLogoEditModal = () => {
    setShowCompanyEditModal(true);
  };

  const closeCompanyLogoEditModal = () => {
    setShowCompanyEditModal(false);
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg">
      <Modal.Header closeButton className={`bg-${getProfile(profile)}`}>
        <Modal.Title className="text-white">Compañía</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} className="company-edit-modal">
        <Modal.Body>
          <Form.Row>
            <Col md={2}>
              <Image
                src={company.logo}
                fluid
                roundedCircle
                className="shadow"
              />
            </Col>
            <Col md={10} className="pl-3">
              <h6 className="mt-2">LOGO</h6>
              <div className="w-50 recommendation">
                <small>
                  Para una correcta visualización el aspecto de la imagen debe
                  ser lo mas cuadrado posible.
                </small>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompanyLogoEditModal}>
                Editar
              </Button>
            </Col>
          </Form.Row>
          <Form.Row className="mt-3">
            <Form.Group as={Col}>
              <Form.Label>Nombre</Form.Label>
              <Controller
                as={<Form.Control disabled />}
                name="name"
                type="text"
                defaultValue={company.name}
                control={control}
                onChange={updateData}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>NIT</Form.Label>
              <Controller
                as={<Form.Control disabled />}
                name="nit"
                type="text"
                defaultValue={company.nit}
                control={control}
                onChange={updateData}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Dirección</Form.Label>
              <Controller
                as={<Form.Control disabled />}
                name="address"
                type="text"
                defaultValue={company.address}
                control={control}
                onChange={updateData}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>ARL</Form.Label>
              <Controller
                as={<Form.Control disabled />}
                name="arl"
                type="text"
                defaultValue={company.arl}
                control={control}
                onChange={updateData}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Teléfono</Form.Label>
              <Controller
                as={<Form.Control disabled />}
                name="phone"
                type="text"
                defaultValue={company.phone}
                control={control}
                onChange={updateData}
              />
            </Form.Group>
          </Form.Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className={`btn-${profile}`}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Form>
      {companyLogoEditModal()}
    </Modal>
  );
};
