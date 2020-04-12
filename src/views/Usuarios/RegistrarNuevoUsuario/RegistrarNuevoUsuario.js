import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Card, Spinner, Form, Button } from "react-bootstrap";
import {
  saveNewUser,
  sendEmail,
  getCompanies,
} from "../../../controllers/apiRequests";
import ModalSuccess from "./ModalSuccess/ModalSuccess";

const RegistrarNuevoUsuario = () => {
  const { register, handleSubmit, errors } = useForm();
  const [companies, setCompanies] = useState([]);
  const [passError, setPassError] = useState("");
  const [userSucessMessage, setUserSucessMessage] = useState({
    name: "",
    email: "",
  });
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [data, setData] = useState({
    name: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    passwordRepeat: "",
    profileType: "",
    charge: "",
  });

  // ================================= ON SUMBIT THE FORM ==========================================

  const onSubmit = async (data) => {
    if (!passError) {
      console.log("Lo que se va a enviar es", data);
      setLoading(true); // SHOW SPINNER
      const response = await saveNewUser(data); // SAVE A NEW USER IN DB
      // IF SUCCESS
      if (response) {
        setLoading(false); // HIDE SPINNER
        setUserErrorMessage(""); // DELETE ERROR MESSAGE
        setUserSucessMessage({
          // PASS PROPS TO MODAL
          name: data.name,
          email: data.email,
        });
        setSmShow(true); // SHOW MODAL
        setData({
          // CLEAR THE FORM
          name: "",
          lastName: "",
          email: "",
          company: "",
          password: "",
          passwordRepeat: "",
          profileType: "",
          charge: "",
        });
        Object.assign(data, { emailType: "welcome" }); // EMAIL TYPE
        await sendEmail(data); // SEND WELCOME EMAIL TO USER
      } else {
        // IF FAILURE
        setLoading(false); // HIDE THE SPINNER
        setUserErrorMessage(data.email); // SHOW ERROR MESSAGE
      }
      setPassError(""); // ERASE PWD ERRORS
    }
  };

  // ================================= RENDER USER ERROR ==========================================

  const showErrorMessage = () => {
    if (userErrorMessage) {
      return (
        <small>
          Oops! Al parecer el email <strong>{userErrorMessage}</strong> ya esta
          registrado :(
        </small>
      );
    } else {
      return "";
    }
  };

  // ================================= SET PASS ERROR ==========================================

  useEffect(() => {
    if (data.password !== data.passwordRepeat) {
      setPassError("Las contrasenas deben ser iguales");
    } else {
      setPassError("");
    }
  }, [data]);
  // ================================= GET COMPANIES ==========================================

  useEffect(() => {
    async function fetchCompanies() {
      let res = await getCompanies();
      if (res) {
        setCompanies(res.results);
      }
    }
    fetchCompanies();
  }, []);

  // ================================= UPDATE STATE AS THE USER TYPES ==========================================

  const updateData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value; // Cache the value of e.target.value
    setData((prevState) => ({
      ...prevState,
      [inputName]: inputValue,
    }));
  };

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

  // ================================= RENDER SPINNER ==========================================

  const showSpinner = () => {
    if (isLoading) {
      return (
        <Spinner animation="border" role="status" size="sm">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    } else {
      return "";
    }
  };

  // ================================= RETURN ==========================================

  return (
    <React.Fragment>
      <Card className="usuarios">
        <Card.Body>
          <Card.Title>Registrar Nuevo Usuario</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>
                  Nombre<span> *</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  name="name"
                  onChange={updateData}
                  value={data.name}
                  autoComplete="off"
                  ref={register({ required: true })}
                />
                <Form.Text>
                  {errors.name && <span>Ingrese un nombre valido</span>}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Apellido<span> *</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apellido"
                  name="lastName"
                  onChange={updateData}
                  value={data.lastName}
                  autoComplete="off"
                  ref={register({ required: true })}
                />
                <Form.Text>
                  {errors.lastName && <span>Ingrese un apellido valido</span>}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Empresa</Form.Label>
                <Form.Control
                  type="number"
                  name="company"
                  onChange={updateData}
                  value={data.empresa}
                  autoComplete="off"
                  placeholder="Empresa"
                  as="select"
                  ref={register({ required: true })}
                >
                  <option value="">Seleccione...</option>
                  {companies.map((comp) => {
                    return (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    );
                  })}
                </Form.Control>
                {errors.company && (
                  <span>Por favor seleccione una empresa</span>
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formBasicEmail">
                <Form.Label>
                  Correro Electronico<span> *</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Correo Electronico"
                  name="email"
                  onChange={updateData}
                  value={data.email}
                  autoComplete="off"
                  ref={register({
                    required: true,
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                  })}
                />
                <Form.Text className="text-muted">
                  {errors.email && <span>Ingrese un email valido</span>}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Contraseña<span> *</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
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
                <Form.Text className="text-muted">
                  Min 8 digits, 1 uppercase, 1 number, 1 spec char
                  <br></br>
                  {errors.password && (
                    <span>Ingrese una contraseña valido</span>
                  )}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Confirmar Contraseña<span> *</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmar Contraseña"
                  name="passwordRepeat"
                  id="newUserPassword2"
                  onChange={updateData}
                  value={data.passwordRepeat}
                  autoComplete="off"
                  ref={register({ required: true })}
                />
                <Form.Text className="text-muted">
                  <span>{passError}</span>
                  <br></br>
                  {errors.passwordRepeat && <span>Confirme la contraseña</span>}
                </Form.Text>
              </Form.Group>
              <Form.Group className="showPassword">
                <Form.Check
                  type="checkbox"
                  label="Mostar Contraseña"
                  onClick={handleShowPass}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md={4} controlId="formGridState">
                <Form.Label>
                  Tipo de Perfil<span> *</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="profileType"
                  onChange={updateData}
                  autoComplete="off"
                  ref={register({ required: true })}
                >
                  <option value="">Seleccione...</option>
                  <option value="1">Administrador</option>
                  <option value="2">Cliente</option>
                  <option value="3">Ejecutivo de Cuenta</option>
                </Form.Control>
                {errors.profileType && (
                  <small>Por favor seleccione un perfil</small>
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Cargo en la Empresa<span> *</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Cargo..."
                  name="charge"
                  onChange={updateData}
                  value={data.charge}
                  autoComplete="off"
                  ref={register}
                />
              </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit" disabled={isLoading}>
              Registrar Usuario
            </Button>
            {showSpinner()}
            {showErrorMessage()}
          </Form>
        </Card.Body>
      </Card>
      <ModalSuccess
        show={smShow}
        onHide={() => setSmShow(false)}
        data={userSucessMessage}
      />
    </React.Fragment>
  );
};

export default RegistrarNuevoUsuario;
