import React, { useState } from "react";
import { Table } from "react-bootstrap";
import EachParticipantForm from "./EachParticipantForm/EachParticipantForm";

const RequestParticipantsTable = (props) => {
  return (
    <React.Fragment>
      <h5>Participantes</h5>
      <Table size="sm" responsive>
        <thead>
          <tr>
            <th>Identificacion</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Telefono</th>
            {props.status.step !== 0 && <th>Editar</th>}
          </tr>
        </thead>
        <tbody>
          {props.drivers.map((driver, index) => {
            const cls = `${driver.official_id}_${props.requestId}`;
            return (
              <EachParticipantForm
                driver={driver}
                cls={cls}
                requestId={props.requestId}
                status={props.status}
                key={index}
              />
            );
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default RequestParticipantsTable;
