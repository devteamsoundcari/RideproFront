import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { editCompany } from "../../controllers/apiRequests";
import { Modal, Col, Form, Spinner, Button, Image } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import CompanyLogoEditModal from "./CompanyLogoEditModal";

const CompanyEditModal = (props: any) => {
  const { handleSubmit, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [showCompanyLogoEditModal, setShowCompanyEditModal] = useState(false);
  const { userInfoContext } = useContext(AuthContext);
  const { company } = userInfoContext;
  const [data, setData] = useState({
    name: company.name,
    nit: company.nit,
    address: company.address,
    arl: company.arl,
    phone: company.phone,
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await editCompany(company.id, data);

    if (response) {
      setLoading(false);
    }
  };

  const updateData = (e) => {
    console.log(e);
    let inputName = e.target.name;
    let inputValue = e.target.value;

    setData((current) => ({
      ...current,
      [inputName]: inputValue,
    }));
  };

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
      <CompanyLogoEditModal
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
      <Modal.Header closeButton>
        <Modal.Title>Compañía</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Row>
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
          <Form.Row>
            <Col>
              <Form.Label>Logo</Form.Label>{" "}
              <Button
                variant="link"
                size="sm"
                onClick={handleCompanyLogoEditModal}
              >
                <small>Editar</small>
              </Button>
            </Col>
            <Col></Col>
            <Form.Group as={Col}>
              <Image src={company.logo} fluid />
            </Form.Group>
          </Form.Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
      {companyLogoEditModal()}
    </Modal>
  );
};

export default CompanyEditModal;
