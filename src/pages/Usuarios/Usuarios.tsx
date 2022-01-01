import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

interface IUsuariosProps {}

export const Usuarios: React.FunctionComponent<IUsuariosProps> = (props) => {
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
        title="Usuarios"
        subtitle="Detalle de los Usuarios registradas"
        actionButtons={actionButtons}>
        <p>Usuarios</p>
      </CustomCard>
    </MainLayout>
  );
};
