import React, { useState, useEffect, Children, useContext } from "react";
import { Card, Spinner, Row, Col, ListGroup, Form } from "react-bootstrap";
import { FaDotCircle, FaUsers } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.scss";
// import { AuthContext } from "../../contexts/AuthContext";
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

  //============================================ HANDLING CLICKING ON SLOT ===========================================================

  // const handleSelectSlot = (data) => {
  //   // ================= GETTING REQUESTING DATE ====================
  //   let requestDate = new Date();
  //   requestDate.setDate(requestDate.getDate() + 1);
  //   if (data.start <= requestDate) {
  //     alert("No puedes pedir servicios para esta fecha");
  //   } else {
  //     props.selectSlot(data);
  //   }
  // };

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
      default:
        break;
    }
    // if (start < now && event.status.step !== 0) {
    //   newStyle.backgroundColor = "dodgerblue";
    // }
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
        {/* <Button
          variant="primary"
          block
          className="mb-3 mt-3"
          disabled={userInfoContext.profile !== 2 ? true : false}
        >
          SOLICITAR
        </Button> */}
        <ListGroup>
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
          <ListGroup.Item>
            <Form.Check
              custom
              type="checkbox"
              id="custom-checkbox"
              label="VER SERVICIOS CANCELADOS"
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
              // min={new Date(2020, 10, 0, 10, 0, 0)}
              // max={new Date(2020, 10, 0, 22, 0, 0)}
              // timeslots={8}
              style={{ height: "100vh" }}
              onSelectEvent={(event) => handleClick(event)}
              // onSelectSlot={handleSelectSlot}
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
