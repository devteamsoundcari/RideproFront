import React, { useContext, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaDownload, FaExternalLinkAlt, FaPlus, FaUndoAlt } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { CustomTable } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { DocumentsContext } from '../../contexts';

interface IDocumentosProps {}

export const Documentos: React.FunctionComponent<IDocumentosProps> = (props) => {
  const {
    documents,
    loadingDocuments,
    getDocuments,
    allDocumentsLoaded,
    count,
    setAllDocumentsLoaded
  } = useContext(DocumentsContext);

  const fetchDocuments = async () => {
    try {
      await getDocuments();
    } catch (error) {
      throw new Error('Error getting documents');
    }
  };

  useEffect(() => {
    if (!loadingDocuments && !allDocumentsLoaded) fetchDocuments();
    //eslint-disable-next-line
  }, [allDocumentsLoaded]);

  const actionButtons = [
    {
      onClick: () => setAllDocumentsLoaded(false),
      icon: loadingDocuments ? (
        <Spinner animation="border" size="sm" className="mt-2" />
      ) : (
        <FaUndoAlt />
      ),
      disabled: loadingDocuments
    },
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

  const linkFormatter = (cell) => {
    if (cell) {
      return (
        <a href={cell} target="n_blank">
          <FaExternalLinkAlt />
        </a>
      );
    }
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Nombre',
      sort: true
    },

    {
      dataField: 'description',
      text: 'Descripción',
      sort: true
    },
    {
      dataField: 'template',
      text: 'Plantilla',
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: linkFormatter
    }
  ];

  return (
    <MainLayout>
      <CustomCard
        title="Documentos"
        subtitle={`Detalle de los documentos registrados ${
          loadingDocuments ? `(${documents.length} de ${count})` : `(${count})`
        }`}
        loading={loadingDocuments}
        actionButtons={actionButtons}>
        <CustomTable columns={columns} data={documents} renderSearch loading={loadingDocuments} />
      </CustomCard>
    </MainLayout>
  );
};
