import React, { useState, useEffect, useContext } from "react";
import { Modal, Table } from "react-bootstrap";

import { fetchDriver } from "../../../../controllers/apiRequests";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./ModalUploadReports.scss";
import SingleParticipant from "./SingleParticipant";

type ModalUploadReportsType = any;

interface Participant {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
}

interface File {
  id: string;
  file: any;
}

type Files = File[];
type ParticipantsData = Participant[];

const ModalUploadReports: React.FC<ModalUploadReportsType> = ({
  handleClose,
  drivers,
  requestId,
  onUpdate,
}) => {
  const { userInfoContext } = useContext(AuthContext);
  // const { SearchBar } = Search;
  const [participants, setParticipants] = useState<ParticipantsData>([]);

  const handleUpdate = () => onUpdate();

  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================

  const getDrivers = async (driversIds: any) => {
    return Promise.all(driversIds.map((id: string) => fetchDriver(id)));
  };

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      getDrivers(drivers).then((data) => {
        let oldArr: any = [];
        data.forEach((item: any) => {
          item.result = "---";
          item.url = "---";
          oldArr.push(item);
        });
        setParticipants(oldArr);
      });
    }
  }, [drivers]);

  return (
    <Modal
      size="lg"
      show={true}
      onHide={handleClose}
      className="modal-upload-reports"
    >
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
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
            {participants.map((driver, idx) => (
              <SingleParticipant
                key={idx}
                data={driver}
                requestId={requestId}
                onUpdate={() => handleUpdate()}
              />
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};
export default ModalUploadReports;
