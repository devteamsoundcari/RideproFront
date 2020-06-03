import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Col, Container, Button } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import setDay from "date-fns/setDay";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import addDays from "date-fns/addDays";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import es from "date-fns/locale/es";
import "./SetDate.scss";
registerLocale("es", es);

const useSingleton = (initializer) => {
  React.useState(initializer);
}

const SetDate = (props) => {
  const [minDate, setMinDate] = useState("");
  const [minHour, setMinHour] = useState([]);
  const [maxHour, setMaxHour] = useState([]);
  const {city: {service_priority} } = props.place;
  const { handleSubmit, control } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const [date, setDate] = useState({
    date:
      props.date || new Date(),
    placeholder: "",
    propose: false,
  });

  const [time, setTime] = useState({
    date:
      props.date ||  new Date(),
    placeholder: "",
    propose: false,
  });

  const determineMinDate = (minDays, minHours) => {
      const minDate = addDays(setHours(new Date(), minHours), minDays);
      setMinDate(prevDate => minDate);
  };

  const getMinDays = (priority) => {
    const today = new Date();

    switch (priority) {
      case 0:
        if (today.getHours() < 16) {
          return 1;
        } else {
          return 2;
        }
      case 1:
        if (today.getHours() < 16) {
          return 2;
        } else {
          return 3;
        }
      case 2:
        if (today.getHours() < 16) {
          return 3;
        } else {
          return 4;
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

  useSingleton(() => {
    determineMinDate(getMinDays(service_priority), 4);
  });

  useEffect(() => {
    determineHourRange(date.date, minDate, service_priority);
  }, [date]);

  const onSubmit = () => {
    // Combining time and date returned by the datepicker components
    if (date && time) {
      let d = new Date(date.date.getTime());
      let t = new Date(time.date.getTime());
      d.setHours(t.getHours());
      d.setMinutes(t.getMinutes());
      d.setSeconds(0);
      d.setMilliseconds(0);

      setDate((prevDate) => ({
        ...prevDate,
        date: d,
      }));
      setTime((prevTime) => ({
        ...prevTime,
        date: d,
      }));
      setIsSubmitted(true);
    }
  };

  const dateHandler = (data) => {
    setDate({
      date: data[0],
    });
  };

  const timeHandler = (data) => {
    setTime((prevTime) => ({
      ...prevTime,
      date: data[0],
    }));
  };

  useEffect(() => {
    if (isSubmitted) {
      props.setDate(date);
      setIsSubmitted(false);
    }

    //eslint-disable-next-line
  }, [date, time, isSubmitted]);

  useEffect(() => {
    determineMinDate(getMinDays(service_priority), 4);
  }, [props.place])

  useEffect(() => {
    setDate((prevDate) => ({
      ...prevDate,
      date: minDate
    }));
  }, [minDate])

  useEffect(() => {
    if (minHour.length > 0)
    {
      setTime((prevTime) => ({
        ...prevTime,
        date: setHours(setMinutes(new Date(), minHour[1]), minHour[0])
      })); 
    } 
  }, [minHour])

  // const handleProposeDate = () => {
  //   if (!date.propose) {
  //     setDate({
  //       date: "",
  //       placeholder: "Ridepro decide",
  //       propose: true,
  //     });
  //   } else {
  //     setDate({
  //       date: props.date,
  //       placeholder: "",
  //       propose: false,
  //     });
  //   }
  // };

  // const handleProposeTime = () => {
  //   if (!time.propose) {
  //     setTime({
  //       time: "",
  //       placeholder: "Ridepro decide",
  //       propose: true,
  //     });
  //   } else {
  //     setTime({
  //       time: props.date,
  //       placeholder: "",
  //       propose: false,
  //     });
  //   }
  // };
  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)} className="setDate">
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="auto">
            <Form.Label>
              <h4>Fecha del Evento</h4>
            </Form.Label>
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
            {/* <Form.Check
            type="switch"
            label="Proponer Fecha"
            variant="primary"
            id="propseDate"
            onChange={handleProposeDate}
          /> */}
          </Form.Group>

          <Form.Group as={Col} md="auto" controlId="validationCustom05">
            <Form.Label>
              <h4>Hora del Evento</h4>
            </Form.Label>
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
            {/* <Form.Check
            type="switch"
            label="Proponer Hora"
            id="propseTime"
            onChange={handleProposeTime}
          /> */}
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
