import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

interface IEmpresasProps {}

export const Empresas: React.FunctionComponent<IEmpresasProps> = (props) => {
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
        title="Empresas"
        subtitle="Detalle de las empresas registradas"
        actionButtons={actionButtons}>
        <p>Empresas</p>
      </CustomCard>
    </MainLayout>
  );
};
