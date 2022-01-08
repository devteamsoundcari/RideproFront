import React, { useState } from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CustomCard, ModalNewUser } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

interface IEmpresasProps {}

export const Empresas: React.FunctionComponent<IEmpresasProps> = (props) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const actionButtons = [
    {
      onClick: () => setShowAddUser(true),
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
        title="Empresas"
        subtitle="Detalle de las empresas registradas"
        actionButtons={actionButtons}>
        <p>Empresas</p>
        {showAddUser && <ModalNewUser handleClose={() => setShowAddUser(false)} />}
      </CustomCard>
    </MainLayout>
  );
};
