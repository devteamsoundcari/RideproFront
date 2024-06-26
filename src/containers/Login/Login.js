import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { getLoginToken, getUserInfo } from '../../controllers/apiRequests';
import setAuthorizationToken from '../../controllers/setAuthorizationToken';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import './Login.scss';
import bgImage from '../../assets/img/loginImage.png';
import logo from '../../assets/img/logo.png';
import { Button, Form, Spinner } from 'react-bootstrap';
import PasswordRecover from '../../views/PasswordRecover/PasswordRecover';

const Login = () => {
  const history = useHistory();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [userInfo, setUserInfo] = useState({
    isSignedIn: false
  });
  const { register, handleSubmit, errors } = useForm();
  const { setIsLoggedInContext, setUserInfoContext } = useContext(AuthContext);

  // ====================== ON SUBMIT THE FORM ======================
  const onSubmit = async (data) => {
    // ======================= GETTING TOKEN ==========================
    setLoading(true);
    let res = await getLoginToken(data);
    if (res.error) {
      // This means the user is not registered
      await setAuthorizationToken(res.token);
      setError(res.error);
      setLoading(false);
    } else {
      // Save token in LocalStorage
      await setAuthorizationToken(res.token);
      setError('');
      // Get the user info
      await SetUser();
      setLoading(false);
    }
  };

  // ====================== GETTING USER'S INFO ======================
  const SetUser = async () => {
    let res = await getUserInfo();
    // let gender = await getGender(res.first_name);
    if (res) {
      setUserInfo({
        isSignedIn: true,
        name: res.first_name,
        lastName: res.last_name,
        id: res.id,
        email: res.email,
        charge: res.charge,
        profile: res.profile,
        perfil: `${
          res.profile === 1
            ? 'admin'
            : res.profile === 2
            ? 'cliente'
            : res.profile === 3
            ? 'operario'
            : res.profile === 5
            ? 'tecnico'
            : res.profile === 7
            ? 'super-cliente'
            : ''
        }`,
        picture: res.picture,
        url: res.url,
        company: res.company,
        gender: res.gender,
        credit: res.credit
      });
    }
  };

  // ====================== IF TOKEN IN STORAGE SET INFO ======================
  useEffect(() => {
    if (localStorage.token) {
      async function fetchData() {
        await setAuthorizationToken(localStorage.token);
        await SetUser();
      }
      fetchData();
    }
    // eslint-disable-next-line
  }, []);

  // ====================== SETTING UP CONTEXT ======================
  useEffect(() => {
    if (userInfo.isSignedIn) {
      // Setting AuthContex
      setIsLoggedInContext(true);
      setUserInfoContext({
        name: userInfo.name,
        lastName: userInfo.lastName,
        id: userInfo.id,
        email: userInfo.email,
        charge: userInfo.charge,
        profile: userInfo.profile,
        perfil: userInfo.perfil,
        picture: userInfo.picture,
        url: userInfo.url,
        company: userInfo.company,
        gender: userInfo.gender,
        credit: userInfo.credit
      });
    }
    // eslint-disable-next-line
  }, [userInfo.isSignedIn]);

  // ====================== REDIRECT DEPENDING ON PROFILE ======================
  useEffect(() => {
    if (userInfo.isSignedIn) {
      let path = '/';
      switch (userInfo.profile) {
        case 1:
          path = '/administrador';
          break;
        case 2:
          path = '/cliente';
          break;
        case 3:
          path = '/operario';
          break;
        case 5:
          path = '/tecnico';
          break;
        case 7:
          path = '/super-cliente';
          break;
        default:
          path = '/';
      }
      history.push({
        pathname: path
      });
    }
  }, [userInfo, history]);

  // ====================== sHOWING PASSWORD RESET FORM ======================
  const renderPasswordReset = () => {
    setShowPasswordReset(!showPasswordReset);
  };

  // ====================== RETURN ======================
  if (showPasswordReset) {
    return <PasswordRecover comeBack={renderPasswordReset} />;
  } else {
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
                {errors.email && (
                  <span>Por favor, ingresa un email válido</span>
                )}
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
              {loading ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
            </Button>

            <Button
              variant="link"
              className="text-white"
              onClick={renderPasswordReset}>
              <small>Olvidé mi contraseña</small>
            </Button>
            <p style={{ color: 'red' }}>{error}</p>
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
  }
};

export default Login;
