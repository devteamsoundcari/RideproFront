import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Spinner, Form, Button, Modal } from "react-bootstrap";
import {
  saveNewUser,
  sendEmail,
  getUsers,
} from "../../../../controllers/apiRequests";
import ModalSuccess from "./ModalSuccess/ModalSuccess";

const RegistrarNuevoUsuario = ({ onUpdate, handleClose }) => {
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
    gender: "",
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
      setLoading(true); // SHOW SPINNER
      const response = await saveNewUser(data); // SAVE A NEW USER IN DB
      // IF SUCCESS
      if (response) {
        setLoading(false); // HIDE SPINNER
        onUpdate();
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
          gender: "",
          email: "",
          company: "",
          password: "",
          passwordRepeat: "",
          profileType: "",
          charge: "",
        });
        Object.assign(data, { emailType: "welcome" }); // EMAIL TYPE
        // EMAIL TYPE AND SUBJECT
        data.emailType = "welcome";
        data.subject = `${
          { M: "Bienvenido", F: "Bienvenida", O: "Bienvenid@" }[data.gender]
        } a Ridepro 👋`;
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
          Oops! Al parecer el email <strong>{userErrorMessage}</strong> ya está
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
      setPassError("Las contraseñas deben ser iguales");
    } else {
      setPassError("");
    }
  }, [data]);
  // ================================= GET COMPANIES ==========================================

  const fetchCompanies = async (url) => {
    const response = await getUsers(url);
    setCompanies((oldArr) => [...oldArr, ...response.results]);
    if (response.next) {
      return await fetchCompanies(response.next);
    }
  };
  useEffect(() => {
    fetchCompanies(`${process.env.REACT_APP_API_URL}/api/v1/companies/`);
    // eslint-disable-next-line
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
          <span className="sr-only">Cargando...</span>
        </Spinner>
      );
    } else {
      return "";
    }
  };

  // ================================= RETURN ==========================================

  return (
    <Modal show={true} onHide={handleClose} size="lg" className="usuarios">
      <Modal.Header>Registrar nuevo usuario</Modal.Header>
      <Modal.Body>
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
                {errors.name && <span>Ingrese un nombre válido.</span>}
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
                {errors.lastName && <span>Ingrese un apellido válido.</span>}
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>
                Género<span> *</span>
              </Form.Label>
              <Form.Control
                as="select"
                placeholder="Género"
                name="gender"
                onChange={updateData}
                autoComplete="off"
                ref={register({ required: true })}
              >
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="F">O</option>
              </Form.Control>
              <Form.Text>
                {errors.gender && <span>Ingrese un género</span>}
              </Form.Text>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formBasicEmail">
              <Form.Label>
                Correro electrónico<span> *</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
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
                {errors.email && <span>Ingrese un email válido.</span>}
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
                La contraseña debe tener ocho caracteres como mínimo y debe
                incluír una mayúscula, un número y un caracter especial
                (@$!%*?&).
                <br></br>
                {errors.password && <span>Ingrese una contraseña válida</span>}
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>
                Confirmar contraseña<span> *</span>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmar contraseña"
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
                {errors.passwordRepeat && <span>Confirma la contraseña</span>}
              </Form.Text>
            </Form.Group>
            <Form.Group className="showPassword">
              <Form.Check
                type="checkbox"
                label="Mostar contraseña"
                onClick={handleShowPass}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
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
                <span>Por favor, selecciona una empresa.</span>
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
            <Form.Group as={Col} md={4} controlId="formGridState">
              <Form.Label>
                Tipo de perfil<span> *</span>
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
                <option value="7">SuperCliente</option>
                <option value="3">Operaciones</option>
                <option value="5">Técnico</option>
              </Form.Control>
              {errors.profileType && (
                <small>Por favor, seleccione un perfil.</small>
              )}
            </Form.Group>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          Registrar usuario
        </Button>
        {showSpinner()}
        {showErrorMessage()}
      </Modal.Footer>
      <ModalSuccess
        show={smShow}
        onHide={() => setSmShow(false)}
        data={userSucessMessage}
      />
    </Modal>
  );
};

export default RegistrarNuevoUsuario;
