import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { getUserRequests } from "../../controllers/apiRequests";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [requests, setRequests] = useState([]);
  const [events] = useState([
    {
      start: moment().toDate(),
      end: moment().add(1, "days").toDate(),
      title: "Un evento de 2 dias de sde hoy",
    },
    {
      id: 0,
      title: "Prueba conductorres",
      allDay: true,
      start: new Date(2020, 3, 17, 3, 30),
      end: new Date(2020, 3, 17, 5, 30),
      desc: "Prueba conductorres",
      participants: "MihaelSosa",
    },
  ]);

  useEffect(() => {
    console.log("entra");
    async function fetchRequests(url) {
      const response = await getUserRequests(url);
      response.results.forEach(async (item) => {
        setRequests((prev) => [...prev, item]);
      });
      if (response.next) {
        return await fetchRequests(response.next);
      }
    }
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/user_requests/`);
  }, []);

  useEffect(() => {
    if (requests.length) {
      console.log("llegan", requests);
    }
  }, [requests]);

  const handleClick = (event) => {
    console.log("JUEPUTA", event);
  };

  const handleSelectSlot = (data) => {
    // ================= GETTING REQUESTING DATE ====================
    let requestDate = new Date();
    requestDate.setDate(requestDate.getDate() + 1);
    if (data.start <= requestDate) {
      alert("No puedes pedir servicios para esta fecha");
    } else {
      props.selectSlot(data);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Calendar
          selectable
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={events}
          // min={new Date(2020, 10, 0, 10, 0, 0)}
          // max={new Date(2020, 10, 0, 22, 0, 0)}
          // timeslots={8}
          style={{ height: "100vh" }}
          onSelectEvent={(event) => handleClick(event)}
          onSelectSlot={handleSelectSlot}
          messages={{
            next: ">",
            previous: "<",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default MyCalendar;
