import React, { useEffect, useContext, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import SingleDriver from './SingleDriver/SingleDriver';
import { SingleRequestContext } from '../../../contexts';
import './DriversSection.scss';

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

const DriversSection: React.FC<DriversProps> = ({ drivers, status, requestId }) => {
  const { getRequestDrivers, loadingDrivers, requestDrivers, requestDriversReports } =
    useContext(SingleRequestContext);
  const [showExtraColumns, setShowExtraColumns] = useState(false);

  useEffect(() => {
    setShowExtraColumns(requestDriversReports.filter((item) => item?.file !== null).length);
  }, [requestDriversReports]);

  const fetchDrivers = async () => await getRequestDrivers(drivers);

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      fetchDrivers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drivers]);

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
          {status > 4 || showExtraColumns ? (
            <>
              <th className="text-white">Resultado</th>
              <th className="text-white">Link</th>
              <th className="text-white">Reporte</th>
            </>
          ) : (
            ''
          )}
        </tr>
      </thead>
      <tbody>
        {!loadingDrivers && requestDrivers.length ? (
          requestDrivers.map((participant, idx) => (
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
