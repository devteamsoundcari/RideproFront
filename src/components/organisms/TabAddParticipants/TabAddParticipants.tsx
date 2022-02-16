import React, { useContext, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaUndoAlt, FaPlus, FaDownload } from 'react-icons/fa';
import { ServiceContext } from '../../../contexts';
import { CustomCard, ModalAddParticipant } from '../../molecules';
import { CustomTable } from '../CustomTable/CustomTable';
import './TabAddParticipants.scss';

export interface ITabAddParticipantsProps {}

export function TabAddParticipants(props: ITabAddParticipantsProps) {
  const [showModalAddParticipant, setShowModalAddParticipant] = useState(true);
  const { serviceParticipants } = useContext(ServiceContext);
  const columns = [
    {
      dataField: 'official_id',
      text: 'Tipo',
      formatter: (row) => {
        console.log('row', row);
        return row.url ? 'Antiguo' : 'Nuevo';
      },
      className: 'small-column',
      sort: true
    },
    {
      dataField: 'official_id',
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
      dataField: 'cellphone',
      text: 'Teléfono'
    }
  ];

  const actionButtons = [
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
          data={serviceParticipants}
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
