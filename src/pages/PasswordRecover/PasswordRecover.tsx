import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalSuccess } from '../../components/molecules';
import { Button, Form, Spinner } from 'react-bootstrap';
import bgImage from '../../assets/img/loginImage.png';
import logo from '../../assets/img/logo.png';
import { passwordReset } from '../../controllers/apiRequests';
import './PasswordRecover.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const PasswordRecover = (props) => {
  let navigate = useNavigate();
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
    navigate('/');
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
            <Form.Text className="text-white">
              {errors.email && <span>Por favor ingresa un email válido</span>}
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-pill p-3 mb-2 mt-3 font-weight-bold">
            Restrablecer contraseña
          </Button>

          {loading ? (
            <Spinner animation="border" role="status" className="text-white"></Spinner>
          ) : (
            <Link to="/login" className="text-white">
              <Form.Label className="text-white">Iniciar sesión</Form.Label>
            </Link>
          )}
        </Form>
        <ModalSuccess show={smShow} data={email} onHide={handleClose} />;
      </div>
    </div>
  );
};
