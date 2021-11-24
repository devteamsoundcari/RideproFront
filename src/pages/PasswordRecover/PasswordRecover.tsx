import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalSuccess } from '../../components/molecules';
import {
  Container,
  Col,
  Card,
  Row,
  Button,
  Form,
  Spinner
} from 'react-bootstrap';
import logo from '../../assets/img/logo.png';
import { passwordReset } from '../../controllers/apiRequests';
import './PasswordRecover.scss';
import { Link } from 'react-router-dom';

export const PasswordRecover = (props) => {
  const [email, setEmail] = useState(null);
  const [smShow, setSmShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    await passwordReset(data);
    setEmail(data.email);
    setSmShow(true);
    setLoading(false);

    // Object.assign(data, { emailType: "passwordReset" }); // EMAIL TYPE
    // await sendEmail(data); // SEND WELCOME EMAIL TO USER
  };
  const { register, handleSubmit, errors } = useForm();

  const handleClose = () => {
    setSmShow(false);
    props.comeBack();
  };

  return (
    <Container className="password-recover">
      <Row className="justify-content-md-center">
        <Col md={6} sm={12}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">
                <img className="mb-4 company-logo" src={logo} alt="" />
                <h1 className="h3 mb-3 font-weight-normal">
                  Recuperar contraseña
                </h1>
              </Card.Title>
              <Card.Text className="text-center">
                Ingresa tu email. Recibirás un correo con instrucciones para
                restrablecer tu contraseña.
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
                        <span>Por favor ingresa un email válido</span>
                      )}
                    </Form.Text>
                  </Form.Group>
                  <Link to="/login">
                    <small>Iniciar sesion</small>
                  </Link>

                  <Button variant="primary" type="submit" className="m-auto">
                    Restrablecer contraseña
                  </Button>
                  {loading && (
                    <Spinner animation="border" role="status"></Spinner>
                  )}
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
