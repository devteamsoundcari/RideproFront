import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Col, Container, Button } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "./SetDate.scss";
registerLocale("es", es);

const SetDate = (props) => {
  const { handleSubmit, control } = useForm();

  const [date, setDate] = useState({
    date: props.eventDate ? new Date() : props.date,
    placeholder: "",
    propose: false,
  });

  const [time, setTime] = useState({
    time: props.eventDate ? new Date() : props.date,
    placeholder: "",
    propose: false,
  });

  const onSubmit = () => {
    // Updatine the time so we send only one date
    if (date && time) {
      date.date.setTime(time.time.getTime());
      props.setDate(date);
    } else {
      props.setDate(undefined);
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

  const handleProposeDate = () => {
    if (!date.propose) {
      setDate({
        date: "",
        placeholder: "Ridepro decide",
        propose: true,
      });
    } else {
      setDate({
        date: props.date,
        placeholder: "",
        propose: false,
      });
    }
  };

  const handleProposeTime = () => {
    if (!time.propose) {
      setTime({
        time: "",
        placeholder: "Ridepro decide",
        propose: true,
      });
    } else {
      setTime({
        time: props.date,
        placeholder: "",
        propose: false,
      });
    }
  };
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
            <Form.Check
              type="switch"
              label="Proponer Fecha"
              variant="primary"
              id="propseDate"
              onChange={handleProposeDate}
            />
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
            <Form.Check
              type="switch"
              label="Proponer Hora"
              id="propseTime"
              onChange={handleProposeTime}
            />
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