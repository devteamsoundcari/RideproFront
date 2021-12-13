import React, { useEffect, useContext } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { SingleRequestContext } from '../../../contexts/SingleRequestContext';
import './ProvidersSection.scss';

const ProvidersSection = ({ requestId }) => {
  const { requestProviders, getRequestProviders, loadingInstructors } =
    useContext(SingleRequestContext);

  const fetchRequestProviders = async () => await getRequestProviders(requestId);

  useEffect(() => {
    fetchRequestProviders();
    //eslint-disable-next-line
  }, [requestId]);

  if (loadingInstructors) {
    return <Spinner animation="border" />;
  }
  return (
    <Table bordered hover size="sm" className="mb-0 providers-table-admin">
      <thead>
        <tr className="border-0 bg-primary">
          <th className="text-white">ID</th>
          <th className="text-white">Nombre</th>
          <th className="text-white">Email</th>
          <th className="text-white">Teléfono</th>
          <th className="text-white">Ciudad</th>
          <th className="text-white">Tarifa</th>
          <th className="text-white">Primer pago</th>
        </tr>
      </thead>
      <tbody>
        {requestProviders.map((item, idx) => (
          <tr key={idx}>
            <td>{item?.providers?.official_id}</td>
            <td className="text-capitalize">{item?.providers?.name}</td>
            <td className="text-primary font-weight-bold">{item?.providers?.email}</td>
            <td>{item?.providers?.cellphone}</td>
            <td className="text-capitalize">{item?.providers?.municipality?.name}</td>
            <td className="tarifa-cell">{Number(item?.fare).toLocaleString('es')}</td>
            <td className="tarifa-cell">{Number(item?.first_payment).toLocaleString('es')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default ProvidersSection;
