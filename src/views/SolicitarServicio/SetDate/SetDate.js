import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Col, Container, Button } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "./SetDate.scss";
registerLocale("es", es);

const SetDate = (props) => {
  const { handleSubmit, control } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [date, setDate] = useState({
    date: props.date || new Date(),
    placeholder: "",
    propose: false,
  });

  const [time, setTime] = useState({
    time: props.date || new Date(),
    placeholder: "",
    propose: false,
  });

  const onSubmit = () => {
    // Combining time and date returned by the datepicker components
    if (date && time) {
      let d = new Date(date.date.getTime());
      let t = new Date(time.time.getTime());
      d.setHours(t.getHours());
      d.setMinutes(t.getMinutes());
      d.setSeconds(0);
      d.setMilliseconds(0);

      console.log(d);
      setDate((prevDate) => ({
        ...prevDate,
        date: d
      }));
      setTime((prevTime) => ({
        ...prevTime,
        time: d
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
    setTime({
      time: data[0],
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      props.setDate(date);
      setIsSubmitted(false);
    }
  }, [date, time, isSubmitted]);

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
              minDate={new Date()}
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
              minDate={new Date()}
              selected={time.time}
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
