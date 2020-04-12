import React, { useState } from "react";
import MyCalendar from "../MyCalendar/MyCalendar";
import SolicitarServicio from "../SolicitarServicio/SolicitarServicio";

const Dashboard = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [eventDate, setEventDate] = useState(null);

  const selectSlot = (data) => {
    setEventDate({
      start: data.start,
      end: data.end,
    });
    setShowCalendar(!showCalendar);
    // history.push({
    //   pathname: "/solicitar",
    // });
  };

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2"></div>
        </div>
      </div>
      {showCalendar && <MyCalendar selectSlot={selectSlot} />}
      {!showCalendar && (
        <SolicitarServicio selectSlot={selectSlot} eventDate={eventDate} />
      )}
    </React.Fragment>
  );
};

export default Dashboard;
