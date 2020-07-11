import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const SetDate = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const { value, onUpdate, ...rest } = props;

  const handleCalendarClose = () => {
    onUpdate(startDate);
  };
  return (
    <DatePicker
      {...rest}
      value
      locale="es"
      onChange={(date) => setStartDate(date)}
      onCalendarClose={handleCalendarClose}
    />
  );
};
export default SetDate;
