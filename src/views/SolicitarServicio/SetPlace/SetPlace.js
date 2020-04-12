import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getDepartments,
  getMunicipalities,
} from "../../../controllers/apiRequests";
import { Container, Form, Col, Button } from "react-bootstrap";
import "./SetPlace.scss";
// import useDropdown from "./useDropdown";

const SetPlace = (props) => {
  const { handleSubmit, register } = useForm();
  const [departments, setDepartments] = useState([]);
  const [department, setDpto] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState([]);
  // const [animal, AnimalDropdown] = useDropdown("Cities", "Choose", cities);

  // =========================== FETCHING DEPARTMENTS ===================================

  useEffect(() => {
    const items = [];
    async function fetchDepartments(url) {
      const response = await getDepartments(url);
      if (response.next) {
        response.results.map((item) => {
          items.push(item);
          return true;
        });
        return await fetchDepartments(response.next);
      }
      setDepartments(items);
    }
    fetchDepartments(`${process.env.REACT_APP_API_URL}/api/v1/departments/`);
  }, []);

  // =========================== FETCHING CITIES ===================================

  useEffect(() => {
    if (department.length) {
      const items = [];
      async function fetchCities(url) {
        const response = await getMunicipalities(url);
        if (response.next) {
          response.results.map((item) => {
            items.push(item);
            return true;
          });
          return fetchCities(response.next);
        } else {
          response.results.map((item) => {
            items.push(item);
            return true;
          });
        }
        setCities(items);
      }
      setCities([]);
      fetchCities(
        `${process.env.REACT_APP_API_URL}/api/v1/municipalities/?department_id=${department}`
      );
    }
  }, [department]);

  // ==================================== SUBMIT THE FORM ========================================

  const onSubmit = (data) => {
    props.setPlace(data);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)} className="setPlace">
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="4">
            <Form.Label>
              <h4>Departamento</h4>
            </Form.Label>
            <Form.Control
              as="select"
              value={department}
              onChange={(e) => setDpto(e.target.value)}
              onBlur={(e) => setDpto(e.target.value)}
              name="department"
              ref={register({
                required: true,
                validate: {
                  validate: (value) => value !== "Seleccione...",
                },
              })}
            >
              <option>Seleccione...</option>
              {departments.map((dep) => {
                return (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                );
              })}
              <Form.Text className="text-danger"></Form.Text>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom05">
            <Form.Label>
              <h4>Ciudad</h4>
            </Form.Label>
            <Form.Control
              as="select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onBlur={(e) => setCity(e.target.value)}
              disabled={cities.length ? false : true}
              name="city"
              ref={register({
                required: true,
                validate: {
                  validate: (value) => value !== "Seleccione...",
                },
              })}
            >
              <option>Seleccione...</option>
              {cities.map((cit) => {
                return (
                  <option key={cit.id} value={cit.id}>
                    {cit.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button type="submit">Continuar</Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  );
};

export default SetPlace;
