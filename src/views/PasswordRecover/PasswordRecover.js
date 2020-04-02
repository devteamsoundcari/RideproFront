import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalSuccess from "./ModalSuccess/ModalSuccess";
import { Container, Col, Card, Row, Button, Form } from "react-bootstrap";
import logo from "../../assets/img/logo.png";
import { sendEmail, passwordReset } from "../../controllers/apiRequests";

const PasswordRecover = props => {
  const [email, setEmail] = useState(null);
  const [smShow, setSmShow] = useState(false);

  const onSubmit = async data => {
    console.log(data.email);
    await passwordReset(data);
    setEmail(data.email);
    setSmShow(true);
    // Object.assign(data, { emailType: "passwordReset" }); // EMAIL TYPE
    // await sendEmail(data); // SEND WELCOME EMAIL TO USER
  };
  const { register, handleSubmit, errors } = useForm();

  const handleClose = () => {
    setSmShow(false);
    props.comeBack();
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6} sm={12}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">
                <img className="mb-4" src={logo} alt="" />
                <h1 className="h3 mb-3 font-weight-normal">
                  Recuperar Contraseña
                </h1>
              </Card.Title>
              <Card.Text className="text-center">
                Ingresa tu email, recibiras un correo con instrucciones para
                restrablecer tu contraseña
              </Card.Text>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)} className="text-center">
                  <Form.Group>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Tu email"
                      autoComplete="off"
                      ref={register({
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      })}
                    />
                    <Form.Text className="text-muted">
                      {errors.email && (
                        <span>Por favor ingresa un email valido</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                  <Button variant="link" onClick={props.comeBack}>
                    <small>Volver</small>
                  </Button>
                  <Button variant="primary" type="submit" className="m-auto">
                    Restrablecer Contraseña
                  </Button>
                </Form>
              </Card.Body>
            </Card.Body>
          </Card>
          <ModalSuccess show={smShow} data={email} onHide={handleClose} />
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordRecover;
