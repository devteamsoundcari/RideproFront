import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { GoogleLogin } from "react-google-login";
import { getLoginToken, getUserByEmail } from "../../controllers/apiRequests";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import setUserInfoLocal from "../../controllers/setUserInfoLocal";

import { useHistory } from "react-router-dom";
import "./Login.scss";
import logo from "../../assets/img/logo.png";
import { Container, Col, Card, Row, Button, Form } from "react-bootstrap";
import PasswordRecover from "../../views/PasswordRecover/PasswordRecover";

const Login = () => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [userInfo, setUserInfo] = useState({
    isSignedIn: false,
    name: "",
    profile: null
  });
  const { register, handleSubmit, errors } = useForm();

  // ====================== GETTING USER'S INFO ======================
  const getUserInfo = async email => {
    let res = await getUserByEmail(email);
    if (res) {
      setUserInfo({
        isSignedIn: true,
        name: res.first_name,
        email: res.email,
        charge: res.charge,
        profile: res.profile
      });
      setUserInfoLocal(res);
    }
  };

  const onSubmit = async data => {
    // ======================= GETTING TOKEN ==========================
    let res = await getLoginToken(data);
    if (res.error) {
      setError(res.error);
    } else {
      await setAuthorizationToken(res.token);
      setError("");
      await getUserInfo(data.email);
    }
  };

  // if (response.data.key) {
  //   let newState = {
  //     isSignedIn: true,
  //     name: response.data.name,
  //     token: response.data.key,
  //     profile: response.data.profile
  //   };
  //   setUserInfo(newState);
  //   setError("");
  // }

  // const responseGoogle = res => {
  //   axios({
  //     method: "POST",
  //     url: "http://localhost:3002/send",
  //     data: res.profileObj
  //   }).then(response => {
  //     if (response.data.status === "success") {
  //       alert("Message Sent.");
  //     } else if (response.data.status === "fail") {
  //       alert("Message failed to send.");
  //     }
  //   });

  //   if (res.profileObj.name) {
  //     let newState = {
  //       isSignedIn: true,
  //       userName: res.profileObj.name,
  //       email: res.profileObj.email,
  //       imageUrl: res.profileObj.imageUrl
  //     };
  //     setUserInfo(newState);
  //   }
  // };
  useEffect(() => {
    if (localStorage.token && localStorage.userInfo) {
      const data = JSON.parse(localStorage.userInfo);
      // console.log(typeof JSON.parse(localStorage.userInfo));
      setUserInfo({
        isSignedIn: true,
        name: data.first_name,
        email: data.email,
        charge: data.charge,
        profile: data.profile
      });
    }
  }, []);

  useEffect(() => {
    if (userInfo.isSignedIn) {
      let path = "/";
      switch (userInfo.profile) {
        case 1:
          path = "/administrador";
          break;
        case 2:
          path = "/cliente";
          break;
        default:
          path = "/";
      }
      history.push({
        pathname: path,
        state: { userInfo }
      });
    }
  }, [userInfo, history]);

  const renderPasswordReset = () => {
    setShowPasswordReset(!showPasswordReset);
  };

  if (showPasswordReset) {
    return <PasswordRecover comeBack={renderPasswordReset} />;
  } else {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6} sm={12}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center">
                  <img className="mb-4" src={logo} alt="" />
                  <h1 className="h3 mb-3 font-weight-normal">Iniciar Sesion</h1>
                </Card.Title>
                <Card.Text className="text-center">
                  Tu cuenta sera validada por el administrador, quien te
                  asignara un tipo de perfil.{" "}
                  <a href="#test">
                    <strong>Problemas para iniciar sesion?</strong>
                  </a>
                </Card.Text>
                <Card.Body>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                      <Form.Label>Tu Email</Form.Label>
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
                    <Form.Group>
                      <Form.Label>Tu Contraseña</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Tu Contraseña"
                        ref={register({ required: true })}
                        autoComplete="off"
                      />
                      <Form.Text className="text-muted">
                        {errors.password && <span>Contraseña invalida</span>}
                      </Form.Text>
                    </Form.Group>
                    <Form.Group>
                      <Form.Check type="checkbox" label="Recuerdame" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="m-auto">
                      Ingresar
                    </Button>
                    <Button variant="link" onClick={renderPasswordReset}>
                      <small>Olvide mi contraseña</small>
                    </Button>
                    <p style={{ color: "red" }}>{error}</p>
                  </Form>
                </Card.Body>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Login;
