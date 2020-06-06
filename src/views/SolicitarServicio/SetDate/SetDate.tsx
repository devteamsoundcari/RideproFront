import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Col, Container, Button } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import setDay from "date-fns/setDay";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import addDays from "date-fns/addDays";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInHours from "date-fns/differenceInHours";
import es from "date-fns/locale/es";
import "./SetDate.scss";
registerLocale("es", es);

const useSingleton = (initializer) => {
  React.useState(initializer);
}

const SetDate = (props) => {
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [minHour, setMinHour] = useState<number[] | null>(null);
  const [maxHour, setMaxHour] = useState<number[] | null>(null);

  const [date, setDate] = useState<{
    date: Date | null;
    placeholder: string;
    propose: boolean;
  }>({
    date: null,
    placeholder: "",
    propose: false,
  });

  const [time, setTime] =  useState<{
    date: Date | null;
    placeholder: string;
    propose: boolean;
  }>({
    date: null,
    placeholder: "",
    propose: false,
  });

  const {city: {service_priority} } = props.place;
  const { handleSubmit, control } = useForm();

  const determineMinDate = (minDays, minHours) => {
      const minDate = addDays(setHours(new Date(), minHours), minDays);
      setMinDate(prevDate => minDate);
  };

  const getMinDays = (priority) => {
    const today = new Date();

    switch (priority) {
      case 0:
        if (today.getHours() < 16) {
          return 2;
        } else {
          return 3;
        }
      case 1:
        if (today.getHours() < 16) {
          return 1;
        } else {
          return 2;
        }
      default:
        if (today.getHours() < 16) {
          return 2;
        } else {
          return 3;
        }
    }
  };

  const determineHourRange = (date, minDate, priority) => {
    if (differenceInCalendarDays(date, minDate) >= 1) {
      setMinHour([0, 0]);
      setMaxHour([23, 59]);
    } else {
      setMinHour([4, 0]);
      setMaxHour([23, 59]);
    }
  };

  const onSubmit = () => {
    props.afterSubmit();
  };

  const dateHandler = (data) => {
    setDate((prevDate) => ({
      ...prevDate,
      date: data[0],
    }));
  };

  const timeHandler = (data) => {
    setTime((prevTime) => ({
      ...prevTime,
      date: data[0],
    }));
  };

  useSingleton(() => {
    determineMinDate(getMinDays(service_priority), 4);
  });

  useEffect(() => {
    if (date.date === null)
      setDate((prevDate) => ({
          ...prevDate,
          date: minDate
      }));
  }, [minDate])

  useEffect(() => {
    determineHourRange(date.date, minDate, service_priority);
  }, [date.date]);

  useEffect(() => {
    determineMinDate(getMinDays(service_priority), 4);
  }, [props.place])

  useEffect(() => {
    if (minHour !== null && (time.date === null || differenceInHours(
      time.date,
      setHours(setMinutes(new Date(), minHour[1]), minHour[0])) < 0))
    {
      setTime((prevTime) => ({
        ...prevTime,
        date: setHours(setMinutes(new Date(), minHour[1]), minHour[0])
      })); 
    }
  }, [minHour])

  useEffect(() => {
    if (date.date && time.date) {
      let d = new Date(date.date.getTime());
      let t = new Date(time.date.getTime());
      d.setHours(t.getHours());
      d.setMinutes(t.getMinutes());
      d.setSeconds(0);
      d.setMilliseconds(0);

      props.setDate({
        date: d,
        placeholder: "",
        propose: false
      });
    }
  }, [date.date, time.date]);


  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)} className="setDate">
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="auto">
            <Form.Label>
              <h4>Fecha del Evento</h4>
            </Form.Label>
            {minHour && maxHour &&
            <Controller
              as={DatePicker}
              minDate={minDate}
              selected={date.date}
              onChange={dateHandler}
              locale="es"
              disabled={date.propose}
              control={control}
              dateFormat="MMMM d, yyyy"
              placeholderText={date.placeholder}
              name="date"
            />
            }
          </Form.Group>

          <Form.Group as={Col} md="auto" controlId="validationCustom05">
            <Form.Label>
              <h4>Hora del Evento</h4>
            </Form.Label>
            {minHour && maxHour &&
            <Controller
              as={DatePicker}
              minTime={setHours(setMinutes(new Date(), minHour[1]), minHour[0])}
              maxTime={setHours(setMinutes(new Date(), maxHour[1]), maxHour[0])}
              selected={time.date}
              locale="es"
              control={control}
              onChange={timeHandler}
              disabled={time.propose}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Hora"
              dateFormat="h:mm aa"
              name="time"
              placeholderText={time.placeholder}
            />
          }
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button type="submit">Continuar</Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  );
};

export default SetDate;
