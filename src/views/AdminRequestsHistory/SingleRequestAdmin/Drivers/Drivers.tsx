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
      getDrivers(drivers).then((data) => {
        data.forEach((item) =>
          setParticipants((oldArr: any) => [...oldArr, item])
        );
      });
    }
  }, [drivers]);

  return (
    <Table
      responsive
      hover
      size="sm"
      className="table-borderless mb-0 participants-table-admin"
    >
      <thead>
        <tr className="border-0">
          <th>Identificación</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Teléfono</th>
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
