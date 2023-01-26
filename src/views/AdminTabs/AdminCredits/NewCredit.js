import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { AuthContext } from "../../../contexts/AuthContext";
import { createSale } from "../../../controllers/apiRequests";
import CustomTable from "../../../components/CustomTable";
import { getUsers } from "../../../controllers/apiRequests";

const USERS_URL = `${process.env.REACT_APP_API_URL}/api/v1/users/`;

const NewCredit = ({ handleClose, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const { userInfoContext } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { register, handleSubmit, errors } = useForm();
  const [totalOfUsers, setTotalOfUsers] = useState(0);
  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUer] = useState(null);

  const fetchURL = async (url, page) => {
    const newUrl = `${url}${page ? page : ""}`;
    const response = await getUsers(newUrl);
    if (response) {
      setTotalOfUsers(response?.count);
      setUsers(response?.results);
    }
  };

  useEffect(() => {
    fetchURL(`${USERS_URL}?page=`, 1);
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data) => {
    if (!selectedUser) {
      swal("Error", `Por favor seleccione un cliente`, "error");
    } else {
      data.bill_id = parseInt(
        selectedUser.id + new Date().getUTCMilliseconds()
      );
      data.buyer = parseInt(selectedUser.id);
      data.file = file;
      data.seller = userInfoContext.id;
      data.payment_method = paymentMethod;
      data.user = users.find((item) => item.id === parseInt(selectedUser.id));
      const response = await createSale(data); // SAVE A NEW USER IN DB
      if (
        response.sale.status === 201 &&
        response.creditsAssigned.status === 200
      ) {
        onUpdate();
        swal("Perfecto!", `Venta realizada existosamente`, "success");
        handleClose();
      } else {
        swal("Opps!", `Algo paso, no pudimos completar la venta`, "error");
        console.error("No se pudo agregar la venta.");
      }
    }
  };

  const columns = [
    {
      dataField: "email",
      text: "Email",
      classes: "small-column",
      headerClasses: "small-column",
      formatter: (cell) => <p>{cell}</p>
    },
    {
      dataField: "first_name",
      text: "Nombre",
      classes: "small-column",
      headerClasses: "small-column",
      formatter: (cell, row) => (
        <p>
          {row.first_name} {row.last_name}
        </p>
      )
    }
  ];

  const handlePageChange = (page, sizePerPage) => {
    setUsers([]);
    fetchURL(`${USERS_URL}?page=`, page);
  };

  const handleSearch = (value) => {
    const url = `${USERS_URL}?search=${value}`;
    fetchURL(url);
  };

  return (
    <Modal show={true} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Asignar créditos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <CustomTable
            columns={columns}
            data={users}
            rowClasses="small-item"
            onPageChange={handlePageChange}
            totalSize={totalOfUsers}
            onSearch={handleSearch}
            onRowClick={(row) => {
              setSelectedUer(row);
            }}
          />
          <Form.Row>
            <Form.Group as={Col} controlId="formGridRides">
              <Form.Label>Usuario seleccionado: </Form.Label>
              <p className="font-italic m-0">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </p>
              <p className="font-italic m-0">{selectedUser?.email}</p>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridRides">
              <Form.Label>Cantidad de Rides *</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                ref={register({ required: true })}
              />
              {errors.credits && (
                <small className="text-danger">
                  Ingrese numero de creditos
                </small>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} className="text-center">
              <Form.Label>Forma de pago *</Form.Label>
              <div key={`inline-radio`} className="mt-2">
                <Form.Check
                  inline
                  type="radio"
                  label="COP"
                  name="COP"
                  checked={paymentMethod === "cash"}
                  onClick={() => setPaymentMethod("cash")}
                />
                <Form.Check
                  type="radio"
                  inline
                  label="Horas ARL"
                  name="hours"
                  checked={paymentMethod === "hours"}
                  onClick={() => setPaymentMethod("hours")}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Cupos ARL"
                  name="cupos"
                  checked={paymentMethod === "cupos"}
                  onClick={() => setPaymentMethod("cupos")}
                />
              </div>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridValue">
              <Form.Label>Valor *</Form.Label>
              <Form.Control
                type="number"
                name="value"
                ref={register({ required: true })}
              />
              {errors.value && (
                <small className="text-danger">Ingrese numero el valor</small>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridNotes">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows="1"
                name="notes"
                ref={register}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Label>Adjuntar OC</Form.Label>
            <Form.File
              id="custom-file"
              label={file ? file.name : ""}
              custom
              onChange={(e) => setFile(e.target.files[0])}
            />
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
};
export default NewCredit;
