import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getUsers } from "../../../../controllers/apiRequests";
type InvoiceProps = any;
const Invoice: React.FC<InvoiceProps> = ({ data }) => {
  const [invoces, setInvoices] = useState<any>([]);

  const fetchBills = async (url) => {
    let oldArr: any = [];
    const response = await getUsers(url);
    response.results.forEach((cpny: any) => oldArr.push(cpny));
    console.log(oldArr);
    setInvoices(oldArr);
    if (response.next) {
      return await fetchBills(response.next);
    }
  };
  useEffect(() => {
    fetchBills(`${process.env.REACT_APP_API_URL}/api/v1/bills/`);
    // eslint-disable-next-line
  }, []);

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
          {invoces.map((item, idx) => (
            <tr key={idx}>
              <td>{item?.bill_id}</td>
              <td>{item?.description}</td>
              <td>{item?.notes !== "undefined" ? item?.notes : "na"}</td>
              <td>
                {item?.file ? (
                  <a href={item?.file} target="n_blank">
                    Link
                  </a>
                ) : (
                  "na"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default Invoice;
