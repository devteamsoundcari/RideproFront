import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../../utils/useProfile';
import { Modal, Card, Form, Col, Button, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';
import { TracksContext, ProvidersContext } from '../../../contexts';
import { REGEX_EMAIl, REGEX_OFFICIAL_ID, REGEX_PHONE_NUMBER, useDropdown } from '../../../utils';

export interface IModalAddProviderProps {
  handleClose: () => void;
}

export function ModalAddProvider({ handleClose }: IModalAddProviderProps) {
  const [profile] = useProfile();
  const { register, handleSubmit, errors } = useForm();
  const { addProvider, loadingProviders } = useContext(ProvidersContext);
  const {
    getDepartments,
    departments,
    loadingDepartments,
    getCitiesByDepartmentId,
    loadingCities,
    cities
  } = useContext(TracksContext);
  const [cityError, setCityError] = useState(false);
  const [selectedDepartment, DepartmentsDropdown] = useDropdown(
    'Departamento',
    'Seleccione...',
    departments,
    loadingDepartments
  );

  const [selectedCity, CitiesDropdown] = useDropdown(
    'Ciudad',
    'Seleccione...',
    cities,
    loadingCities
  );

  // ================================= ON SUBMIT THE FORM ==========================================

  const onSubmit = async (data) => {
    const { name, services, phoneNumber, email, officialId } = data;

    if (selectedCity === 'Seleccione...') {
      setCityError(true);
      return;
    } else {
      setCityError(false);
    }
    const payload = {
      name: name.toLowerCase(),
      services: services.toLowerCase(),
      official_id: officialId,
      cellphone: phoneNumber,
      email: email.toLowerCase(),
      municipality: selectedCity,
      documents: 'na',
      picture: 'na'
    };
    const response = await addProvider(payload);
    if (response) {
      swal('Perfecto!', `${name} fue registrado existosamente`, 'success');
      handleClose();
    } else {
      swal('Ooops!', 'Algo paso, no pudimos registrar el proveedor', 'danger');
    }
  };

  // =========================== FETCHING DEPARTMENTS ===================================

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================================= GET CITIES ==========================================

  useEffect(() => {
    if (selectedDepartment) {
      getCitiesByDepartmentId(selectedDepartment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment]);

  return (
    <Modal size="lg" show={true} onHide={handleClose} className="modal-add-proveedors">
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Registrar proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Card className="usuarios">
            <Card.Body>
              <Card.Title>Registrar nuevo proveedor</Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>
                      Nombre<span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      name="name"
                      autoComplete="off"
                      ref={register({
                        required: true
                      })}
                    />
                    <Form.Text>
                      {errors.name && (
                        <span className="text-danger">Ingrese un nombre válido.</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formBasicEmail">
                    <Form.Label>
                      Correo electrónico<span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Correo electrónico"
                      name="email"
                      autoComplete="off"
                      ref={register({
                        required: true,
                        pattern: REGEX_EMAIl
                      })}
                    />
                    <Form.Text className="text-muted">
                      {errors.email && (
                        <span className="text-danger">Ingrese un email válido.</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>
                      Número de documento<span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Número de documento"
                      name="officialId"
                      autoComplete="off"
                      ref={register({
                        required: true,
                        pattern: REGEX_OFFICIAL_ID
                      })}
                    />
                    <Form.Text className="text-muted">
                      {errors.officialId && (
                        <span className="text-danger">Ingrese un número de documento válido.</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>
                      Servicios<span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Servicios"
                      name="services"
                      autoComplete="off"
                      ref={register({
                        required: true
                      })}
                    />
                    <Form.Text>
                      {errors.lastName && (
                        <span className="text-danger">Ingrese un texto valido.</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <DepartmentsDropdown />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <CitiesDropdown />
                    {cityError && <span className="text-danger">Seleccione una ciudad</span>}
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>
                      Teléfono<span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Teléfono"
                      name="phoneNumber"
                      autoComplete="off"
                      ref={register({
                        required: true,
                        pattern: REGEX_PHONE_NUMBER
                      })}
                    />
                    <Form.Text className="text-muted">
                      {errors.phoneNumber && (
                        <span className="text-danger">Ingrese un número de teléfono válido.</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit" disabled={loadingProviders}>
                  Registrar proveedor
                </Button>
                {loadingProviders && (
                  <Spinner animation="border" role="status" size="sm">
                    <span className="sr-only">Cargando...</span>
                  </Spinner>
                )}
              </Form>
            </Card.Body>
          </Card>
        </>
      </Modal.Body>
    </Modal>
  );
}
