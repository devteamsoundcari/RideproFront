import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { fetchDriver } from "../../../../controllers/apiRequests";
import "./Drivers.scss";
import SingleDriver from "./SingleDriver";

interface DriversProps {
  drivers: any;
  status: any;
  requestId: string;
}

interface Participant {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
}

type ParticipantsData = Participant[];

const Drivers: React.FC<DriversProps> = ({ drivers, status, requestId }) => {
  const [participants, setParticipants] = useState<ParticipantsData>([]);

  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================

  const getDrivers = async (driversIds: any) => {
    return Promise.all(driversIds.map((id: string) => fetchDriver(id)));
  };

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      getDrivers(drivers).then((data: any) => {
        setParticipants(data);
      });
    }
  }, [drivers]);

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
        {participants?.map((participant, idx) => (
          <SingleDriver
            data={participant}
            key={idx}
            requestId={requestId}
            status={status}
          />
        ))}
      </tbody>
    </Table>
  );
};
export default Drivers;
