import React, { useState, useEffect, Children, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spinner, Row, Col, ListGroup, Form } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';
import { MdPlace } from 'react-icons/md';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.scss';
// import statusStepFormatter from '../../utils/statusStepFormatter';
// import CalendarConventions from '../../utils/CalendarConventions';
// import { monthNames } from '../../utils/monthNames';
import { calendarEventsFormatter } from '../../../utils';

import { AuthContext, RequestsContext } from '../../../contexts';

require('moment/locale/es.js');

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [displayedRequests, setDisplayedRequests] = useState([]);
  let navigate = useNavigate();
  const {
    calendarRequests,
    cancelledRequests,
    isLoadingCalendarRequests,
    setStartDate,
    setEndDate,
    updateCurrentMonth,
    currentMonth
  } = useContext(RequestsContext);
  const { userInfo } = useContext(AuthContext);
  const [seeCancelledEvents, setSeeCancelledEvents] = useState(false);
  const [withCanceledRequests, setWithCanceledRequests] = useState({});

  // =============================== GETTING ALL THE EVENTS AND DISPLAYING THEM TO CALENDAR =============================================

  useEffect(() => {
    setDisplayedRequests(calendarRequests);
    setWithCanceledRequests(calendarRequests);
    // cancelledRequests.forEach((item) => {
    //   setWithCanceledRequests((prev) => [...prev, item]);
    // });
  }, [calendarRequests, cancelledRequests]);

  //============================================ HANDLING CLICKING ON EVENT ===========================================================

  const handleClick = (event) => {
    navigate('/cliente/historial');
  };

  // ==============================================================================================================================

  const ColoredDateCellWrapper = ({ children, value }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        backgroundColor: value < now ? '#adb5bd' : ''
      }
    });
  };

  const styleEvents = (event, start, end, isSelected) => {
    calendarEventsFormatter(event.status.step, userInfo.profile);
    // const { bgColor, color } = statusStepFormatter(event.status.step, userInfo.profile);
    // let newStyle = {
    //   color: color,
    //   borderRadius: '0px',
    //   border: 'none'
    // };
    // return {
    //   className: bgColor,
    //   style: newStyle
    // };
    return {};
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
    <>
      {isLoadingCalendarRequests && (
        <div>
          {/* {`  Cargando eventos de ${monthNames[new Date(currentMonth).getMonth()]}...`} */}
          <Spinner animation="border" size="sm" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      <Calendar
        selectable
        localizer={localizer}
        //   defaultDate={new Date()}
        //   defaultView="month"
        //   views={{ month: true, day: true }}
        // events={seeCancelledEvents ? withCanceledRequests : displayedRequests}
        events={[]}
        //   date={new Date(currentMonth)}
        style={{ height: 'calc(100vh - 7rem)', width: '80%' }}
        //   onSelectEvent={(event) => handleClick(event)}
        components={{
          dateCellWrapper: ColoredDateCellWrapper,
          event: eventFormatter
        }}
        //   onNavigate={(date) => {
        //     let start = new Date(date.getFullYear(), date.getMonth(), 1)
        //       .toISOString()
        //       .slice(0, -14);
        //     let end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        //       .toISOString()
        //       .slice(0, -14);
        //     setStartDate(start);
        //     setEndDate(end);
        //     updateCurrentMonth(start, end, date);
        //   }}
        eventPropGetter={styleEvents}
        messages={{
          next: 'Siguiente >',
          previous: '< Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        }}
      />
    </>
  );
};

export default MyCalendar;
