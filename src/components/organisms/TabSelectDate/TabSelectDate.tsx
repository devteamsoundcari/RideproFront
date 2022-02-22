import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import './TabSelectDate.scss';
import { dateAMPM, useServicePriority } from '../../../utils';
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

  const dateHandler = (date, x, y, z) => {
    console.log(date, x, y, z);
    // We compare if the time is different so we can tell if the user changed the time
    // if (dateAMPM(date) !== dateAMPM(minimumDate)) setSelectedDate(date);
    setSelectedDate(date);
    determineHourRange(date);
  };

  // const getSelectedDate = () => {
  //   console.log(selectedDate, minimumDate);
  //   if (selectedDate) {
  //     return selectedDate;
  //   } else {
  //     return minimumDate;
  //   }
  // };
  useEffect(() => {
    console.log(selectedDate, minimumDate);
    if (selectedDate) {
      setSelectedDateLocal(selectedDate);
    } else {
      setSelectedDateLocal(minimumDate);
    }
  }, [minimumDate, selectedDate]);

  useEffect(() => {
    console.log('minHour, maxHour', minHour, maxHour);
  }, [minHour, maxHour]);

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
          // control={control}
          dateFormat="MMMM d, yyyy - h:mm aa"
          // placeholderText={'asdasdasdsadasda'}
          // name="date"
          timeIntervals={TIME_INTERVALS}
          showTimeSelect
          // inline
        />
      </div>
    </Form>
  );
}
