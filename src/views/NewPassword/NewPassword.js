import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalSuccess from "./ModalSuccess/ModalSuccess";
import { Container, Col, Card, Row, Button, Form } from "react-bootstrap";
import logo from "../../assets/img/logo.png";
import { setNewPassword } from "../../controllers/apiRequests";
import "./NewPassword.scss";

const NewPassword = (props) => {
  const [smShow, setSmShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [passError, setPassError] = useState("");
  const [data, setData] = useState({
    password: "",
    passwordRepeat: "",
    token: "",
    uid: "",
  });
  const onSubmit = async () => {
    if (!passError) {
      let response = await setNewPassword(data);
      if (!response) {
        setShowError(true);
        setTimeout(function () {
          window.open(`${process.env.REACT_APP_FRONT_URL}/`, "_self");
        }, 2000);
      } else {
        setShowError(false);
        setSmShow(true);
      }
    }
    // setEmail(data.email);
    // Object.assign(data, { emailType: "passwordReset" }); // EMAIL TYPE
    // await sendEmail(data); // SEND WELCOME EMAIL TO USER
  };
  const { register, handleSubmit, errors } = useForm();

  // ====================== GETTING THE ACTUAL PATH ======================
  useEffect(() => {
    const url = window.location.href;
    if (url.includes("password-reset/confirm/")) {
      let arr = url.split("/");
      let [uid, token] = arr.slice(6, 8);
      setData({ ...data, uid, token });
    }
    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setSmShow(false);
    window.open(`${process.env.REACT_APP_FRONT_URL}/`, "_self");
  };

  // ================================= SET PASS ERROR ==========================================

  useEffect(() => {
    if (data.password !== data.passwordRepeat) {
      setPassError("Las contraseñas deben ser iguales");
    } else {
      setPassError("");
    }
  }, [data]);

  // ================================= SHOW AND HIDE PASSWORDS ==========================================

  const handleShowPass = () => {
    const x = document.getElementById("newUserPassword");
    const y = document.getElementById("newUserPassword2");
    if (x.type === "password" && y.type === "password") {
      x.type = "text";
      y.type = "text";
    } else {
      x.type = "password";
      y.type = "password";
    }
  };

  // ================================= UPDATE STATE AS THE USER TYPES ==========================================

  const updateData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value; // Cache the value of e.target.value
    setData((prevState) => ({
      ...prevState,
      [inputName]: inputValue,
    }));
  };

  return (
    <Container className="new-password">
      <Row className="justify-content-md-center">
        <Col md={6} sm={12}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">
                <img className="mb-4 company-logo" src={logo} alt="" />
                <h1 className="h3 mb-3 font-weight-normal">
                  Generar nueva contraseña
                </h1>
              </Card.Title>

              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)} className="text-center">
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        Nueva contraseña<span> *</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        id="newUserPassword"
                        onChange={updateData}
                        value={data.password}
                        autoComplete="off"
                        ref={register({
                          required: true,
                          // Min 8 digits, 1 uppercase, 1 number, 1 spec char
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                        })}
                      />
                      <Form.Text
                        className="text-muted"
                        style={{ color: "red" }}
                      >
                        {errors.password && (
                          <span style={{ color: "red" }}>
                            Ingrese una contraseña válida.
                          </span>
                        )}
                        La contraseña debe tener ocho caracteres como mínimo y
                        debe incluír una mayúscula, un número y un caracter
                        especial (@$!%*?&).
                      </Form.Text>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        Confirmar nueva contraseña<span> *</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="passwordRepeat"
                        id="newUserPassword2"
                        onChange={updateData}
                        value={data.passwordRepeat}
                        autoComplete="off"
                        ref={register({ required: true })}
                      />
                      <Form.Text className="text-muted">
                        <span style={{ color: "red" }}>{passError} </span>
                        {errors.passwordRepeat && (
                          <span style={{ color: "red" }}>
                            Las contraseñas deben ser iguales
                          </span>
                        )}
                      </Form.Text>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group className="showPassword">
                      <Form.Check
                        type="checkbox"
                        label="Mostar Contraseña"
                        onClick={handleShowPass}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Button variant="primary" type="submit" className="m-auto">
                    Restrablecer contraseña
                  </Button>
                  <br></br>
                  {showError && (
                    <span style={{ color: "red" }}>
                      Lo sentimos, !este link expiró!
                    </span>
                  )}
                </Form>
              </Card.Body>
            </Card.Body>
          </Card>
          <ModalSuccess show={smShow} onHide={handleClose} />
        </Col>
      </Row>
    </Container>
  );
};

export default NewPassword;
