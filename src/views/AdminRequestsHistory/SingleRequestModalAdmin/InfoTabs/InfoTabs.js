import React from "react";
import { Tabs, Tab, Table, Button } from "react-bootstrap";
import Place from "./Place/Place";
import "./InfoTabs.scss";

const InfoTabs = (props) => {
  const { drivers, instructor, track, municipality } = props.request;
  return (
    <div className="infoTabs">
      <Tabs defaultActiveKey="place" id="uncontrolled-tab-example">
        <Tab eventKey="place" title="Lugar">
          <Place track={track ? track : ""} municipality={municipality} />
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
                  <td>
                    <Button variant="danger" size="sm">
                      Borrar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="intructors" title="Instructores">
          <p>{instructor}</p>
          {/* <Table responsive hover size="sm">
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
          </Table> */}
        </Tab>
        <Tab eventKey="proveedores" title="Proveedores" disabled>
          nada
        </Tab>
      </Tabs>
    </div>
  );
};

export default InfoTabs;
