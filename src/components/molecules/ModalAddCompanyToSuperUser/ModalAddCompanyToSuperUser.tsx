import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useProfile } from '../../../utils/useProfile';
import { CustomTable } from '../../organisms';
import { CompaniesContext } from '../../../contexts';
import { FaUndoAlt } from 'react-icons/fa';
import { CustomCard } from '../CustomCard/CustomCard';
import swal from 'sweetalert';

export interface IModalAddCompanyToSuperUserProps {
  handleClose: () => void;
  userName: string;
  companyName: string;
  userCompanies: any[];
  userId: string;
}

export function ModalAddCompanyToSuperUser({
  handleClose,
  userName,
  companyName,
  userCompanies,
  userId
}: IModalAddCompanyToSuperUserProps) {
  const [profile] = useProfile();
  const {
    loadingCompanies,
    companies,
    allCompaniesLoaded,
    getCompanies,
    setAllCompaniesLoaded,
    addSuperUserCompanies
  } = useContext(CompaniesContext);
  const [filteredCompanies, setFilteredCompanies] = useState<any>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<any>([]);

  // Remove the companies that are already assigned to the user
  useEffect(() => {
    const filteredArr = companies.filter(
      (company) => !userCompanies.find(({ id }) => company.id === id)
    );
    setFilteredCompanies(filteredArr);
  }, [companies, userCompanies]);

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

  const columns = [
    {
      dataField: 'name',
      text: 'Empresa',
      sort: true,
      classes: 'lg-column',
      headerClasses: 'lg-column'
    }
  ];

  const actionButtons = [
    {
      onClick: () => setAllCompaniesLoaded(false),
      icon: loadingCompanies ? (
        <Spinner animation="border" size="sm" className="mt-2" />
      ) : (
        <FaUndoAlt />
      ),
      disabled: loadingCompanies
    }
  ];

  const handleAddCompanies = async () => {
    swal({
      title: 'Importante',
      text: 'Estas seguro de agregar estas empresas?',
      icon: 'warning',
      buttons: ['Volver', 'Continuar'],
      dangerMode: true
    })
      .then(async (willCreate) => {
        if (willCreate) {
          const response = await addSuperUserCompanies(selectedCompanies, userId);
          if (response) {
            swal('Perfecto!', 'Empresas asignadas exitosamente!', 'success');
            handleClose();
          }
        }
      })
      .catch(() => {
        swal('Oops!', 'No se pudo agregar las empresas', 'error');

        throw new Error('Error adding companies');
      });
  };

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white text-center">Asignar empresas</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <CustomCard
          subtitle={`Asignar empresas a ${userName}
            de ${companyName}`}
          loading={loadingCompanies}
          actionButtons={actionButtons}
          bodyPadding="0">
          <CustomTable
            keyField="id"
            columns={columns}
            data={filteredCompanies}
            renderSearch
            loading={loadingCompanies}
            showPagination={false}
            paginationSize={10}
            selectionMode="checkbox"
            onSelectRow={(row: any, isSelect: boolean) => {
              //   console.log(row, isSelect);
              if (isSelect) {
                setSelectedCompanies([...selectedCompanies, row.id]);
              } else {
                setSelectedCompanies(selectedCompanies.filter((id) => id !== row.id));
              }
            }}
            hideSelectColumn={false}
          />
        </CustomCard>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" disabled={!selectedCompanies.length} onClick={handleAddCompanies}>
          Asignar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
