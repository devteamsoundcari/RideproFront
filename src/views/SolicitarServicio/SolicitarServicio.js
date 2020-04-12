import React, { useState, useEffect } from "react";
import { Col, Card, Row, Button, Tabs, Tab } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./SolicitarServicio.scss";
import { FaArrowCircleLeft } from "react-icons/fa";
import SetDate from "./SetDate/SetDate";
import SetService from "./SetService/SetService";
import SetPlace from "./SetPlace/SetPlace";
import SetParticipants from "./SetParticipants/SetParticipants";

const SolicitarServicio = (props) => {
  const [key, setKey] = useState("paso1");
  const [date, setDate] = useState("");
  const [service, setService] = useState("");
  const [place, setPlace] = useState("");

  // =========================== HANDLING SERVICE ============================
  const handleService = (data) => {
    if (service) {
      setService("");
    }
    setService(data);
  };
  useEffect(() => {
    if (service) {
      setKey("paso2");
    }
  }, [service]);

  // =========================== HANDLING DATE ============================
  const handleDate = (data) => {
    if (date) {
      setDate("");
    }
    setDate(data);
  };
  useEffect(() => {
    if (date) {
      setKey("paso3");
    }
  }, [date]);

  // =========================== HANDLING PLACE ============================
  const handlePlace = (data) => {
    if (place) {
      setPlace("");
    }
    setPlace(data);
  };
  useEffect(() => {
    if (place) {
      setKey("paso4");
    }
  }, [place]);

  return (
    <Row>
      <Col>
        <Button variant="link" onClick={props.selectSlot}>
          <FaArrowCircleLeft /> Volver
        </Button>
        <Card className="solicitarServicio">
          <Card.Body>
            <Card.Header as="h5">Solicitar un Servicio</Card.Header>
            <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
              <Tab
                eventKey="paso1"
                title={
                  <p>
                    <span>1</span> Seleccionar Servicio
                  </p>
                }
              >
                <SetService setService={handleService} />
              </Tab>
              <Tab
                eventKey="paso2"
                title={
                  <p>
                    <span>2</span> Seleccionar Fecha
                  </p>
                }
                disabled={service ? false : true}
              >
                <SetDate date={props.eventDate.start} setDate={handleDate} />
              </Tab>
              <Tab
                eventKey="paso3"
                title={
                  <p>
                    <span>3</span> Seleccionar Lugar
                  </p>
                }
                disabled={date ? false : true}
              >
                <SetPlace setPlace={handlePlace} />
              </Tab>
              <Tab
                eventKey="paso4"
                title={
                  <p>
                    <span>4</span> Agregar Participantes
                  </p>
                }
                disabled={place ? false : true}
              >
                <SetParticipants />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SolicitarServicio;
