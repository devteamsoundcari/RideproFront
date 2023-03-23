import React, { useContext, useState, useEffect } from 'react';
import { Modal, Form, Col, Button, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';
import { AuthContext, UsersContext, CreditsContext } from '../../../contexts';
import { useProfile } from '../../../utils';
import { CustomTable } from '../../organisms';

export interface IModalAddCreditProps {
  handleClose: () => void;
}

export function ModalAddCredit({ handleClose }: IModalAddCreditProps) {
  const { userInfo } = useContext(AuthContext) as any;
  const [profile] = useProfile();
  const { loadingUsers, users, count, getUsers, allUsersLoaded } = useContext(UsersContext);
  const { newSale } = useContext(CreditsContext);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { register, handleSubmit, errors } = useForm();
  const [file, setFile] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  //   const [selectedUser, UsersDropdown] = useDropdown('Cliente *', 'Seleccione...', userNames);

  const onSubmit = async (data: any) => {
    data.payment_method = paymentMethod;
    data.bill_id = `${data.user}${new Date().getUTCMilliseconds()}`;
    data.buyer = data.user;
    data.seller = userInfo.id;
    data.file = data.file[0];

    // if (selectedUser === 'Seleccione...') {
    //   swal('Error', `Por favor seleccione un cliente`, 'error');
    // } else {
    // data.payment_method = paymentMethod;
    //   data.user = users.find((item) => item.id === parseInt(selectedUser));
    // const response = await createSale(data); // SAVE A NEW USER IN DB
    // if (response.sale.status === 201 && response.creditsAssigned.status === 200) {
    //   swal('Perfecto!', `Venta realizada existosamente`, 'success');
    //   handleClose();
    // } else {
    //   swal('Opps!', `Algo paso, no pudimos completar la venta`, 'error');
    //   console.error('No se pudo agregar la venta.');
    // }
    // }

    swal({
      title: 'Estas seguro?',
      text: `Estas a punto de agregar ${data.credits} créditos a este usuaio`,
      icon: 'warning',
      buttons: ['Volver', 'Continuar'],
      dangerMode: true
    })
      .then(async (willCreate) => {
        if (willCreate) {
          const res = await newSale(data);
          // Send admin email
          // const emailPayload = {
          //   template: 'welcome',
          //   subject: `${
          //     { M: 'Bienvenido', F: 'Bienvenida', O: 'Bienvenid@' }[data.gender]
          //   } a ${COMPANY_NAME}`,
          //   to: data.email,
          //   name: `${data.first_name} ${data.last_name}`,
          //   email: data.email,
          //   password: data.password1
          // };
          // await sendEmail(emailPayload);
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
        swal('Oops!', 'Error al crear venta!', 'error');
        console.error(error);
      });
  };

  // ================================= GET COMPANIES ==========================================
  const fetchUsers = async () => {
    try {
      await getUsers();
    } catch (error) {
      throw new Error('Error getting companies');
    }
  };

  useEffect(() => {
    if (!loadingUsers && !allUsersLoaded) fetchUsers();
    //eslint-disable-next-line
  }, [allUsersLoaded]);

  const updateData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value; // Cache the value of e.target.value
    setData((prevState) => ({
      ...prevState,
      [inputName]: inputValue
    }));
  };

  const columns = [
    {
      dataField: 'first_name',
      text: 'Nombre',
      sort: true
    },
    {
      dataField: 'last_name',
      text: 'Apellido',
      sort: true
    },
    {
      dataField: 'company.name',
      text: 'Empresa',
      sort: true,
      classes: 'small-column',
      headerClasses: 'small-column'
    },
    {
      dataField: 'credit',
      text: 'Crédito actual',
      sort: true,
      classes: 'text-center',
      headerClasses: 'small-column'
    }
  ];

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Asignar créditos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Col md={5}>
              <Form.Group controlId="formGridRides">
                <Form.Label>Cantidad de creditos *</Form.Label>
                <Form.Control type="number" name="credits" ref={register({ required: true })} />
                {errors.credits && (
                  <small className="text-danger">Ingrese numero de creditos</small>
                )}
              </Form.Group>
            </Col>
            <Col md={7}>
              <Form.Group className="text-center">
                <Form.Label>Forma de pago *</Form.Label>
                <div key={`inline-radio`} className="mt-2">
                  <Form.Check
                    inline
                    type="radio"
                    label="COP"
                    name="COP"
                    checked={paymentMethod === 'cash'}
                    onClick={() => setPaymentMethod('cash')}
                  />
                  <Form.Check
                    type="radio"
                    inline
                    label="Horas ARL"
                    name="hours"
                    checked={paymentMethod === 'hours'}
                    onClick={() => setPaymentMethod('hours')}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Cupos ARL"
                    name="cupos"
                    checked={paymentMethod === 'cupos'}
                    onClick={() => setPaymentMethod('cupos')}
                  />
                </div>
              </Form.Group>
            </Col>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridValue">
              <Form.Label>Valor *</Form.Label>
              <Form.Control type="number" name="value" ref={register({ required: true })} />
              {errors.value && <small className="text-danger">Ingrese numero el valor</small>}
            </Form.Group>
            <Form.Group as={Col} controlId="formGridCharge">
              <Form.Label>Adjuntar OC *</Form.Label>
              <Form.File
                id="custom-file"
                label={file ? file.name : ''}
                custom
                name="file"
                ref={register({ required: true })}
                onChange={(e) => setFile(e.target.files[0])}
              />
              {errors.file && <small className="text-danger">La OC es rquerida</small>}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridNotes">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control as="textarea" rows={2} name="notes" ref={register()} />
            </Form.Group>
          </Form.Row>
          {/* ROW */}
          <hr />
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label className="mb-0">
                Usuario *{' '}
                {loadingUsers && <Spinner animation="border" variant="secondary" size="sm" />}
                <Form.Text className="text-muted mt-0">
                  {`Usuarios registrados ${
                    loadingUsers ? `(${users.length} de ${count})` : `(${count})`
                  }`}
                </Form.Text>
              </Form.Label>

              <Form.Control
                className="d-none"
                name="user"
                value={data?.user.id}
                autoComplete="off"
                placeholder="Usuario"
                ref={register({ required: true })}
              />
              <CustomTable
                keyField="id"
                columns={columns}
                data={users}
                renderSearch
                loading={loadingUsers}
                showPagination={false}
                paginationSize={3}
                onSelectRow={(row: any) => {
                  const e = {
                    target: {
                      value: row,
                      name: 'user'
                    }
                  };
                  updateData(e);
                }}
                hideSelectColumn={false}
              />
              <Form.Text color="danger">
                {errors.user && (
                  <span className="text-danger">Por favor, selecciona un usuario.</span>
                )}
              </Form.Text>
            </Form.Group>
          </Form.Row>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
