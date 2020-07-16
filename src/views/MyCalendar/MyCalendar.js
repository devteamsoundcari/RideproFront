import React, { useState, useEffect, Children, useContext } from "react";
import { Card, Spinner, Row, Col, ListGroup, Form } from "react-bootstrap";
import { FaDotCircle, FaUsers } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.scss";
import { AuthContext } from "../../contexts/AuthContext";
import { RequestsContext } from "../../contexts/RequestsContext";

require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [requests, setRequests] = useState([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const {
    requestsInfoContext,
    canceledRequestContext,
    loadingContext,
  } = useContext(RequestsContext);
  const { userInfoContext } = useContext(AuthContext);
  const [seeCanceledEvents, setSeeCanceledEvents] = useState(false);
  const [withCanceledRequests, setWithCanceledRequests] = useState({});

  // =============================== GETTING ALL THE EVENTS AND DISPLAYING THEM TO CALENDAR =============================================

  useEffect(() => {
    setRequests(requestsInfoContext);
    setWithCanceledRequests(requestsInfoContext);
    canceledRequestContext.forEach((item) => {
      setWithCanceledRequests((prev) => [...prev, item]);
    });
  }, [requestsInfoContext, canceledRequestContext]);

  useEffect(() => {
    if (requests.length > 1) {
      // Show and hide spinner
      if (requests.length > 0) {
        setLoading(false);
      }
    } else {
      if (requests.length > 0) {
        setLoading(false);
      }
    }
    //eslint-disable-next-line
  }, [requests]);

  //============================================ HANDLING CLICKING ON EVENT ===========================================================

  const handleClick = (event) => {
    history.push({
      pathname: "/cliente/historial",
      state: { event: event },
    });
  };

  // ==============================================================================================================================

  const ColoredDateCellWrapper = ({ children, value }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        backgroundColor: value < now ? "#adb5bd" : "",
      },
    });
  };

  const styleEvents = (event, start, end, isSelected) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let newStyle = {
      backgroundColor: "",
      color: "black",
      borderRadius: "0px",
      border: "none",
    };

    if (userInfoContext.profile === 2) {
      switch (event.status.step) {
        case 0:
          newStyle.backgroundColor = "red";
          newStyle.color = "#f5f5f5";
          break;
        case 1:
          newStyle.backgroundColor = "yellow";
          break;
        case 2:
          newStyle.backgroundColor = "orange";
          break;
        case 3:
          newStyle.backgroundColor = "dodgerblue";
          newStyle.color = "#fff";
          break;
        case 4:
          newStyle.backgroundColor = "dodgerblue";
          newStyle.color = "#fff";
          break;
        case 5:
          newStyle.backgroundColor = "dodgerblue";
          newStyle.color = "#fff";
          break;
        default:
          break;
      }
    } else {
      switch (event.status.step) {
        case 0:
          newStyle.backgroundColor = "red";
          newStyle.color = "#f5f5f5";
          break;
        case 1:
          newStyle.backgroundColor = "yellow";
          break;
        case 2:
          newStyle.backgroundColor = "orange";
          break;
        case 3:
          newStyle.backgroundColor = "dodgerblue";
          newStyle.color = "#fff";
          break;
        case 4:
          newStyle.backgroundColor = "mediumslateblue";
          newStyle.color = "#fff";
          break;
        case 5:
          newStyle.backgroundColor = "lightgreen";
          break;
        default:
          break;
      }
    }
    return {
      className: "",
      style: newStyle,
    };
  };

  const eventFormatter = (event) => {
    const { service, municipality, drivers } = event.event;
    return (
      <div className="event-formated">
        <h5>{service.name}</h5>
        <div className="event-details">
          <p>
            <span className="mr-1">
              <FaUsers />
            </span>
            {drivers.length}
          </p>
          <p className="ml-1">
            <span>
              <MdPlace />
            </span>
            {municipality.name.toLowerCase()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Row className="calendarSection ml-1 mr-1 overflow-auto">
      <Col md={2} className="conventions">
        <ListGroup>
          {userInfoContext.profile === 2 ? (
            <React.Fragment>
              <ListGroup.Item>
                <FaDotCircle className="text-event-requested" />{" "}
                <small>SERVICIOS SOLICITADOS</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-confirm-event" />{" "}
                <small>CONFIRMAR SERVICIO</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-event-confirmed" />{" "}
                <small>SERVICIO PROGRAMADO</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-event-finished" />{" "}
                <small>SERVICIO TERMINADO</small>
              </ListGroup.Item>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ListGroup.Item>
                <FaDotCircle className="text-event-requested" />{" "}
                <small>ESPERANDO CONFIRMACIÓN</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-confirm-event" />{" "}
                <small>ESPERANDO AL CLIENTE</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-event-confirmed" />{" "}
                <small>PROGRAMACIÓN ACEPATADA</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-confirm-docs" />{" "}
                <small>CONFIRMAR DOCUMENTOS</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaDotCircle className="text-event-finished" />{" "}
                <small>FINALIZADO</small>
              </ListGroup.Item>
            </React.Fragment>
          )}
          <ListGroup.Item>
            <Form.Check
              custom
              type="checkbox"
              id="custom-checkbox"
              label="VER SOLICITUDES CANCELADAS"
              onClick={() => setSeeCanceledEvents(!seeCanceledEvents)}
            />
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={10} className="eventsCalendar pl-0">
        <Card>
          <Card.Body>
            {loadingContext && (
              <div>
                Cargando Eventos...
                <Spinner animation="border" size="sm" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            )}
            <Calendar
              selectable
              localizer={localizer}
              defaultDate={new Date()}
              defaultView="month"
              views={{ month: true }}
              events={seeCanceledEvents ? withCanceledRequests : requests}
              style={{ height: "100vh" }}
              onSelectEvent={(event) => handleClick(event)}
              components={{
                dateCellWrapper: ColoredDateCellWrapper,
                event: eventFormatter,
              }}
              eventPropGetter={styleEvents}
              messages={{
                next: "Siguiente >",
                previous: "< Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
              }}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MyCalendar;
