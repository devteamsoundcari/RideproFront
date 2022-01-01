import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { MainLayout } from '../../components/templates';

interface IDocumentosProps {}

export const Documentos: React.FunctionComponent<IDocumentosProps> = (props) => {
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
        title="Documentos"
        subtitle="Detalle de los Documentos registradas"
        actionButtons={actionButtons}>
        <p>Documentos</p>
      </CustomCard>
    </MainLayout>
  );
};
