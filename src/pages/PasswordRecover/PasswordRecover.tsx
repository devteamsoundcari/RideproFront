import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ModalSuccess } from '../../components/molecules';
import { Button, Form, Spinner } from 'react-bootstrap';
import bgImage from '../../assets/img/loginImage.png';
import logo from '../../assets/img/logo.png';
import { passwordReset } from '../../controllers/apiRequests';
import './PasswordRecover.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { passwordRecoverFields, passwordRecoverSchema } from '../../schemas';
import { FormInput } from '../../components/atoms';
import { COMPANY_NAME } from '../../utils';

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
  };
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(passwordRecoverSchema)
  });

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
        <img src={logo} alt={`${COMPANY_NAME}Logo`} />
        <Form onSubmit={handleSubmit(onSubmit)} className="text-center">
          {passwordRecoverFields.map((field, index) => (
            <FormInput
              errorClassName="text-white"
              labelClassName="text-white"
              className="rounded-pill p-4"
              field={field}
              register={register}
              errors={errors}
              key={`form-input=${index}`}
            />
          ))}
          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-pill p-3 mb-2 mt-3 font-weight-bold">
            {loading ? <Spinner animation="border" size="sm" /> : 'Restrablecer contraseña'}
          </Button>
          <Link to="/login" className="text-white">
            <Form.Label className="text-white">Iniciar sesión</Form.Label>
          </Link>
        </Form>
        <ModalSuccess show={smShow} data={email} onHide={handleClose} />;
      </div>
    </div>
  );
};
