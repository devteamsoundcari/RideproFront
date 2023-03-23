import React, { useEffect, useContext, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../../utils/useProfile';
import { Modal, Form, Button, Spinner, Tab, Tabs } from 'react-bootstrap';
import { AuthContext, ServiceContext } from '../../../contexts';
import { filterByReference } from '../../../utils';
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
  const { userInfo } = useContext(AuthContext) as any;
  const [foundParticipants, setFoundParticipants] = useState<any[]>([]);
  const {
    getCompanyDrivers,
    loadingDrivers,
    companyDrivers,
    setServiceParticipants,
    serviceParticipants
  } = useContext(ServiceContext);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    reValidateMode: 'onChange',
    resolver: yupResolver(newParticipantSchema)
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
        setServiceParticipants([...serviceParticipants, ...foundParticipants]);
        handleClose();
      }
    });
  };

  const handleAddNewParticipant = async (participant) => {
    const htmlOfParticipant = `
        <tr>
          <td>${participant?.official_id}</td>
          <td>${participant?.first_name}</td>
          <td>${participant?.last_name}</td>
          <td>${participant?.email}</td>
          <td>${participant?.cellphone}</td>
        </tr>`;
    const content = document.createElement('table');
    content.innerHTML = `<thead><tr><th>Identificación</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Teléfono</th></tr></thead><tbody>${htmlOfParticipant}</tbody></table>`;
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
        setServiceParticipants([...serviceParticipants, participant]);
        handleClose();
      }
    });
  };

  const handleAddNewUser = async (data) => {
    Object.keys(data).forEach((key, index) => {
      data[key] = data[key].toLowerCase();
      data.id = index;
    });
    handleAddNewParticipant(data);
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
      ))}
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
        keyField="official_id"
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
