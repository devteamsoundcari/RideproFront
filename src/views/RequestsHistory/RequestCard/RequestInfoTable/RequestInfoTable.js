import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import InfoForm from "./InfoForm/InfoForm";

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
            <th>Municipio</th>
            <th>Lugar</th>
            <th>Fecha</th>
            <th>Hora</th>
            {props.status.step !== 0 && props.editable && <th>Editar</th>}
          </tr>
        </thead>
        <tbody>
          <InfoForm
            request={props.request}
            startDate={newStartDate}
            time={newStartTime}
            status={props.request.status}
            cls={`infoService_${props.request.id}`}
            editable={props.editable}
          />
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default RequestInfoTable;
