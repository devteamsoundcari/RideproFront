import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getRequestInstructors } from "../../../../controllers/apiRequests";
import "./Instructors.scss";

interface InstructorsProps {
  requestId: number;
  instructors: (x: any) => void;
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
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
  municipality?: Municipality;
}

interface RequestInstructor {
  fare: number;
  first_payment: number;
  instructors?: Instructor;
}

type RequestInstructors = RequestInstructor[];

const Instructors: React.FC<InstructorsProps> = ({
  requestId,
  instructors,
}) => {
  const [requestInstructors, setRequestInstructors] = useState<
    RequestInstructors
  >([]);

  // // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================

  // const getInstructor = async (driversIds: any) => {
  //   return Promise.all(driversIds.map((id: string) => fetchInstructor(id)));
  // };

  // useEffect(() => {
  //   if (ids && ids.length > 0) {
  //     getInstructor(ids).then((data) => {
  //       console.log(data);
  //       data.forEach((item) =>
  //         setInstructors((oldArr: any) => [...oldArr, item])
  //       );
  //     });
  //   }
  // }, [ids]);

  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================
  const fetchRequestInstructors = async (url) => {
    const response = await getRequestInstructors(url);
    response.results.forEach(async (item) => {
      if (item.request === requestId) {
        setRequestInstructors((oldArr: any) => [...oldArr, item]);
      }
    });
    if (response.next) {
      return await fetchRequestInstructors(response.next);
    }
  };
  useEffect(() => {
    fetchRequestInstructors(
      `${process.env.REACT_APP_API_URL}/api/v1/request_ins/`
    );
    //eslint-disable-next-line
  }, [requestId]);

  useEffect(() => {
    instructors(requestInstructors);
    // eslint-disable-next-line
  }, [requestInstructors]);

  return (
    <Table
      responsive
      hover
      size="sm"
      className="table-borderless mb-0 instructors-table-admin"
    >
      <thead>
        <tr className="border-0">
          <th>Identificación</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Ciudad</th>
          {/* <th>Dpto.</th> */}
          <th>Tarifa</th>
          <th>Viaticos</th>
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
            {/* <td>{item?.instructors?.municipality?.department?.name}</td> */}
            <td>{item?.fare}</td>
            <td>{item?.first_payment}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default Instructors;
