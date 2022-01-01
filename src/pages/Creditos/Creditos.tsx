import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

interface ICreditosProps {}

export const Creditos: React.FunctionComponent<ICreditosProps> = (props) => {
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
        title="Creditos"
        subtitle="Detalle de los Creditos registradas"
        actionButtons={actionButtons}>
        <p>Creditos</p>
      </CustomCard>
    </MainLayout>
  );
};
