import React from "react";
import {
  Modal,
  Button,
  ProgressBar,
  Table,
  Row,
  Col,
  Container,
} from "react-bootstrap";

const SingleRequestModal = (props) => {
  const {
    service,
    municipality,
    status,
    track,
    start,
    spent_credit,
    drivers,
  } = props.selectedRow;

  const renderStatus = () => {
    switch (status.step) {
      case 1:
        return (
          <div className="text-center">
            <small>Esperando confirmación</small>
            <ProgressBar variant="danger" now={20} label={`${60}%`} srOnly />
          </div>
        );
      case 2:
        return <ProgressBar now={80} label={`${80}%`} srOnly />;
      default:
        return <p>Undefined</p>;
    }
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header className="align-items-center">
        <div>
          <h4 className="mb-0">{service.name}</h4>
          <p className="mb-0 mt-1">
            {municipality.name.charAt(0).toUpperCase() +
              municipality.name.slice(1).toLowerCase()}
            {" - "}
            {municipality.department.name}
          </p>
        </div>
        <div>{renderStatus()}</div>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={6}>
              <ul className="list-unstyled">
                <li>
                  Lugar:{" "}
                  {track ? (
                    track.name
                  ) : (
                    <small>Pista Ridepro (Pendiente)</small>
                  )}
                </li>
                <li>Hora: {formatAMPM(start)}</li>
                <li>Rides gastados: {spent_credit}</li>
              </ul>
            </Col>
            <Col md={6}>
              <p>Observaciones:</p>
            </Col>
          </Row>
          <hr />
          <Row>
            {status.step !== 1 && (
              <React.Fragment>
                <h6>Instructores</h6>
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
              </React.Fragment>
            )}
            <h6>Participantes</h6>
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
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger">Cancelar solicitud</Button>
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SingleRequestModal;
