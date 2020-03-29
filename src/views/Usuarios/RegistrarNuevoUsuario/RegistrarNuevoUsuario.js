import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { saveNewUser, sendEmail } from "../../../controllers/apiRequests";
import { Col, Card, Form, Button } from "react-bootstrap";

const RegistrarNuevoUsuario = () => {
  const { register, handleSubmit, errors } = useForm();
  const [passError, setPassError] = useState("");
  const [data, setData] = useState({
    name: "",
    lastName: "",
    email: "",
    id: "",
    password: "",
    passRepeat: "",
    profileType: ""
  });

  const onSubmit = async data => {
    if (!passError) {
      Object.assign(data, { emailType: "welcome" });
      await sendEmail(data);
      await saveNewUser(data);
      setData({
        name: "",
        lastName: "",
        email: "",
        id: "",
        password: "",
        passRepeat: "",
        profileType: ""
      });
    }
  };

  const updateData = e => {
    setData(...data, {
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (data.pass !== data.passRepeat) {
      setPassError("Las contrasenas deben ser iguales");
    } else {
      setPassError("");
    }
  }, [data]);

  return (
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
                value={data.name || ""}
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
                value={data.lastName || ""}
                ref={register({ required: true })}
              />
              <Form.Text>
                {errors.lastName && <span>Ingrese un apellido valido</span>}
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Numero de Identificacion</Form.Label>
              <Form.Control
                type="text"
                name="id"
                onChange={updateData}
                value={data.id || ""}
                ref={register}
                placeholder="No. Identificacion"
              />
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
                value={data.email || ""}
                ref={register({
                  required: true,
                  pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
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
                onChange={updateData}
                value={data.password || ""}
                ref={register({
                  required: true,
                  // Min 8 digits, 1 uppercase, 1 number, 1 spec char
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i
                })}
              />
              <Form.Text className="text-muted">
                {errors.password && <span>Ingrese una contraseña valido</span>}
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
                ref={register({ required: true })}
                onChange={updateData}
                value={data.passwordRepeat || ""}
              />
              <Form.Text className="text-muted">
                {errors.passwordRepeat && (
                  <span>Las contasenas no son iguales</span>
                )}
                {passError}
              </Form.Text>
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
                value={data.profileType || ""}
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
          </Form.Row>

          <Button variant="primary" type="submit">
            Registrar Usuario
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistrarNuevoUsuario;
