import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { editCompany } from '../../../controllers/apiRequests';
import { Modal, Col, Form, Spinner, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../../../contexts';
import { ModalEditCompanyLogo } from '../ModalEditCompanyLogo/ModalEditCompanyLogo';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProfile } from '../../../utils';
import './ModalEditCompany.scss';
import { editCompanyFields, editCompanySchema } from '../../../schemas';
import { FormInput } from '../../atoms';

export const ModalEditCompany = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [showCompanyLogoEditModal, setShowCompanyEditModal] = useState(false);
  const { userInfo } = useContext(AuthContext) as any;
  const [profile] = useProfile();
  // eslint-disable-next-line
  const [data, setData] = useState({
    name: userInfo.company.name,
    nit: userInfo.company.nit,
    address: userInfo.company.address,
    arl: userInfo.company.arl,
    phone: userInfo.company.phone
  });
  const defaultValues = {
    name: userInfo.company.name,
    nit: userInfo.company.nit,
    address: userInfo.company.address,
    arl: userInfo.company.arl,
    phone: userInfo.company.phone
  };
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(editCompanySchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await editCompany(userInfo.company.id, data);

    if (response) {
      setLoading(false);
    }
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
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white">Compañía</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} className="company-edit-modal">
        <Modal.Body>
          <Form.Row>
            <div className="image-cropper">
              <Image src={userInfo.company.logo} className="shadow" />
            </div>
            <Col className="pl-3">
              <h6 className="mt-2">LOGO</h6>
              <div className="recommendation">
                <small>
                  Para una correcta visualización el aspecto de la imagen debe ser lo mas cuadrado
                  posible.
                </small>
              </div>
              <Button variant="primary" size="sm" onClick={handleCompanyLogoEditModal} disabled>
                Editar
              </Button>
            </Col>
          </Form.Row>
          <hr />
          {editCompanyFields.map((field, index) => (
            <FormInput
              field={field}
              register={register}
              errors={errors}
              key={`form-input=${index}`}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button type="submit" className={`btn-${profile}`} disabled>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
      {companyLogoEditModal()}
    </Modal>
  );
};
