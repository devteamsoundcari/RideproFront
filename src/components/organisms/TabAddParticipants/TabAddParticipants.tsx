import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaUndoAlt, FaPlus, FaDownload } from 'react-icons/fa';
import { CustomCard, ModalAddParticipant } from '../../molecules';
import { CustomTable } from '../CustomTable/CustomTable';
import './TabAddParticipants.scss';

export interface ITabAddParticipantsProps {}

export function TabAddParticipants(props: ITabAddParticipantsProps) {
  const [showModalAddParticipant, setShowModalAddParticipant] = useState(true);

  const participants = [
    {
      id: 1,
      first_name: 'Juan',
      last_name: 'Perez',
      email: 'asdas@asd.com',
      phone: '123456789'
    }
  ];

  const columns = [
    {
      dataField: 'id',
      text: 'Identificación'
    },
    {
      dataField: 'first_name',
      text: 'Nombre'
    },
    {
      dataField: 'last_name',
      text: 'Apellido'
    },
    {
      dataField: 'email',
      text: 'Email'
    },
    {
      dataField: 'phone',
      text: 'Teléfono'
    }
  ];

  const actionButtons = [
    {
      onClick: () => console.log('click'),
      icon: false ? <Spinner animation="border" size="sm" className="mt-2" /> : <FaUndoAlt />,
      disabled: false
    },
    {
      onClick: () => setShowModalAddParticipant(true),
      icon: <FaPlus />,
      disabled: false
    },
    {
      onClick: () => console.log('yex'),
      icon: <FaDownload />,
      disabled: true
    }
  ];

  return (
    <div className="tab-add-participants">
      <CustomCard
        bodyPadding="0"
        title="Participantes"
        subtitle={'hello'}
        actionButtons={actionButtons}
        loading={false}>
        <CustomTable
          showPagination={false}
          selectionMode="checkbox"
          keyField="id"
          hideSelectColumn={false}
          loading={false}
          columns={columns}
          data={participants}
          onSelectRow={(row) => {
            console.log(row);
          }}
        />
      </CustomCard>
      {showModalAddParticipant && (
        <ModalAddParticipant handleClose={() => setShowModalAddParticipant(false)} />
      )}
    </div>
  );
}
