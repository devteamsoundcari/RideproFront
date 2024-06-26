import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getRequestProviders } from "../../../../controllers/apiRequests";
import "./Providers.scss";

interface ProvidersProps {
  requestId: number;
  providers: (x: any) => void;
}

interface Department {
  name: string;
}

interface Municipality {
  name: string;
  department: Department;
}

interface Instructor {
  official_id: number;
  name: string;
  last_name: string;
  email: string;
  cellphone: number;
  municipality?: Municipality;
}

interface RequestInstructor {
  fare: number;
  first_payment: number;
  providers?: Instructor;
}

type RequestProviders = RequestInstructor[];

const Providers: React.FC<ProvidersProps> = ({ requestId, providers }) => {
  const [requestProviders, setRequestProviders] = useState<RequestProviders>(
    []
  );

  // // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================

  // const getInstructor = async (driversIds: any) => {
  //   return Promise.all(driversIds.map((id: string) => fetchInstructor(id)));
  // };

  // useEffect(() => {
  //   if (ids && ids.length > 0) {
  //     getInstructor(ids).then((data) => {
  //       data.forEach((item) =>
  //         setProviders((oldArr: any) => [...oldArr, item])
  //       );
  //     });
  //   }
  // }, [ids]);

  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================
  const fetchRequestProviders = async (url) => {
    const response = await getRequestProviders(url);
    response.results.forEach(async (item) => {
      if (item.request === requestId) {
        setRequestProviders((oldArr: any) => [...oldArr, item]);
      }
    });
    if (response.next) {
      return await fetchRequestProviders(response.next);
    }
  };
  useEffect(() => {
    fetchRequestProviders(
      `${process.env.REACT_APP_API_URL}/api/v1/request_prov/?request=${requestId}`
    );
    //eslint-disable-next-line
  }, [requestId]);

  useEffect(() => {
    providers(requestProviders);
    // eslint-disable-next-line
  }, [requestProviders]);

  return (
    <Table bordered hover size="sm" className="mb-0 providers-table-admin">
      <thead>
        <tr className="border-0 bg-primary">
          <th className="text-white">ID</th>
          <th className="text-white">Nombre</th>
          <th className="text-white">Email</th>
          <th className="text-white">Teléfono</th>
          <th className="text-white">Ciudad</th>
          {/* <th>Dpto.</th> */}
          <th className="text-white">Tarifa</th>
          <th className="text-white">Primer pago</th>
        </tr>
      </thead>
      <tbody>
        {requestProviders.map((item, idx) => (
          <tr key={idx}>
            <td>{item?.providers?.official_id}</td>
            <td>{item?.providers?.name}</td>
            <td className="text-primary font-weight-bold">
              {item?.providers?.email}
            </td>
            <td>{item?.providers?.cellphone}</td>
            <td>{item?.providers?.municipality?.name}</td>
            {/* <td>{item?.providers?.municipality?.department?.name}</td> */}
            <td>{item?.fare}</td>
            <td>{item?.first_payment}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default Providers;
