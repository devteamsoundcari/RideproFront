import React, { useEffect, useContext } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RequestsContext } from '../../../contexts';
import './InstructorsSection.scss';

interface InstructorsProps {
  requestId: number;
}

const InstructorsSection: React.FC<InstructorsProps> = ({ requestId }) => {
  const { getRequestInstructors, requestInstructors, loadingInstructors } =
    useContext(RequestsContext);

  const fetchRequestInstructors = async () =>
    await getRequestInstructors(requestId);

  useEffect(() => {
    fetchRequestInstructors();
    //eslint-disable-next-line
  }, [requestId]);

  if (loadingInstructors) {
    return <Spinner animation="border" />;
  }
  return (
    <Table bordered hover size="sm" className="mb-0 instructors-table-admin">
      <thead>
        <tr className="border-0 bg-primary">
          <th className="text-white">ID</th>
          <th className="text-white">Nombre</th>
          <th className="text-white">Apellido</th>
          <th className="text-white">Email</th>
          <th className="text-white">Teléfono</th>
          <th className="text-white">Ciudad</th>
          <th className="text-white">Tarifa</th>
          <th className="text-white">Primer pago</th>
        </tr>
      </thead>
      <tbody>
        {requestInstructors.map((item, idx) => (
          <tr key={idx}>
            <td>{item?.instructors?.official_id}</td>
            <td>{item?.instructors?.first_name}</td>
            <td>{item?.instructors?.last_name}</td>
            <td className="text-primary font-weight-bold">
              {item?.instructors?.email}
            </td>
            <td>{item?.instructors?.cellphone}</td>
            <td>{item?.instructors?.municipality?.name}</td>
            <td>{item?.fare}</td>
            <td>{item?.first_payment}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default InstructorsSection;
