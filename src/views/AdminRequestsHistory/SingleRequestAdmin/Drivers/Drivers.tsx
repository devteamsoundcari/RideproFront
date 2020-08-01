import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { fetchDriver } from "../../../../controllers/apiRequests";
import "./Drivers.scss";

interface DriversProps {
  drivers: any;
}

interface Participant {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
}

type ParticipantsData = Participant[];

const Drivers: React.FC<DriversProps> = ({ drivers }) => {
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
        </tr>
      </thead>
      <tbody>
        {participants?.map((participant, idx) => (
          <tr key={idx}>
            <td>{participant?.official_id}</td>
            <td>{participant?.first_name}</td>
            <td>{participant?.last_name}</td>
            <td className="text-primary font-weight-bold">
              {participant?.email}
            </td>
            <td>{participant?.cellphone}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default Drivers;
