import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Card, Spinner, Form, Button } from "react-bootstrap";
import {
  createInstructor,
  getDepartments,
  getMunicipalities,
} from "../../../controllers/apiRequests";
import SuccessModal from "../SuccessModal";
import useDropdown from "../../../utils/useDropdown";


const RegisterNewInstructor = () => {
  const { register, handleSubmit, errors } = useForm();
  const [instructorSuccessMessage, setInstructorSuccessMessage] = useState({
    name: "",
    email: "",
  });
  const [instructorErrorMessage, setInstructorErrorMessage] = useState(
    ""
  );
  const [isLoading, setLoading] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(true);
  const [smShow, setSmShow] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState({});
  const [selectedDepartment, DepartmentsDropdown] = useDropdown(
    "",
    "Seleccione...",
    departments
  );

  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipality, MunicipalitiesDropdown] = useDropdown(
    "",
    "Seleccione...",
    municipalities
  );

  const [data, setData] = useState({
    name: "",
    lastName: "",
    email: "",
    municipality: {},
    cellphone: "",
    officialId: "",
  });

  // ================================= ON SUMBIT THE FORM ==========================================

  const onSubmit = async (d) => {
    d.municipality = data.municipality;
    d.first_name = data.name;
    d.last_name = data.lastName;
    d.official_id = data.officialId;
    setLoading(true); // SHOW SPINNER
    const response = await createInstructor(d); // SAVE A NEW USER IN DB
    // IF SUCCESS
    if (response) {
      setLoading(false); // HIDE SPINNER
      setInstructorErrorMessage(""); // DELETE ERROR MESSAGE
      setInstructorSuccessMessage({
        // PASS PROPS TO MODAL
        name: d.name,
        email: d.email,
      });
      setSmShow(true); // SHOW MODAL
      setData({
        name: "",
        lastName: "",
        email: "",
        municipality: {},
        cellphone: "",
        officialId: "",
      });
    } else {
      // IF FAILURE
      setLoading(false); // HIDE THE SPINNER
      setInstructorErrorMessage(d.email); // SHOW ERROR MESSAGE
    }
  };

  // ================================= RENDER USER ERROR ==========================================

  const showErrorMessage = () => {
    if (instructorErrorMessage) {
      return (
        <small>
          Oops! Al parecer el email <strong>{instructorErrorMessage}</strong> ya
          está registrado :(
        </small>
      );
    } else {
      return "";
    }
  };

  // ================================= GET MUNICIPALITIES ==========================================

  useEffect(() => {
    const items = [];
    setLoading(true);
    async function fetchDepartments(url) {
      const response = await getDepartments(url);
      if (response.next) {
        response.results.map((item) => {
          items.push(item);
          return true;
        });
        return await fetchDepartments(response.next);
      }
      response.results.map((item) => {
        setLoading(false);
        items.push(item);
        return true;
      });
      setDepartments(items);
    }
    fetchDepartments(`${process.env.REACT_APP_API_URL}/api/v1/departments/`);
  }, []);

   useEffect(() => {
    if (currentDepartment.id && currentDepartment.name) {
      const items = [];
      setLoading(true);
      async function fetchMunicipalities(url) {
        const response = await getMunicipalities(url);
        if (response.next) {
          response.results.map((item) => {
            items.push(item);
            return true;
          });
          return fetchMunicipalities(response.next);
        } else {
          response.results.map((item) => {
            setLoading(false);
            items.push(item);
            return true;
          });
        }
        setMunicipalities(items);
      }
      setMunicipalities([]);
      fetchMunicipalities(
        `${process.env.REACT_APP_API_URL}/api/v1/municipalities/?department_id=${currentDepartment.id}`
      );
    }
  }, [currentDepartment]);
 
  useEffect(() => {
    if (!isNaN(selectedDepartment)) {
      setCurrentDepartment({
        id: selectedDepartment,
        name: document.getElementById(
          `use-dropdown-option-${selectedDepartment}`
        ).innerHTML,
      });
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (!isNaN(selectedMunicipality)) {
      let city = municipalities.find((city) => city.id === parseInt(selectedMunicipality));
      setData({
        ...data,
        municipality: {
          id: selectedMunicipality,
          name: document.getElementById(`use-dropdown-option-${selectedMunicipality}`)
            .innerHTML,
          service_priority: city.service_priority,
        }
      });
    }
    // eslint-disable-next-line
  }, [selectedMunicipality]);
 
 
  // ================================= UPDATE STATE AS THE USER TYPES ==========================================

  const updateData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value; // Cache the value of e.target.value
    setData((prevState) => ({
      ...prevState,
      [inputName]: inputValue,
    }));
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
    <React.Fragment>
      <Card className="usuarios">
        <Card.Body>
          <Card.Title>Registrar nuevo instructor</Card.Title>
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
                  Número de documento<span> *</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Número de documento"
                  name="officialId"
                  onChange={updateData}
                  value={data.officialId}
                  autoComplete="off"
                  ref={register({
                    required: true,
                    pattern: /^E?\d+$/ 
                  })}
                />
                <Form.Text className="text-muted">
                  {errors.officialId && <span>Ingrese un número de documento válido.</span>}
                </Form.Text> 
              </Form.Group> 
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Departamento</Form.Label>
                  <DepartmentsDropdown />
                <Form.Label>Ciudad</Form.Label>
                  <MunicipalitiesDropdown/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Teléfono<span> *</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Teléfono"
                  name="cellphone"
                  onChange={updateData}
                  value={data.cellphone}
                  autoComplete="off"
                  ref={register({
                    required: true,
                    pattern: /^\d{7,10}$/
                  })}
                />
                <Form.Text className="text-muted">
                  {errors.cellphone && <span>Ingrese un número de teléfono válido.</span>}
                </Form.Text> 
              </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit" disabled={isLoading}>
              Registrar usuario
            </Button>
            {showSpinner()}
            {showErrorMessage()}
          </Form>
        </Card.Body>
      </Card>
      <SuccessModal
        show={smShow}
        onHide={() => setSmShow(false)}
        data={instructorSuccessMessage}
      />
    </React.Fragment>
  );
};

export default RegisterNewInstructor;
