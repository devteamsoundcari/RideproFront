import React, { useEffect, useContext } from 'react';
import { MainLayout } from '../../components/templates';
import './Calendar.scss';
import { CalendarSidebar, MyCalendar } from '../../components/organisms';

import { RequestsContext } from '../../contexts/';

export interface ICalendarProps {}

export function Calendar(props: ICalendarProps) {
  const { isLoadingCalendarRequests, nextUrlCalendar, getCalendarRequests } =
    useContext(RequestsContext);

  useEffect(() => {
    if (!isLoadingCalendarRequests && nextUrlCalendar === '') {
      getCalendarRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <div className="calendar-wrapper">
        <MyCalendar />
        <CalendarSidebar />
      </div>
    </MainLayout>
  );
}
