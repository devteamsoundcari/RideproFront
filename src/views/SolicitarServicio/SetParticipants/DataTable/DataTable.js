import React, { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { ParticipantsContext } from "../../../../contexts/ParticipantsContext";

const DataTable = (props) => {
  const [data, setData] = useState([]);
  const { allParticipantsInfoContext } = useContext(ParticipantsContext);

  const handleClick = (participant, idx) => {
    const temp = [...data];
    temp.splice(idx, 1);
    setData(() => temp);
    props.deletedItem(participant);
  };

  useEffect(() => {
    props.registeredParticipants(data);
    //eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (props.data.length > 0) {
      setData((oldArr) => [...oldArr, props.data[props.data.length - 1]]);
    }
  }, [props.data]);

  return (
    <React.Fragment>
      <h5>Participantes previamente registrados</h5>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Identificación</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((participant, idx) => {
            return (
              <tr key={idx}>
                <td>{participant.official_id}</td>
                <td>{participant.first_name}</td>
                <td>{participant.last_name}</td>
                <td>{participant.email}</td>
                <td>{participant.cellphone}</td>
                <td>
                  <span onClick={() => handleClick(participant, idx)}>
                    <FaTimesCircle />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default DataTable;
