import React from 'react';
import { CustomCard } from '../../molecules';
import { CustomTable } from '../CustomTable/CustomTable';
import './TabAddParticipants.scss';

export interface ITabAddParticipantsProps {}

export function TabAddParticipants(props: ITabAddParticipantsProps) {
  const columns = [
    {
      dataField: 'id',
      text: 'Identificación'
      // hidden: true,
      // classes: 'small-column',
      // headerClasses: 'small-column'
    },
    {
      dataField: 'name',
      text: 'Nombre'
    },
    {
      dataField: 'last_name',
      text: 'Apellido'
    },
    {
      dataField: 'email ',
      text: 'Email'
    },
    {
      dataField: 'phone',
      text: 'Teléfono'
    }
  ];

  return (
    <div className="tab-add-participants">
      <CustomCard
        bodyPadding="0"
        title="Participantes"
        subtitle={'hello'}
        // actionButtons={actionButtons}
        loading={false}>
        <CustomTable
          keyField="id"
          loading={false}
          columns={columns}
          data={[]}
          // onSelectRow={(row) => {
          //   setSelectedTrack(row);
          //   setTrackData(row);
          //   setShowTrackEditModal(true);
          // }}
        />
      </CustomCard>{' '}
    </div>
  );
}
