import React, { useState, useEffect, Children, useContext } from "react";
import { Card, Spinner } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useHistory } from "react-router-dom";
import { getUserRequests } from "../../controllers/apiRequests";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.scss";
import { AuthContext } from "../../contexts/AuthContext";
require("moment/locale/es.js");

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { userInfoContext } = useContext(AuthContext);

  // const [events] = useState([
  //   {
  //     start: moment().toDate(),
  //     end: moment().add(1, "days").toDate(),
  //     title: "Un evento de 2 dias de sde hoy",
  //   },
  //   {
  //     id: 0,
  //     title: "Prueba conductorres",

  //     start: new Date(2020, 3, 17, 3, 30),
  //     end: new Date(2020, 3, 17, 5, 30),
  //   },
  // ]);

  // =============================== GETTING ALL THE EVENTS AND DISPLAYING THEM TO CALENDAR =============================================

  useEffect(() => {
    let urlType = userInfoContext.profile === 2 ? "user_requests" : "requests";
    async function fetchRequests(url) {
      const response = await getUserRequests(url);
      if (response) {
        response.results.forEach(async (item) => {
          item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
          item.start = new Date(item.start_time);
          item.end = new Date(item.finish_time);
          // if (item.status.step !== 0) { // I was filtering only by no cancelled
          setRequests((prev) => [...prev, item]);
          // }
        });
        if (response.next) {
          return await fetchRequests(response.next);
        }
      }
    }
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/${urlType}/`);
  }, [userInfoContext.profile]);

  useEffect(() => {
    // Sorting requests so that the most recent goes on top
    if (requests.length > 1) {
      requests.sort((a, b) => {
        return a.id - b.id;
      });
      setSortedRequests(requests.reverse());
      // Show and hide spinner
      if (sortedRequests.length > 0) {
        setLoading(false);
      }
    } else {
      setSortedRequests(requests);
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
      state: { id: sortedRequests.findIndex((i) => i.id === event.id) },
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
        newStyle.backgroundColor = "indianred";
        break;
      case 1:
        newStyle.backgroundColor = "lightgreen";
        break;
      default:
        break;
    }
    if (start < now && event.status.step !== 0) {
      newStyle.backgroundColor = "dodgerblue";
    }
    return {
      className: "",
      style: newStyle,
    };
  };

  return (
    <Card>
      <Card.Body>
        {loading && (
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
          events={sortedRequests}
          // min={new Date(2020, 10, 0, 10, 0, 0)}
          // max={new Date(2020, 10, 0, 22, 0, 0)}
          // timeslots={8}
          style={{ height: "100vh" }}
          onSelectEvent={(event) => handleClick(event)}
          // onSelectSlot={handleSelectSlot}
          components={{
            dateCellWrapper: ColoredDateCellWrapper,
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
  );
};

export default MyCalendar;
