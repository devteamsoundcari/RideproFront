import React from 'react';
import { Card } from 'react-bootstrap';
import { DoughnutChart } from '../../atoms';
import { CalendarConventions } from '../../molecules';
import './CalendarSidebar.scss';
interface ICalendarSidebarProps {}

export const CalendarSidebar: React.FunctionComponent<ICalendarSidebarProps> = (props) => {
  return (
    <div className="calendar-sidebar px-3 py-4 mt-4">
      <div className="">
        <label className="">Estadisticas de solicitudes</label>
        <DoughnutChart />
      </div>
      <div className="mt-3">
        <label className="">Tipos de solicitud</label>
        <CalendarConventions />
      </div>
      <Card className="mt-3 total-card">
        <Card.Header>Total mes Diciembre</Card.Header>
        <Card.Body>
          <Card.Title>
            <h3>29.931</h3>
            TOTAL MES
          </Card.Title>
        </Card.Body>
      </Card>
    </div>
  );
};
