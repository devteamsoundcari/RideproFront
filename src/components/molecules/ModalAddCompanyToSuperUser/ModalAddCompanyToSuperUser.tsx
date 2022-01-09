import React, { useContext } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useProfile } from '../../../utils/useProfile';
import { CustomTable } from '../../organisms';
import { CompaniesContext } from '../../../contexts';

export interface IModalAddCompanyToSuperUserProps {
  handleClose: () => void;
  userName: string;
  companyName: string;
}

export function ModalAddCompanyToSuperUser({
  handleClose,
  userName,
  companyName
}: IModalAddCompanyToSuperUserProps) {
  const [profile] = useProfile();
  const { loadingCompanies, companies } = useContext(CompaniesContext);
  const columns = [
    {
      dataField: 'name',
      text: 'Empresa',
      sort: true,
      classes: 'lg-column',
      headerClasses: 'lg-column'
    }
  ];

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white text-center">
          Asignar empresas a {userName} de {companyName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <CustomTable
          keyField="id"
          columns={columns}
          data={companies}
          renderSearch
          loading={loadingCompanies}
          showPagination={false}
          paginationSize={10}
          selectionMode="checkbox"
          onSelectRow={(row: any, isSelect: boolean) => {
            console.log(row, isSelect);
          }}
          hideSelectColumn={false}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary">Asignar</Button>
      </Modal.Footer>
    </Modal>
  );
}
