import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
// import { GoogleLogin } from "react-google-login";
import { getLoginToken, getUserInfo } from "../../controllers/apiRequests";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "./Login.scss";
import bgImage from "../../assets/img/loginImage.png";
// import bgPage from "../../assets/img/bgLogin.jpg";
import logo from "../../assets/img/logo.png";
import {
  Container,
  Col,
  Card,
  Row,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import PasswordRecover from "../../views/PasswordRecover/PasswordRecover";
// import NewPassword from "../../views/NewPassword/NewPassword";

const Login = () => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [userInfo, setUserInfo] = useState({
    isSignedIn: false,
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
      setError("");
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
            ? "admin"
            : res.profile === 2
            ? "cliente"
            : res.profile === 3
            ? "operario"
            : res.profile === 5
            ? "tecnico"
            : ""
        }`,
        picture: res.picture,
        url: res.url,
        company: res.company,
        gender: res.gender,
        credit: res.credit,
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
        credit: userInfo.credit,
      });
    }
    // eslint-disable-next-line
  }, [userInfo.isSignedIn]);

  // ====================== REDIRECT DEPENDING ON PROFILE ======================
  useEffect(() => {
    if (userInfo.isSignedIn) {
      console.log(
        "%c ✅ User info:",
        "color: orange; font-weight: bold;",
        userInfo
      );
      let path = "/";
      switch (userInfo.profile) {
        case 1:
          path = "/administrador";
          break;
        case 2:
          path = "/cliente";
          break;
        case 3:
          path = "/operario";
          break;
        case 5:
          path = "/tecnico";
          break;
        default:
          path = "/";
      }
      history.push({
        pathname: path,
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
                    usuario será validada por nuestro equipo.{" "}
                    {/* <a href="#test">
                      <strong>¿Problemas para iniciar sesión?</strong>
                    </a> */}
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
                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
                        className="m-auto"
                      >
                        Ingresar
                        {loading && <Spinner animation="border" size="sm" />}
                      </Button>
                      <Button variant="link" onClick={renderPasswordReset}>
                        <small>Olvidé mi contraseña</small>
                      </Button>
                      <p style={{ color: "red" }}>{error}</p>
                    </Form>
                  </Card.Body>
                </Card.Body>
              </Col>
              <Col
                md={6}
                className="bgImageLogin"
                style={{
                  background: `url(${bgImage}) no-repeat center center`,
                }}
              ></Col>
            </Row>
          </Card>
        </Col>
      </Container>
    );
  }
};

export default Login;
