import React, { useState, useEffect, Children, useContext } from "react";
import { Card, Spinner, Row, Col, ListGroup, Form } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.scss";
import { AuthContext } from "../../contexts/AuthContext";
import { RequestsContext } from "../../contexts/RequestsContext";
import statusStepFormatter from "../../utils/statusStepFormatter";
import CalendarConventions from "../../utils/CalendarConventions";
import { monthNames } from "../../utils/monthNames";

require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const history = useHistory();
  const {
    requests,
    cancelledRequests,
    isLoadingRequests,
    setStartDate,
    setEndDate,
    setCurrentMonth,
    currentMonth,
  } = useContext(RequestsContext);
  const { userInfoContext } = useContext(AuthContext);
  const [seeCancelledEvents, setSeeCancelledEvents] = useState(false);
  const [withCanceledRequests, setWithCanceledRequests] = useState({});

  // =============================== GETTING ALL THE EVENTS AND DISPLAYING THEM TO CALENDAR =============================================

  useEffect(() => {
    setDisplayedRequests(requests);
    setWithCanceledRequests(requests);
    cancelledRequests.forEach((item) => {
      setWithCanceledRequests((prev) => [...prev, item]);
    });
  }, [requests, cancelledRequests]);

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
    const { bgColor, color } = statusStepFormatter(
      event.status.step,
      userInfoContext.profile
    );
    let newStyle = {
      color: color,
      borderRadius: "0px",
      border: "none",
    };
    return {
      className: bgColor,
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
    <Row className="calendarSection ml-1 mr-1 mb-4 overflow-auto">
      <Col md={2} className="conventions">
        <ListGroup>
          <CalendarConventions />
          <ListGroup.Item>
            <Form.Check
              custom
              type="checkbox"
              id="custom-checkbox"
              label="VER SOLICITUDES CANCELADAS"
              onClick={() => setSeeCancelledEvents(!seeCancelledEvents)}
            />
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={10} className="eventsCalendar pl-0">
        <Card>
          <Card.Body>
            {isLoadingRequests && (
              <div>
                {`  Cargando eventos de ${
                  monthNames[new Date(currentMonth).getMonth()]
                }...`}
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
              views={{ month: true, day: true }}
              events={
                seeCancelledEvents ? withCanceledRequests : displayedRequests
              }
              date={new Date(currentMonth)}
              style={{ height: "100vh" }}
              onSelectEvent={(event) => handleClick(event)}
              components={{
                dateCellWrapper: ColoredDateCellWrapper,
                event: eventFormatter,
              }}
              onNavigate={(date) => {
                let start = new Date(date.getFullYear(), date.getMonth(), 1)
                  .toISOString()
                  .slice(0, -14);
                let end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
                  .toISOString()
                  .slice(0, -14);
                setStartDate(start);
                setEndDate(end);
                setCurrentMonth(date);
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
