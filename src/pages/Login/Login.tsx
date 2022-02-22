import React, { useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import bgImage from '../../assets/img/loginImage.png';
import logo from '../../assets/img/logo.png';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FormInput } from '../../components/atoms';
import { loginSchema, loginFields } from '../../schemas';
import './Login.scss';
import { COMPANY_NAME } from '../../utils/constants';

export const Login = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(loginSchema)
  });
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
        <img src={logo} alt={`${COMPANY_NAME}Logo`} />
        <Form onSubmit={handleSubmit(onSubmit)} className="text-center">
          {loginFields.map((field, index) => (
            <FormInput
              key={`form-input=${index}`}
              labelClassName="text-white"
              field={field}
              className="rounded-pill p-4"
              register={register}
              errorClassName="text-white"
              errors={errors}
            />
          ))}
          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-pill p-3 mb-2 mt-3 font-weight-bold">
            {loadingAuth ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
          </Button>
          <Link to="/reset-password" className="text-white">
            <Form.Label className="text-white"> Olvidé mi contraseña</Form.Label>
          </Link>

          {authError && (
            <>
              <br />
              <small className="text-white">{authError.message}</small>
            </>
          )}
        </Form>
      </div>

      <div className="text-white mt-5">
        <small>
          Copyright ©{COMPANY_NAME} 2022 - Desarrollado por{' '}
          <a href="https://soundlutions.com/en/">
            <strong className="text-white"> soundlutions.com</strong>
          </a>
        </small>
      </div>
    </div>
  );
};
