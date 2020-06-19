import React from "react";
import { Tabs, Tab, Table, Button } from "react-bootstrap";
import Place from "./Place/Place";
import "./InfoTabs.scss";
import Instructors from "./Instructors/Instructors";

const InfoTabs = (props) => {
  const {
    drivers,
    instructor,
    track,
    municipality,
    fare_track,
    id,
    new_request,
  } = props.request;
  return (
    <div className="infoTabs">
      <Tabs defaultActiveKey="place" id="uncontrolled-tab-example">
        <Tab eventKey="place" title="Lugar">
          <Place
            track={track ? track : ""}
            municipality={municipality}
            fareTrack={fare_track}
            requestId={id}
            newRequest={new_request}
          />
        </Tab>
        <Tab eventKey="participantes" title="Participantes">
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, idx) => (
                <tr key={idx}>
                  <td>{driver.official_id}</td>
                  <td>{driver.first_name}</td>
                  <td>{driver.last_name}</td>
                  <td>{driver.email}</td>
                  <td>{driver.cellphone}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="intructors" title="Instructores">
          <p>{instructor}</p>
          <Instructors />
        </Tab>
        <Tab eventKey="proveedores" title="Proveedores" disabled>
          nada
        </Tab>
      </Tabs>
    </div>
  );
};

export default InfoTabs;
