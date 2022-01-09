import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { useProfile } from '../../../utils/useProfile';
import { CustomTable } from '../../organisms';
import { CompaniesContext, INewUser, UsersContext, AuthContext } from '../../../contexts';
import swal from 'sweetalert';

export interface IModalNewUserProps {
  handleClose: () => void;
}

export function ModalNewUser({ handleClose }: IModalNewUserProps) {
  const { companies, loadingCompanies, getCompanies, allCompaniesLoaded, count } =
    useContext(CompaniesContext);
  const { addNewUser, loadingUsers } = useContext(UsersContext);
  const { sendEmail, sendingEmail } = useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm();
  const [profile] = useProfile();
  const [passError, setPassError] = useState('');
  const [data, setData] = useState<INewUser>({
    first_name: '',
    last_name: '',
    email: '',
    password1: '',
    password2: '',
    company: '',
    profile: '',
    gender: 'M',
    charge: ''
  });

  // ================================= ON SUMBIT THE FORM ==========================================

  const onSubmit = async (data) => {
    if (!passError) {
      swal({
        title: 'Importante',
        text: 'Estas a punto de crear un nuevo usuario',
        icon: 'warning',
        buttons: ['Volver', 'Continuar'],
        dangerMode: true
      })
        .then(async (willCreate) => {
          if (willCreate) {
            const res = await addNewUser(data);
            // // Send admin email
            const emailPayload = {
              template: 'welcome',
              subject: `${
                { M: 'Bienvenido', F: 'Bienvenida', O: 'Bienvenid@' }[data.gender]
              } a Ridepro👋`,
              to: data.email,
              name: `${data.first_name} ${data.last_name}`,
              email: data.email,
              password: data.password1
            };
            await sendEmail(emailPayload);
            if (res.status === 201) {
              swal(
                'Perfecto!',
                `${data.first_name} ${data.last_name} recibira un correo con sus credenciales de acceso.`,
                'success'
              );
              handleClose();
            } else {
              swal('Error', 'No se pudo crear el usuario', 'error');
            }
          }
        })
        .catch((error) => {
          swal('Oops!', 'Algo salio mal!', 'error');
          console.error(error);
        });
    }
  };

  // ================================= SET PASS ERROR ==========================================

  useEffect(() => {
    if (data.password1 !== data.password2) {
      setPassError('Las contraseñas deben ser iguales');
    } else {
      setPassError('');
    }
  }, [data]);

  // ================================= GET COMPANIES ==========================================
  const fetchCompanies = async () => {
    try {
      await getCompanies();
    } catch (error) {
      throw new Error('Error getting companies');
    }
  };

  useEffect(() => {
    if (!loadingCompanies && !allCompaniesLoaded) fetchCompanies();
    //eslint-disable-next-line
  }, [allCompaniesLoaded]);
  // ================================= UPDATE STATE AS THE USER TYPES ==========================================

  const updateData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value; // Cache the value of e.target.value
    setData((prevState) => ({
      ...prevState,
      [inputName]: inputValue
    }));
  };

  // ================================= SHOW AND HIDE PASSWORDS ==========================================

  const handleShowPass = () => {
    const pass1: any = document.getElementById('newUserPassword');
    const pass2: any = document.getElementById('newUserPassword2');
    if (pass1.type === 'password' && pass2.type === 'password') {
      pass1.type = 'text';
      pass2.type = 'text';
    } else {
      pass1.type = 'password';
      pass2.type = 'password';
    }
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Nombre',
      sort: true
    },
    {
      dataField: 'arl',
      text: 'ARL',
      sort: true,
      classes: 'small-column',
      headerClasses: 'small-column'
    }
  ];

  const registerForm = (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* ROW */}
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>
            Nombre<span> *</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre"
            name="first_name"
            onChange={updateData}
            value={data.first_name}
            autoComplete="off"
            ref={register({ required: true })}
          />
          <Form.Text>
            {errors.first_name && <span className="text-danger">Ingrese un nombre válido.</span>}
          </Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>
            Apellido<span> *</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Apellido"
            name="last_name"
            onChange={updateData}
            value={data.last_name}
            autoComplete="off"
            ref={register({ required: true })}
          />
          <Form.Text>
            {errors.last_name && <span className="text-danger">Ingrese un apellido válido.</span>}
          </Form.Text>
        </Form.Group>
      </Form.Row>
      {/* ROW */}
      <Form.Row>
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
            ref={register({ required: true })}>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="F">O</option>
          </Form.Control>
          <Form.Text>{errors.gender && <span>Ingrese un género</span>}</Form.Text>
        </Form.Group>
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
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
            })}
          />
          <Form.Text className="text-muted">
            {errors.email && <span className="text-danger">Ingrese un email válido.</span>}
          </Form.Text>
        </Form.Group>
      </Form.Row>
      {/* ROW */}
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>
            Contraseña<span> *</span>
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            name="password1"
            id="newUserPassword"
            onChange={updateData}
            value={data.password1}
            autoComplete="off"
            ref={register({
              required: true,
              // Min 8 digits, 1 uppercase, 1 number, 1 spec char
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i
            })}
          />
          <Form.Text className="text-muted">
            <small>
              Ocho caracteres como mínimo una mayúscula, un número y un caracter especial (@$!%*?&).
            </small>
            <br></br>
            {errors.password1 && <span className="text-danger">Ingrese una contraseña válida</span>}
          </Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>
            Confirmar contraseña<span> *</span>
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirmar contraseña"
            name="password2"
            id="newUserPassword2"
            onChange={updateData}
            value={data.password2}
            autoComplete="off"
            ref={register({ required: true })}
          />
          <Form.Text className="text-muted">
            <span className="text-danger">{passError}</span>
            <br></br>
            {errors.password2 && <span className="text-danger">Confirma la contraseña</span>}
          </Form.Text>
          <Form.Check type="checkbox" label="Mostar contraseña" onClick={handleShowPass} />
        </Form.Group>
      </Form.Row>
      {/* ROW */}
      <Form.Row>
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
            ref={register({ required: true })}
          />
          {errors.charge && <small className="text-danger">El cargo es obligatorio.</small>}
        </Form.Group>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>
            Tipo de perfil<span> *</span>
          </Form.Label>
          <Form.Control
            as="select"
            name="profile"
            onChange={updateData}
            autoComplete="off"
            ref={register({ required: true })}>
            <option value="">Seleccione...</option>
            <option value="1">Administrador</option>
            <option value="2">Cliente</option>
            <option value="7">SuperCliente</option>
            <option value="3">Operaciones</option>
            <option value="5">Técnico</option>
          </Form.Control>
          {errors.profile && (
            <small className="text-danger">Por favor, seleccione un perfil.</small>
          )}
        </Form.Group>
      </Form.Row>
      {/* ROW */}
      <hr />
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label className="mb-0">
            Empresa{' '}
            {loadingCompanies && <Spinner animation="border" variant="secondary" size="sm" />}
            <Form.Text className="text-muted mt-0">
              {`Empresas registradas ${
                loadingCompanies ? `(${companies.length} de ${count})` : `(${count})`
              }`}
            </Form.Text>
          </Form.Label>

          <Form.Control
            className="d-none"
            type="number"
            name="company"
            onChange={updateData}
            value={data.company}
            autoComplete="off"
            placeholder="Empresa"
            as="select"
            ref={register({ required: true })}>
            <option value="">Seleccione...</option>
            {companies.map((comp: any) => {
              return (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              );
            })}
          </Form.Control>

          <CustomTable
            columns={columns}
            data={companies}
            renderSearch
            loading={loadingCompanies}
            showPagination={false}
            paginationSize={3}
            onSelectRow={(row: any) => {
              const e = {
                target: {
                  value: row.id,
                  name: 'company'
                }
              };
              updateData(e);
            }}
            hideSelectColumn={false}
          />
          <Form.Text color="danger">
            {errors.company && (
              <span className="text-danger">Por favor, selecciona una empresa.</span>
            )}
          </Form.Text>
        </Form.Group>
      </Form.Row>
      {/* ROW */}
      <Button variant="primary" type="submit" disabled={loadingUsers}>
        Registrar usuario
      </Button>
    </Form>
  );

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white">Registrar nuevo usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body className={loadingUsers ? 'text-center' : ''}>
        {loadingUsers || sendingEmail ? (
          <Spinner animation="border" variant="secondary" className="m-auto" />
        ) : (
          registerForm
        )}
      </Modal.Body>
    </Modal>
  );
}
