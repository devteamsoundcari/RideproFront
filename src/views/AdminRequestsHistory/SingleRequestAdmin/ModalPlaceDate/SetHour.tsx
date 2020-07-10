import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const SetHour = (props) => {
  const [startHour, setStartHour] = useState(new Date(props.value));
  const { value, onUpdate, ...rest } = props;

  const handleCalendarClose = () => {
    onUpdate(startHour);
  };
  return (
    <React.Fragment>
      <DatePicker
        {...rest}
        selected={startHour}
        onChange={(date) => setStartHour(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="Hora"
        dateFormat="h:mm aa"
        onCalendarClose={handleCalendarClose}
      />
    </React.Fragment>
  );
};
export default SetHour;
