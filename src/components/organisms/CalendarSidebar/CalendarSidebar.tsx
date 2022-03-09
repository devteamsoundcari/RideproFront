import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { DoughnutChart } from '../../atoms';
import { RequestsContext, AuthContext } from '../../../contexts/';
import { CalendarConventions } from '../../molecules';
import './CalendarSidebar.scss';
import { ALL_PROFILES, dateMonthName } from '../../../utils';

interface ICalendarSidebarProps {}

export const CalendarSidebar: React.FunctionComponent<ICalendarSidebarProps> = (props) => {
  const { calendarCount, currentMonth, calendarRequests } = useContext(RequestsContext);
  const { userInfo } = useContext(AuthContext);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    if (calendarRequests.length > 0) {
      const counts = {};
      const colors = {};
      const foundProfile: any = ALL_PROFILES.find(
        (profile) => profile.profile === userInfo.profile
      );
      const stepsKeys = Object.keys(foundProfile.steps);
      const arrayOfDuplicates = calendarRequests.map((request) => {
        const key: any = stepsKeys.filter((key) => {
          return foundProfile.steps[key].step.includes(request?.status?.step);
        });
        const foundStep = foundProfile.steps[key[0]];

        return { name: foundStep.name, color: foundStep.bgColor };
      });
      if (arrayOfDuplicates.length > 0) {
        arrayOfDuplicates.forEach(({ name, color }) => {
          colors[name] = color;
          counts[name] = (counts[name] || 0) + 1;
        });
      }

      const payload = {
        labels: Object.keys(counts),
        datasets: [
          {
            label: '# of requests',
            data: Object.keys(counts).map((key) => counts[key]),
            backgroundColor: Object.keys(colors).map((key) => colors[key]),
            borderColor: Object.keys(colors).map((key) => colors[key]),
            borderWidth: 1
          }
        ]
      };
      setGraphData(payload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRequests]);

  return (
    <div className="calendar-sidebar px-3 py-4 ">
      {graphData?.labels.length ? (
        <div className="mt-4">
          <label className="">Estadisticas de solicitudes</label>
          <DoughnutChart data={graphData} />
        </div>
      ) : (
        ''
      )}
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