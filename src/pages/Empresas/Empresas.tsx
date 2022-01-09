import React, { useState, useContext, useEffect } from 'react';
import { Image, Spinner } from 'react-bootstrap';
import { FaDownload, FaPlus, FaUndoAlt } from 'react-icons/fa';
import { CustomCard, ModalNewUser } from '../../components/molecules';
import { CustomTable } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { CompaniesContext } from '../../contexts/';

interface IEmpresasProps {}

export const Empresas: React.FunctionComponent<IEmpresasProps> = (props) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const {
    companies,
    loadingCompanies,
    getCompanies,
    allCompaniesLoaded,
    count,
    setAllCompaniesLoaded
  } = useContext(CompaniesContext);

  const fetchCompanies = async () => {
    try {
      await getCompanies();
    } catch (error) {
      throw new Error('Error getting companies');
    }
  };

  useEffect(() => {
    if (!loadingCompanies && !allCompaniesLoaded) fetchCompanies();
    //eslint-disable-next-line
  }, [allCompaniesLoaded]);

  const actionButtons = [
    {
      onClick: () => setAllCompaniesLoaded(false),
      icon: loadingCompanies ? (
        <Spinner animation="border" size="sm" className="mt-2" />
      ) : (
        <FaUndoAlt />
      ),
      disabled: loadingCompanies
    },
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

  const logoFormatter = (cell) => {
    return <Image src={cell} roundedCircle width="50" height="50" />;
  };

  const columns = [
    {
      dataField: 'logo',
      text: 'Logo',
      formatter: logoFormatter,
      classes: 'md-column',
      headerClasses: 'md-column'
    },
    {
      dataField: 'name',
      text: 'Nombre',
      sort: true,
      classes: 'lg-column',
      headerClasses: 'lg-column'
    },

    {
      dataField: 'nit',
      text: 'Nit',
      sort: true
    },
    {
      dataField: 'address',
      text: 'Dirección'
    },
    {
      dataField: 'phone',
      text: 'Teléfono'
    },
    {
      dataField: 'arl',
      text: 'ARL'
    }
  ];

  return (
    <MainLayout>
      <CustomCard
        title="Empresas"
        subtitle={`Detalle de las empresas registradas ${
          loadingCompanies ? `(${companies.length} de ${count})` : `(${count})`
        }`}
        loading={loadingCompanies}
        actionButtons={actionButtons}>
        <CustomTable
          keyField="id"
          columns={columns}
          data={companies}
          renderSearch
          loading={loadingCompanies}
        />
      </CustomCard>
      {showAddUser && <ModalNewUser handleClose={() => setShowAddUser(false)} />}
    </MainLayout>
  );
};
