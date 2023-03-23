import React, { Children, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { MdPlace } from 'react-icons/md';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.scss';
import { calendarEventsFormatter } from '../../../utils';
import { AuthContext, RequestsContext } from '../../../contexts';

require('moment/locale/es.js');

const localizer = momentLocalizer(moment);

export const MyCalendar = () => {
  const { calendarRequests, setStartDate, setEndDate, updateCurrentMonth, currentMonth } =
    useContext(RequestsContext);
  const { userInfo } = useContext(AuthContext) as any;

  const ColoredDateCellWrapper = ({ children, value }) => {
    const now = moment().toDate();
    now.setHours(0, 0, 0, 0);
    return React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        backgroundColor: value < now ? '#adb5bd' : ''
      }
    });
  };

  const styleEvents = (event) => {
    const { variant, color } = calendarEventsFormatter(event?.status?.step, userInfo.profile);
    let newStyle = {
      color,
      borderRadius: '0px',
      border: 'none'
    };
    return {
      className: `bg-${variant}`,
      style: newStyle
    };
  };

  const eventFormatter = (event) => {
    const { service, municipality, drivers, id } = event.event;
    return (
      <Link to={`/historial/${id}`} style={{ color: 'unset' }}>
        <div className="event-formatted">
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
      </Link>
    );
  };

  return (
    <Calendar
      selectable
      localizer={localizer}
      defaultDate={moment().toDate()}
      defaultView="month"
      views={{ month: true, day: true }}
      events={calendarRequests || []}
      date={moment(currentMonth).toDate()}
      style={{ height: 'calc(100vh - 7rem)', width: '80%' }}
      components={{
        dateCellWrapper: ColoredDateCellWrapper,
        event: eventFormatter
      }}
      onNavigate={(date) => {
        const start = moment(date).startOf('month').format('YYYY-MM-DD');
        const end = moment(date).endOf('month').format('YYYY-MM-DD');
        setStartDate(start);
        setEndDate(end);
        updateCurrentMonth(start, end, date);
      }}
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
  );
};
