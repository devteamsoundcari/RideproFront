import React, { useState, useEffect, useContext } from "react";
import { Col, Card, Row, Button, Tabs, Tab } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./SolicitarServicio.scss";
import { FaArrowCircleLeft } from "react-icons/fa";
import SetDate from "./SetDate/SetDate";
import SetService from "./SetService/SetService";
import SetPlace from "./SetPlace/SetPlace";
import SetParticipants from "./SetParticipants/SetParticipants";
import { ServiceContext } from "../../contexts/ServiceContext";
import ConfirmServiceModal from "./ConfirmServiceModal/ConfrimServiceModal";

const SolicitarServicio = (props) => {
  const { setServiceInfoContext } = useContext(ServiceContext);
  const [key, setKey] = useState("paso1");
  const [date, setDate] = useState("");
  const [service, setService] = useState("");
  const [place, setPlace] = useState("");
  const [participants, setParticipants] = useState([]);
  const [rides, setRides] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // =========================== HANDLING SERVICE ============================
  const handleService = (data) => {
    if (service) {
      setService("");
    }
    setService(data);
  };
  useEffect(() => {
    if (service) {
      setServiceInfoContext(service);
      setKey("paso2");
    }
    //eslint-disable-next-line
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

  // =========================== HANDLING PARTICIPANTS AND SUBMITING THE SERVICE ============================

  const handleParticipants = (people, rides) => {
    if (participants) {
      setParticipants([]);
    }
    if (rides) {
      setRides([]);
    }
    setRides(rides);
    setParticipants(people);
  };
  useEffect(() => {
    if (participants.length) {
      // create new service
      setShowModal(true);
    }
  }, [participants]);

  return (
    <Row>
      <Col>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">Solicitar un servicio</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2"></div>
          </div>
        </div>
        <Card className="solicitarServicio">
          <Card.Body>
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
                <SetDate date={new Date()} setDate={handleDate} />
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
                <SetParticipants setParticipants={handleParticipants} />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Col>
      <ConfirmServiceModal
        show={showModal}
        setShow={(e) => setShowModal(e)}
        service={service}
        date={date}
        place={place}
        participants={participants}
        rides={rides}
      />
    </Row>
  );
};

export default SolicitarServicio;
