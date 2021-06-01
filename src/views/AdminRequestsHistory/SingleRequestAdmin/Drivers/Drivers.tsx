import React, { useState, useEffect, useContext } from 'react';
import { Table } from 'react-bootstrap';
import { fetchDriver } from '../../../../controllers/apiRequests';
import './Drivers.scss';
import SingleDriver from './SingleDriver';
import { ReportsContext } from '../../../../contexts/ReportsContext';

interface DriversProps {
  drivers: any;
  status: any;
  requestId: string;
  onUpdate: (x) => void;
  allReportsOk: (x) => void;
}

interface Participant {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
}

type ParticipantsData = Participant[];

const Drivers: React.FC<DriversProps> = ({
  drivers,
  status,
  requestId,
  onUpdate,
  allReportsOk
}) => {
  const [participants, setParticipants] = useState<ParticipantsData>([]);
  const { reportsInfoContext } = useContext(ReportsContext);
  const [loading, setLoading] = useState(false);

  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================

  const getDrivers = async (driversIds: any) => {
    return Promise.all(driversIds.map(fetchDriver));
  };

  const fetchDrivers = () => {
    setLoading(true);
    getDrivers(drivers).then((data: any) => {
      if (drivers.length === data.length) {
        setParticipants(data);
        setLoading(false);
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
    // eslint-disable-next-line
  }, [participants]);

  useEffect(() => {
    if (participants.length === reportsInfoContext.length) {
      allReportsOk(true);
    } else {
      allReportsOk(false);
    }
  }, [reportsInfoContext, participants, allReportsOk]);

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
        {!loading &&
          participants.length &&
          participants.map((participant, idx) => (
            <SingleDriver data={participant} key={idx} requestId={requestId} />
          ))}
      </tbody>
    </Table>
  );
};
export default Drivers;
