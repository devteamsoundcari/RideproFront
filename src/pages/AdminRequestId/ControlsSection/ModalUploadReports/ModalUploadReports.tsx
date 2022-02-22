import React, { useContext } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { SingleRequestContext } from '../../../../contexts';
import SingleDriver from './SingleDriver/SingleDriver';
import { useProfile } from '../../../../utils';
import './ModalUploadReports.scss';

type ModalUploadReportsType = any;

const ModalUploadReports: React.FC<ModalUploadReportsType> = ({ handleClose }) => {
  const { requestDrivers } = useContext(SingleRequestContext);
  const [profile] = useProfile();

  return (
    <Modal size="lg" show={true} onHide={handleClose} className="modal-upload-reports">
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Generar informes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Resultado</th>
              <th>Link</th>
              <th>Informe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requestDrivers.map((driver, idx) => (
              <SingleDriver key={idx} driver={driver} />
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};
export default ModalUploadReports;
