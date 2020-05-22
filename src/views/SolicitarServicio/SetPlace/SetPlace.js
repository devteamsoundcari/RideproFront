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
      response.results.map((item) => {
        items.push(item);
        return true;
      });
      setDepartments(items);
    }
    fetchDepartments(`${process.env.REACT_APP_API_URL}/api/v1/departments/`);
  }, []);

  // =========================== FETCHING CITIES ===================================

  useEffect(() => {
    if (department.id && department.name) {
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
        `${process.env.REACT_APP_API_URL}/api/v1/municipalities/?department_id=${department.id}`
      );
    }
  }, [department]);

  // ==================================== SUBMIT THE FORM ========================================

  const onSubmit = (data) => {
    data.city = city;
    data.department = department;
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
              value={department.id}
              onChange={(e) => {
                if (e.target.value !== "Seleccione...") {
                  setDpto({
                    id: e.target.value,
                    name: document.getElementById(e.target.value).innerHTML,
                  });
                }
              }}
              // onBlur={(e) =>
              //   setDpto({
              //     id: e.target.value,
              //     name: document.getElementById(e.target.value).innerHTML,
              //   })
              // }
              name="department"
              ref={register({
                required: true,
                validate: {
                  validate: (value) => value !== "Seleccione...",
                },
              })}
            >
              <option>Seleccione...</option>
              {departments.map((dep, index) => {
                return (
                  <option key={index} value={dep.id} id={dep.id}>
                    {dep.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom05">
            <Form.Label>
              <h4>Ciudad</h4>
            </Form.Label>
            <Form.Control
              as="select"
              value={city.id}
              onChange={(e) => {
                if (e.target.value !== "Seleccione...") {
                  setCity({
                    id: e.target.value,
                    name: document.getElementById(e.target.value).innerHTML,
                  });
                }
              }}
              // onBlur={(e) =>
              //   setCity({
              //     id: e.target.value,
              //     name: document.getElementById(e.target.value).innerHTML,
              //   })
              // }
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
              {cities.map((cit, index) => {
                return (
                  <option key={index} value={cit.id} id={cit.id}>
                    {cit.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              <h4>Lugar</h4>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Lugar del servicio"
              name="place"
              style={{ margin: "0px" }}
              ref={register({
                required: true,
              })}
            />
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
