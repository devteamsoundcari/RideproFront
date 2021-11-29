import React, { useState, useEffect, useContext } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import SingleDriver from './SingleDriver/SingleDriver';
import { SingleRequestContext } from '../../../contexts';
import './DriversSection.scss';

interface DriversProps {
  drivers: any;
  status: any;
  requestId: string;
  onUpdate: (x) => void;
}

interface Participant {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
}

type ParticipantsData = Participant[];

const DriversSection: React.FC<DriversProps> = ({
  drivers,
  status,
  requestId,
  onUpdate
}) => {
  const { getRequestDrivers, loadingDrivers } =
    useContext(SingleRequestContext);
  const [participants, setParticipants] = useState<ParticipantsData>([]);

  const fetchDrivers = () => {
    getRequestDrivers(drivers).then((data: any) => {
      if (drivers.length === data.length) {
        setParticipants(data);
      }
    });
  };

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      fetchDrivers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drivers]);

  useEffect(() => {
    onUpdate(participants);
  }, [onUpdate, participants]);

  if (loadingDrivers) {
    return <Spinner animation="border" />;
  }

  return (
    <Table bordered hover size="sm" className="mb-3 participants-table-admin">
      <thead>
        <tr className="border-0 bg-primary">
          <th className="text-white">ID</th>
          <th className="text-white">Nombre</th>
          <th className="text-white">Apellido</th>
          <th className="text-white">Email</th>
          <th className="text-white">Teléfono</th>
          {status > 4 && (
            <React.Fragment>
              <th className="text-white">Resultado</th>
              <th className="text-white">Link</th>
              <th className="text-white">Reporte</th>
            </React.Fragment>
          )}
        </tr>
      </thead>
      <tbody>
        {!loadingDrivers && participants.length ? (
          participants.map((participant, idx) => (
            <SingleDriver data={participant} key={idx} requestId={requestId} />
          ))
        ) : (
          <tr>
            <td>''</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default DriversSection;
