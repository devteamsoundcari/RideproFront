import React, { useContext, useEffect, useState } from 'react';
import { RequestsContext } from '../../contexts/RequestsContext';
import MyCalendar from '../MyCalendar/MyCalendar';

const Dashboard = () => {
  const { getCalendarRequests, isLoadingCalendarRequests } =
    useContext(RequestsContext);
  const [showCalendar, setShowCalendar] = useState(true);
  const [setEventDate] = useState(null);

  const selectSlot = (data) => {
    setEventDate({
      start: data.start,
      end: data.end
    });
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    if (!isLoadingCalendarRequests) {
      getCalendarRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <MyCalendar selectSlot={selectSlot} />
    </React.Fragment>
  );
};

export default Dashboard;
