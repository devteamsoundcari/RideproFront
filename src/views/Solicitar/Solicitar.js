import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Col, Card, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Solicitar = () => {
  const { register, handleSubmit, errors, control } = useForm();
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());

  const onSubmit = data => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/posts",
      data
    })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        if (err.response.status === 403) {
          console.log(err.response.status);
        }
      });
  };

  const dateHandler = data => {
    setDate(data[0]);
  };

  const timeHandler = data => {
    setDate2(data[0]);
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>Solicitar un Servicio</Card.Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Producto</Form.Label>
                  <Form.Control
                    as="select"
                    name="level"
                    ref={register({ required: true })}
                  >
                    <option value="">Seleccione un producto...</option>
                    <option value="PreEmpleoMoto">PreEmpleo Moto</option>
                    <option value="PreEmpleoCarro">PreEmpleo Carro</option>
                    <option value="PreEmpleoRata">PreEmpleo Rata</option>
                  </Form.Control>
                  {errors.level && (
                    <small>Por favor seleccione una opcion</small>
                  )}
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Condiciones de Programacion:</Form.Label>
                  <Form.Control
                    as="select"
                    name="condiciones"
                    ref={register({ required: true })}
                  >
                    <option value="">Seleccione una opcion...</option>
                    <option value="PreEmpleoMoto">PreEmpleo Moto</option>
                    <option value="PreEmpleoCarro">PreEmpleo Carro</option>
                    <option value="PreEmpleoRata">PreEmpleo Rata</option>
                  </Form.Control>
                  {errors.condiciones && (
                    <small>Por favor seleccione una opcion</small>
                  )}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Personas Estimadas</Form.Label>
                  <Form.Control
                    name="personas"
                    type="number"
                    ref={register({ min: 1, max: 100, required: true })}
                  />
                  {errors.personas && (
                    <small>Por favor digite un numero valido</small>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="3" controlId="validationCustom03">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="City" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid city.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom04">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" placeholder="State" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid state.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom05">
                  <Form.Label>Your Birthday</Form.Label>
                  <Controller
                    as={DatePicker}
                    selected={date}
                    onChange={dateHandler}
                    control={control}
                    dateFormat="MMMM d, yyyy"
                    name="birthdayDate"
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationCustom05">
                  <Form.Label>Your Birthday</Form.Label>
                  <Controller
                    as={DatePicker}
                    selected={date2}
                    onChange={timeHandler}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    control={control}
                    name="pero"
                  />
                </Form.Group>
              </Form.Row>

              <input type="submit" />
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Solicitar;
