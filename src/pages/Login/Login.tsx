import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Login.scss';
import bgImage from '../../assets/img/loginImage.png';
import logo from '../../assets/img/logo.png';
import {
  Container,
  Col,
  Card,
  Row,
  Button,
  Form,
  Spinner
} from 'react-bootstrap';

export const Login = () => {
  let navigate = useNavigate();
  const { register, handleSubmit, errors } = useForm();
  const { loginUser, loadingAuth, authError } = useContext(AuthContext);

  // ====================== ON SUBMIT THE FORM ======================
  const onSubmit = async (data) => {
    const userData = await loginUser(data);
    if (userData.first_name) {
      navigate('/', { replace: true });
    }
  };

  // ====================== RETURN ======================

  return (
    <>
      <Container className="justify-content-md-center d-flex mt-5 mb-5 loginForm">
        <Col md={8}>
          <Card className="mb-0">
            <Row className="m-0">
              <Col md={6} sm={12}>
                <Card.Body>
                  <Card.Title className="text-center">
                    <img src={logo} alt="RideproLogo" />
                    <h1 className="h3 mb-2 mt-1 font-weight-normal">
                      Iniciar sesión
                    </h1>
                  </Card.Title>
                  <Card.Text className="text-center">
                    Gracias por registrarte en RIDE PRO. Tu cuenta y perfil de
                    usuario será validada por nuestro equipo.{' '}
                  </Card.Text>
                  <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group>
                        <Form.Label>Tu email</Form.Label>
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
                            <span>Por favor, ingresa un email válido</span>
                          )}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Tu contraseña</Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          placeholder="Tu contraseña"
                          ref={register({ required: true })}
                          autoComplete="off"
                        />
                        <Form.Text className="text-muted">
                          {errors.password && <span>Contraseña inválida</span>}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Form.Check type="checkbox" label="Recuérdame" />
                      </Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        className="m-auto">
                        Ingresar
                        {loadingAuth && (
                          <Spinner animation="border" size="sm" />
                        )}
                      </Button>
                      <Link to="/reset-password">
                        <small>Olvidé mi contraseña</small>
                      </Link>
                      {authError && (
                        <p className="text-danger">{authError.message}</p>
                      )}
                    </Form>
                  </Card.Body>
                </Card.Body>
              </Col>
              <Col
                md={6}
                className="bgImageLogin"
                style={{
                  background: `url(${bgImage}) no-repeat center center`
                }}></Col>
            </Row>
          </Card>
        </Col>
      </Container>
      <footer className="sticky-footer">
        <div className="container my-auto">
          <div className="copyright text-center my-auto">
            <span>
              Copyright © Ridepro 2021 - Desarrollado por{' '}
              <a href="https://soundlutions.com/en/">
                <span className="text-danger"> soundlutions.com</span>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};
