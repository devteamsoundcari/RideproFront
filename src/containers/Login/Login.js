import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { GoogleLogin } from "react-google-login";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import { useHistory } from "react-router-dom";
import "./Login.scss";
import logo from "../../assets/img/logo.png";
import { Container, Col, Card, Row, Button, Form } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    isSignedIn: false,
    name: "",
    token: "",
    profile: null
  });

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/login",
      data
    })
      .then(response => {
        setAuthorizationToken(response.data.token);
        if (response.data.token) {
          let newState = {
            isSignedIn: true,
            name: response.data.name,
            token: response.data.token,
            profile: response.data.profile
          };
          setUserInfo(newState);
          setError("");
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 403) {
          setError("Clave o Usuario invalidos");
        }
      });
  };

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
    if (localStorage.jwtToken) {
      axios({
        method: "POST",
        url: "http://localhost:5000/api/verifyToken",
        data: {
          token: localStorage.jwtToken
        }
      })
        .then(response => {
          if (response.status === 200) {
            setAuthorizationToken(localStorage.jwtToken);
            let newState = {
              isSignedIn: true,
              name: response.data.authData.user.name,
              profile: response.data.authData.user.profile
            };
            setUserInfo(newState);
            setError("");
          }
        })
        .catch(err => {
          console.log(err.response.data);
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
                Tu cuenta sera validada por el administrador, quien te asignara
                un tipo de perfil.{" "}
                <a href="#test">
                  <strong>Problemas para iniciar sesion?</strong>
                </a>
              </Card.Text>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Tu Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Tu email"
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

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Tu Contraseña</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Tu Contraseña"
                      ref={register({ required: true })}
                    />
                    <Form.Text className="text-muted">
                      {errors.password && <span>Contraseña invalida</span>}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recuerdame" />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="m-auto">
                    Ingresar
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
};

export default Login;
