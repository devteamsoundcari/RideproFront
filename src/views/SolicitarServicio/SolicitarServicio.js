import React, { useState, useEffect, useContext } from "react";
import { Col, Card, Row, Tabs, Tab } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./SolicitarServicio.scss";
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
  const [rides, setRides] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // =========================== HANDLING SERVICE ============================
  const handleService = (data) => {
    if (service) {
      setService("");
    }
    setService(data);
    setKey("paso2");
  };
  useEffect(() => {
    if (service) {
      setServiceInfoContext(service);
      setKey("paso2");
    }
    //eslint-disable-next-line
  }, [service]);

  // =========================== HANDLING PLACE ============================
  const handlePlace = (data) => {
    if (place) {
      setPlace("");
    }
    setPlace(data);
    console.log(data);
  };
  useEffect(() => {
    if (place) {
      setKey("paso3");
    }
  }, [place]);

  // =========================== HANDLING DATE ============================
  const handleDate = (data) => {
    if (date) {
      setDate("");
    }
    setDate(data);
  };

  const goToParticipantSelection = () => {
    setKey("paso4");
  }

  // =========================== HANDLING PARTICIPANTS AND SUBMITING THE SERVICE ============================

  const handleParticipants = (rides) => {
    if (rides) {
      setRides([]);
    }
    setRides(rides);
    setShowModal(true);
  };

  return (
    <Row>
      <Col>
        {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">Solicitar un servicio</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2"></div>
          </div>
        </div> */}
        <Card className="solicitarServicio">
          <Card.Body>
            <Tabs
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="nav-tabs-steps"
            >
              <Tab
                eventKey="paso1"
                title={
                  <p>
                    <span>1</span> Seleccionar servicio
                  </p>
                }
              >
                <SetService setService={handleService} />
              </Tab>
              <Tab
                eventKey="paso2"
                title={
                  <p>
                    <span>2</span> Seleccionar lugar
                  </p>
                }
                disabled={service ? false : true}
              >
                <SetPlace setPlace={handlePlace} />
              </Tab>
              <Tab
                eventKey="paso3"
                title={
                  <p>
                    <span>3</span> Seleccionar fecha
                  </p>
                }
                disabled={date ? false : true}
              >
                {place && <SetDate setDate={handleDate} afterSubmit={goToParticipantSelection} place={place}/>}
              </Tab>
              <Tab
                eventKey="paso4"
                title={
                  <p>
                    <span>4</span> Participantes
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
      {showModal && (
        <ConfirmServiceModal
          show={true}
          setShow={(e) => setShowModal(e)}
          service={service}
          date={date}
          place={place}
          rides={rides}
        />
      )}
    </Row>
  );
};

export default SolicitarServicio;
