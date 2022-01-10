import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Login.scss';
import bgImage from '../../assets/img/loginImage.png';
import logo from '../../assets/img/logo.png';
import { Button, Form, Spinner } from 'react-bootstrap';

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

  return (
    <div
      className="login-page"
      style={{
        background: `url(${bgImage}) no-repeat center center`
      }}>
      <div className="form-container mb-5 text-center">
        <img src={logo} alt="RideproLogo" />
        <Form onSubmit={handleSubmit(onSubmit)} className="text-center">
          <Form.Group className="mb-0">
            <Form.Label className="text-white">Tu email</Form.Label>
            <Form.Control
              className="rounded-pill p-4"
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
              {errors.email && <span>Por favor, ingresa un email válido</span>}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label className="text-white">Tu contraseña</Form.Label>
            <Form.Control
              className="rounded-pill p-4"
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

          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-pill p-3 mb-2 mt-3 font-weight-bold">
            {loadingAuth ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
          </Button>
          <Link to="/reset-password" className="text-white">
            <Form.Label className="text-white"> Olvidé mi contraseña</Form.Label>
          </Link>

          {authError && <p className="text-danger">{authError.message}</p>}
        </Form>
      </div>

      <div className="text-white mt-5">
        <small>
          Copyright ©Ridepro2022 - Desarrollado por{' '}
          <a href="https://soundlutions.com/en/">
            <strong className="text-white"> soundlutions.com</strong>
          </a>
        </small>
      </div>
    </div>
  );
};
