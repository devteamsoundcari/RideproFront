import React from 'react';
import MyCalendar from '../../components/organisms/MyCalendar/MyCalendar';
import { MainLayout } from '../../components/templates';
import './Calendar.scss';
import { CalendarSidebar } from '../../components/organisms';

export interface ICalendarProps {}

export function Calendar(props: ICalendarProps) {
  return (
    <MainLayout>
      <div className="calendar-wrapper">
        <CalendarSidebar />
        <MyCalendar />
      </div>
    </MainLayout>
  );
}
