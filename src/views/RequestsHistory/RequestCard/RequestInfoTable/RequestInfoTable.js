import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import { FaPenSquare } from "react-icons/fa";

const RequestInfoTable = (props) => {
  const newStartDate = new Date(props.request.start_time).toLocaleDateString();
  const newStartTime = new Date(props.request.start_time).toLocaleTimeString();
  return (
    <React.Fragment>
      <h5>Detalle</h5>
      <Table size="sm">
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>Lugar</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {props.request.municipality.name} (
              {props.request.municipality.department.name})
            </td>
            <td>{props.request.place}</td>
            <td>{newStartDate}</td>
            <td>{newStartTime}</td>
            <td>
              <FaPenSquare />
            </td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default RequestInfoTable;
