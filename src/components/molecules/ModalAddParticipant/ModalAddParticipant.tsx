import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../../utils/useProfile';
import { Modal, Form, Col, Button, Spinner, Tab, Tabs } from 'react-bootstrap';
import { AuthContext, ServiceContext } from '../../../contexts';
import { REGEX_EMAIl, REGEX_OFFICIAL_ID } from '../../../utils';
import './ModalAddParticipants.scss';
import { CustomTable } from '../../organisms';

export interface IModalAddParticipantProps {
  handleClose: () => void;
}

export function ModalAddParticipant({ handleClose }: IModalAddParticipantProps) {
  const [profile] = useProfile();
  const { userInfo } = useContext(AuthContext);
  const { getCompanyDrivers, loadingDrivers, companyDrivers } = useContext(ServiceContext);
  const { register, handleSubmit, errors } = useForm();

  const fetchCompanyDrivers = async () => {
    console.log(userInfo);
    try {
      await getCompanyDrivers(userInfo.company.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================================= ON SUBMIT THE FORM ==========================================
  const onSubmit = async (data) => {
    const { name, services, phoneNumber, email, officialId } = data;

    const payload = {
      name: name.toLowerCase(),
      services: services.toLowerCase(),
      official_id: officialId,
      cellphone: phoneNumber,
      email: email.toLowerCase(),
      documents: 'na',
      picture: 'na'
    };
    // const response = await addProvider(payload);
    // if (response) {
    //   swal('Perfecto!', `${name} fue registrado existosamente`, 'success');
    //   handleClose();
    // } else {
    //   swal('Ooops!', 'Algo paso, no pudimos registrar el proveedor', 'danger');
    // }
  };

  const columns = [
    {
      dataField: 'official_id',
      text: 'Identificación',
      sort: true
    },
    {
      dataField: 'first_name',
      text: 'Nombre',
      sort: true
    },
    {
      dataField: 'last_name',
      text: 'Apellido',
      sort: true
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true
    },
    {
      dataField: 'cellphone',
      text: 'Teléfono',
      sort: true
    }
  ];

  const newParticipantForm = (
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
            {errors.name && <span className="text-danger">Ingrese un nombre válido.</span>}
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
            {errors.email && <span className="text-danger">Ingrese un email válido.</span>}
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
            Email<span className="text-danger"> *</span>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            name="services"
            autoComplete="off"
            ref={register({
              required: true
            })}
          />
          <Form.Text>
            {errors.email && <span className="text-danger">Ingrese un texto valido.</span>}
          </Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>
            Telefono<span className="text-danger"> *</span>
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="Telefono"
            name="phone"
            autoComplete="off"
            ref={register({
              required: true
            })}
          />
          <Form.Text>
            {errors.phone && <span className="text-danger">Ingrese un texto valido.</span>}
          </Form.Text>
        </Form.Group>
      </Form.Row>
      <Button variant="primary" type="submit" disabled={loadingDrivers} className="float-right">
        Agregar
      </Button>

      {loadingDrivers && (
        <Spinner animation="border" role="status" size="sm">
          <span className="sr-only">Cargando...</span>
        </Spinner>
      )}
    </Form>
  );

  const searchParticipantForm = (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <hr />
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Control
            className="d-none"
            name="user"
            // value={data?.user.id}
            autoComplete="off"
            placeholder="Usuario"
            ref={register({ required: true })}
          />
          <CustomTable
            keyField="id"
            columns={columns}
            data={companyDrivers}
            renderSearch
            loading={loadingDrivers}
            // showPagination
            paginationSize={3}
            onSelectRow={(row: any) => {
              const e = {
                target: {
                  value: row,
                  name: 'user'
                }
              };
              console.log(e);
              // updateData(e);
            }}
            hideSelectColumn={false}
          />
          <Form.Text color="danger">
            {errors.user && <span className="text-danger">Por favor, selecciona un usuario.</span>}
          </Form.Text>
        </Form.Group>
      </Form.Row>
      <Modal.Footer>
        <Button variant="primary" type="submit">
          Agregar
        </Button>
      </Modal.Footer>
    </Form>
  );

  return (
    <Modal size="lg" show={true} onHide={handleClose} className="modal-add-participants">
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Agregar participante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="search" className="mb-3">
          <Tab eventKey="search" title="Buscar">
            {searchParticipantForm}
          </Tab>
          <Tab eventKey="new" title="Nuevo">
            {newParticipantForm}
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
