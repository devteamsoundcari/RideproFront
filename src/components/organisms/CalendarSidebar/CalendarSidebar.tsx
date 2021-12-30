import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { DoughnutChart } from '../../atoms';
import { RequestsContext } from '../../../contexts/';
import { CalendarConventions } from '../../molecules';
import './CalendarSidebar.scss';
import { dateMonthName } from '../../../utils';
interface ICalendarSidebarProps {}

export const CalendarSidebar: React.FunctionComponent<ICalendarSidebarProps> = (props) => {
  const { calendarCount, currentMonth } = useContext(RequestsContext);
  return (
    <div className="calendar-sidebar px-3 py-4 ">
      <div className="mt-4">
        <label className="">Estadisticas de solicitudes</label>
        <DoughnutChart />
      </div>
      <div className="mt-3">
        <label className="">Tipos de solicitud</label>
        <CalendarConventions />
      </div>
      <Card className="mt-3 total-card">
        <Card.Header>Total mes {dateMonthName(currentMonth)}</Card.Header>
        <Card.Body>
          <Card.Title>
            <h3>{calendarCount}</h3>
            TOTAL MES
          </Card.Title>
        </Card.Body>
      </Card>
    </div>
  );
};
