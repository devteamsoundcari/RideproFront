import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaDownload, FaPlus, FaTrash } from 'react-icons/fa';
import { CustomTable } from '..';
import { CompaniesContext } from '../../../contexts';
import { CustomCard, ModalAddCompanyToSuperUser } from '../../molecules';
import swal from 'sweetalert';

export interface ISuperUsersCompaniesProps {
  row: any;
}

export function SuperUsersCompanies({ row }: ISuperUsersCompaniesProps) {
  const { id, first_name, last_name, company } = row;
  const {
    userCompanies,
    loadingCompanies,
    getUserCompanies,
    countUserCompanies,
    deleteSuerUserCompany
  } = useContext(CompaniesContext);
  const [showModalAddCompany, setShowModalAddCompany] = useState(false);

  const fetchUserCompanies = async () => {
    try {
      await getUserCompanies(id);
    } catch (error) {
      throw new Error('Error getting the users');
    }
  };

  useEffect(() => {
    if (!loadingCompanies) fetchUserCompanies();
    //eslint-disable-next-line
  }, []);

  const handleDelete = async (data: any) => {
    swal({
      title: '¿Estas segur@?',
      text: `Estas a punto de desasignar ${data.company.name} de ${first_name} ${last_name}`,
      icon: 'warning',
      buttons: ['No, volver', 'Si, desasignar'],
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await deleteSuerUserCompany(data.id);
          fetchUserCompanies();
          swal(
            'Desasignado',
            `${data.company.name} fue desasignado de ${first_name} ${last_name}`,
            'success'
          );
        } catch (error) {
          swal('Error', 'No se pudo desasignar la empresa', 'error');
        }
      }
    });
  };

  const columns = [
    {
      dataField: 'id',
      text: 'Id',
      sort: true,
      classes: 'small-column text-center',
      headerClasses: 'small-column'
    },
    {
      dataField: 'company.name',
      text: 'Empresa',
      sort: true
    },
    {
      dataField: 'action',
      isDummyField: true,
      text: 'Borrar',
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: (_, row) => (
        <Button variant="link" onClick={() => handleDelete(row)}>
          <FaTrash />
        </Button>
      )
    }
  ];

  const actionButtons = [
    {
      onClick: () => setShowModalAddCompany(true),
      icon: <FaPlus />
    }
  ];

  return (
    <CustomCard
      title={`Empresas asignadas a:`}
      subtitle={`${first_name} ${last_name} de ${company.name} (${countUserCompanies})`}
      loading={loadingCompanies}
      actionButtons={actionButtons}>
      <CustomTable
        keyField="company.name"
        columns={columns}
        data={userCompanies}
        loading={loadingCompanies}
      />
      {showModalAddCompany && (
        <ModalAddCompanyToSuperUser
          handleClose={() => setShowModalAddCompany(false)}
          userName={`${first_name} ${last_name}`}
          companyName={company.name}
        />
      )}
    </CustomCard>
  );
}
