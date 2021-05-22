import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Spinner } from "react-bootstrap";
import { getUsers } from "../../../controllers/apiRequests";
import { setSuperUserCompany } from "../../../controllers/apiRequests";
import swal from "sweetalert";
function AttachCompanyToUser({
  handleClose,
  onUpdate,
  superuser,
  settedCompanies,
}) {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async (url) => {
    let oldArr = [];
    const response = await getUsers(url);
    let x = response.results.filter(
      (item) => !settedCompanies.some((other) => item.id === other.company.id)
    );
    x.forEach((cpny) => oldArr.push(cpny));
    setCompanies((old) => old.concat(oldArr));
    if (response.next) {
      return await fetchCompanies(response.next);
    }
  };
  useEffect(() => {
    fetchCompanies(`${process.env.REACT_APP_API_URL}/api/v1/companies/`);
    // eslint-disable-next-line
  }, []);

  const handleClick = async () => {
    setLoading(true);
    let res = await setSuperUserCompany(superuser.id, selected);
    if (res) {
      setLoading(false);
      swal(
        "Perfecto!",
        `Las empresas fueron asignadas existosamente`,
        "success"
      );
      onUpdate();
      handleClose();
    } else {
      setLoading(false);
      console.error("No se pudo actualizar el superusuario");
    }
  };

  return (
    <Modal show={true} onHide={handleClose} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Asignar empresas a {superuser.first_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect2">
              <Form.Label>Seleccione las empresas</Form.Label>
              <Form.Control
                as="select"
                multiple
                style={{ height: "15rem" }}
                onChange={(e) => {
                  let options = e.target.options;
                  let value = [];
                  for (let i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                      value.push(options[i].value);
                    }
                  }
                  setSelected(value);
                }}
              >
                {companies.map((item, idx) => (
                  <option key={idx} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => handleClick()}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AttachCompanyToUser;
