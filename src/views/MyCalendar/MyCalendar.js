import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
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
      // start: new Date("April 17, 2020 03:24:00"),
      // end: new Date("April 17, 2020 23:24:00"),
      start: new Date(2020, 3, 17, 3, 30),
      end: new Date(2020, 3, 17, 5, 30),
      desc: "Prueba conductorres",
      participants: "MihaelSosa",
    },
  ]);

  const handleClick = (event) => {
    console.log(event);
  };

  const handleSelectSlot = (data) => {
    props.selectSlot(data);
    // writeToLocalStorageHere(start);
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
