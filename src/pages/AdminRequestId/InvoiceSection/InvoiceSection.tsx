import React, { useEffect, useContext } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { SingleRequestContext } from '../../../contexts/';

type InvoiceProps = any;

const InvoiceSection: React.FC<InvoiceProps> = () => {
  const { requestBills, loadingBills, getRequestBills } =
    useContext(SingleRequestContext);

  const fetchBills = async () => await getRequestBills();

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line
  }, []);

  if (loadingBills) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="mx-md-25 text-center pl-3 pr-3 mb-3">
      <h6>Factura</h6>
      <Table bordered hover size="sm" className="mb-0 instructors-table-admin">
        <thead>
          <tr className="border-0 bg-primary">
            <th className="text-white">Factura #</th>
            <th className="text-white">Facturado a</th>
            <th className="text-white">Observaciones</th>
            <th className="text-white">Archivo</th>
          </tr>
        </thead>
        <tbody>
          {requestBills?.map((item, idx) => (
            <tr key={idx}>
              <td>{item?.bill_id}</td>
              <td>{item?.description}</td>
              <td>{item?.notes !== 'undefined' ? item?.notes : 'na'}</td>
              <td>
                {item?.file ? (
                  <a href={item?.file} target="n_blank">
                    Link
                  </a>
                ) : (
                  'na'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default InvoiceSection;
