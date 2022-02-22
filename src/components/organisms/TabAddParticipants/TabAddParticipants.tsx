import React, { useContext, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { ServiceContext } from '../../../contexts';
import { filterByReference } from '../../../utils';
import { CustomCard, ModalAddParticipant } from '../../molecules';
import { CustomTable } from '../CustomTable/CustomTable';
import swal from 'sweetalert';
import './TabAddParticipants.scss';

export interface ITabAddParticipantsProps {}

export function TabAddParticipants(props: ITabAddParticipantsProps) {
  const [showModalAddParticipant, setShowModalAddParticipant] = useState(false);
  const { serviceParticipants, setServiceParticipants } = useContext(ServiceContext);
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const columns = [
    {
      dataField: 'id',
      text: 'Tipo',
      formatter: (_, row) => (row.url ? 'Antiguo' : 'Nuevo'),
      className: 'small-column text-center',
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

  const removeSelectedParticipants = () => {
    const newArr = filterByReference(serviceParticipants, selectedParticipants);
    swal({
      title: 'Importante',
      text: '¿Estas seguro de descartar estos participantes?',
      icon: 'warning',
      buttons: ['Volver', 'Si, descartar'],
      dangerMode: true
    }).then(async (willCreate) => {
      if (willCreate) {
        setServiceParticipants(newArr);
        setSelectedParticipants([]);
      }
    });
  };

  const actionButtons = [
    {
      onClick: () => setShowModalAddParticipant(true),
      icon: <FaPlus />,
      disabled: false
    },
    {
      onClick: () => removeSelectedParticipants(),
      icon: <FaTrash />,
      disabled: selectedParticipants.length === 0
    }
  ];

  return (
    <div className="tab-add-participants">
      <CustomCard
        bodyPadding="0"
        title="Participantes"
        subtitle={`Participantes de este servicio (${serviceParticipants.length})`}
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
          onSelectRow={(row, isSelect) => {
            let rows = [...selectedParticipants];
            if (!isSelect) rows = rows.filter((r) => r.id !== row.id);
            else rows.push(row);
            setSelectedParticipants(rows);
          }}
        />
      </CustomCard>
      {showModalAddParticipant && (
        <ModalAddParticipant handleClose={() => setShowModalAddParticipant(false)} />
      )}
    </div>
  );
}
