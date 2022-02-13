import React, { useEffect, useContext, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../../utils/useProfile';
import { Modal, Form, Col, Button, Spinner, Tab, Tabs } from 'react-bootstrap';
import { AuthContext, ServiceContext } from '../../../contexts';
import { filterByReference, REGEX_EMAIl, REGEX_OFFICIAL_ID } from '../../../utils';
import swal from 'sweetalert';
import { CustomTable } from '../../organisms';

import './ModalAddParticipants.scss';
import { newParticipantFields, newParticipantSchema } from '../../../schemas';
import { FormInput } from '../../atoms';

export interface IModalAddParticipantProps {
  handleClose: () => void;
}

export function ModalAddParticipant({ handleClose }: IModalAddParticipantProps) {
  const [profile] = useProfile();
  const { userInfo } = useContext(AuthContext);
  const [foundParticipants, setFoundParticipants] = useState<any[]>([]);
  const [newParticipant, setNewParticipant] = useState<any>(null);
  const {
    getCompanyDrivers,
    loadingDrivers,
    companyDrivers,
    setServiceParticipants,
    serviceParticipants
  } = useContext(ServiceContext);
  const { register, handleSubmit, errors } = useForm({
    // reValidateMode: 'onChange',
    // resolver: yupResolver(newParticipantSchema)
  });

  const fetchCompanyDrivers = async () => {
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

  const handleAddOldParticipant = async () => {
    const listHtmlOfParticipants = foundParticipants.map(
      (participant) =>
        `<tr key=${participant.id}>
          <td>${participant?.first_name}</td>
          <td>${participant?.last_name}</td>
          <td>${participant?.email}</td>
        </tr>`
    );
    const content = document.createElement('table');
    content.innerHTML = `<thead><tr><th>Nombre</th><th>Apellido</th><th>Email</th></tr></thead><tbody>${listHtmlOfParticipants.join(
      ''
    )}</tbody></table>`;
    content.classList.add('alert-table');
    swal({
      className: 'large-alert',
      title: 'Agregar a',
      content: content as any,
      icon: 'warning',
      buttons: ['Volver', 'Continuar'],
      dangerMode: true
    }).then(async (willCreate) => {
      if (willCreate) {
        // TODO: add participant to list
        console.log('add', foundParticipants);
        setServiceParticipants([...serviceParticipants, ...foundParticipants]);
        handleClose();
      }
    });
  };

  const handleAddNewUser = async (data) => {
    console.log('data', data);
    setNewParticipant(data);
    handleClose();
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
    <Form onSubmit={handleSubmit(handleAddNewUser)}>
      {newParticipantFields.map((field, index) => (
        <FormInput field={field} register={register} errors={errors} key={`form-input=${index}`} />
        // <FormItem field={field} register={register} errors={errors} key={`form-input=${index}`} />
      ))}
      {/* <Form.Row>
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
      </Form.Row> */}
      <Button variant="primary" type="submit" disabled={loadingDrivers} className="float-right">
        {loadingDrivers ? (
          <Spinner animation="border" role="status" size="sm">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        ) : (
          `Agregar`
        )}
      </Button>
    </Form>
  );

  const searchParticipantForm = (
    <>
      <CustomTable
        keyField="id"
        columns={columns}
        data={filterByReference(companyDrivers, serviceParticipants)}
        renderSearch
        loading={loadingDrivers}
        paginationSize={7}
        onSelectRow={(row, isSelect) => {
          let rows = [...foundParticipants];
          if (!isSelect) rows = rows.filter((r) => r.id !== row.id);
          else rows.push(row);
          setFoundParticipants(rows);
        }}
        hideSelectColumn={false}
        selectionMode="checkbox"
      />
      {errors.user && <span className="text-danger">Por favor, selecciona un usuario.</span>}
      <Button
        variant="primary"
        disabled={!foundParticipants.length}
        onClick={handleAddOldParticipant}>
        Agregar
      </Button>
    </>
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
