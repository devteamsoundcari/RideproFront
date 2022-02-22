import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import './TabSelectDate.scss';
import { useServicePriority } from '../../../utils';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import { ServiceContext } from '../../../contexts';
registerLocale('es', es);

const TIME_INTERVALS = 30;

export interface ITabSelectDateProps {}

export function TabSelectDate(props: ITabSelectDateProps) {
  const { minimumDate, minHour, maxHour, determineHourRange } = useServicePriority();
  const { selectedDate, setSelectedDate } = useContext(ServiceContext);
  const [selectedDateLocal, setSelectedDateLocal] = useState(minimumDate);

  const dateHandler = (date) => {
    // We compare if the time is different so we can tell if the user changed the time
    // if (dateAMPM(date) !== dateAMPM(minimumDate)) setSelectedDate(date);
    setSelectedDate(date);
    determineHourRange(date);
  };

  useEffect(() => {
    console.log(selectedDate, minimumDate);
    if (selectedDate) {
      setSelectedDateLocal(selectedDate);
    } else {
      setSelectedDateLocal(minimumDate);
    }
  }, [minimumDate, selectedDate]);

  return (
    <Form className="tab-select-date">
      <div className="form-item text-center">
        <Form.Label>Fecha y hora</Form.Label>
        <DatePicker
          minDate={minimumDate}
          minTime={setHours(setMinutes(new Date(), minHour[1]), minHour[0])}
          maxTime={setHours(setMinutes(new Date(), maxHour[1]), maxHour[0])}
          selected={selectedDateLocal}
          onChange={dateHandler}
          dateCaptions={'asdsd'}
          timeCaption="Hora"
          locale="es"
          disabled={false}
          dateFormat="MMMM d, yyyy - h:mm aa"
          timeIntervals={TIME_INTERVALS}
          showTimeSelect
        />
      </div>
    </Form>
  );
}
