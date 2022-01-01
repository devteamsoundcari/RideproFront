import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

interface ISuperClientesProps {}

export const SuperClientes: React.FunctionComponent<ISuperClientesProps> = (props) => {
  const actionButtons = [
    {
      onClick: () => console.log('yex'),
      icon: <FaPlus />
    },
    {
      onClick: () => console.log('yex'),
      icon: <FaDownload />,
      disabled: true
    }
  ];

  return (
    <MainLayout>
      <CustomCard
        title="Super Clientes"
        subtitle="Detalle de los SuperClientes registradas"
        actionButtons={actionButtons}>
        <p>SuperClientes</p>
      </CustomCard>
    </MainLayout>
  );
};
