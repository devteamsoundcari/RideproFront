import React, { useEffect, useState, useContext } from "react";
import { Modal, Form, Button, Col, Spinner } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";
import { FaCheckCircle } from "react-icons/fa";
import useDropdown from "../../../utils/useDropdown";
import {
  getDepartments,
  getMunicipalities,
} from "../../../controllers/apiRequests";
import { useForm } from "react-hook-form";
import { createNewTrack } from "../../../controllers/apiRequests";

interface Props {
  handleClose: () => void;
  fetchTracks: () => void;
}

interface Departments {
  [index: number]: { id: number; name: string; url: string };
}
interface Department {
  id: any;
  name: string;
}
interface Cities {
  [index: number]: { id: number; name: string; url: string };
}
interface City {
  id: any;
  name: string;
}

const ModalNewTrack: React.FC<Props> = ({ handleClose, fetchTracks }) => {
  const { register, handleSubmit } = useForm();
  const { userInfoContext } = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Departments>([]);
  const [department, setDpto] = useState<Department>({ id: "", name: "" });
  const [cities, setCities] = useState<Cities>([]);
  const [city, setCity] = useState<City>({ id: "", name: "" });
  const [selectedDepartment, DepartmentsDropdown] = useDropdown(
    "Departamento",
    "Seleccione...",
    departments
  );
  const [selectedCity, CitiesDropdown] = useDropdown(
    "Ciudad",
    "Seleccione...",
    cities
  );

  //========================== HANDLE SUBMIT =====================================

  const onSubmit = async (data: any) => {
    if (city.id) {
      setError(false);
      setLoading(true);
      data.trackMunicipality = city.id;
      data.companyId = userInfoContext.company.id;
      if (userInfoContext.profile === 2) {
        data.fare = 0;
      }
      data.latitude = "na";
      data.longitude = "na";
      data.pictures = "na";
      const response = await createNewTrack(data);
      if (response) {
        setLoading(false);
        setSuccess(true);
        fetchTracks();
        setTimeout(() => {
          setSuccess(false);
          handleClose();
        }, 1000);
      } else {
        console.log("Algo paso!, no fue posible crear la pista");
      }
    } else {
      setError(true);
      setLoading(false);
    }
  };

  // =========================== FETCHING DEPARTMENTS ===================================

  useEffect(() => {
    const items: any[] = [];
    async function fetchDepartments(url) {
      const response = await getDepartments(url);
      if (response.next) {
        response.results.forEach((item: any) => {
          items.push(item);
        });
        return await fetchDepartments(response.next);
      }
      response.results.forEach((item: any) => {
        items.push(item);
      });
      setDepartments(items);
    }
    fetchDepartments(`${process.env.REACT_APP_API_URL}/api/v1/departments/`);
  }, []);

  // =========================== FETCHING CITIES ===================================

  useEffect(() => {
    if (department.id && department.name) {
      const items: any[] = [];
      // async function fetchCities(url: string) {
      const fetchCities = async (url: string) => {
        const response = await getMunicipalities(url);
        if (response.next) {
          response.results.forEach((item: any) => {
            items.push(item);
          });
          return fetchCities(response.next);
        } else {
          response.results.forEach((item: any) => {
            items.push(item);
          });
        }
        setCities(items);
      };
      setCities([]);
      fetchCities(
        `${process.env.REACT_APP_API_URL}/api/v1/municipalities/?department_id=${department.id}`
      );
    }
  }, [department]);

  // =============================== SET DEPARTMENT ====================================

  useEffect(() => {
    if (!isNaN(selectedDepartment)) {
      let name: string =
        document.getElementById(`use-dropdown-option-${selectedDepartment}`)
          ?.innerHTML || "";
      setDpto({
        id: selectedDepartment,
        name: name,
      });
    }
  }, [selectedDepartment]);

  // =============================== SET CITY ==========================================

  useEffect(() => {
    if (!isNaN(selectedCity)) {
      let name: string =
        document.getElementById(`use-dropdown-option-${selectedCity}`)
          ?.innerHTML || "";
      setCity({
        id: selectedCity,
        name: name,
      });
    }
  }, [selectedCity]);

  return (
    <Modal
      size={loading ? "sm" : success ? "sm" : "lg"}
      show={true}
      onHide={handleClose}
    >
      <Modal.Header closeButton className={`bg-${userInfoContext.perfil}`}>
        <Modal.Title className="text-white">
          {loading
            ? "Creando pista..."
            : success
            ? "Pista creada!"
            : "Crear nueva pista"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : success ? (
          <h5>
            <FaCheckCircle /> Listo!
          </h5>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col}>
                <DepartmentsDropdown />
              </Form.Group>
              <Form.Group as={Col}>
                <CitiesDropdown />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nombre del lugar</Form.Label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Coliseo municipal"
                  name="trackName"
                  ref={register({ required: true, maxLength: 80 })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Dirección</Form.Label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="calle 26s # 48-23"
                  name="trackAddress"
                  ref={register({ required: true, maxLength: 80 })}
                />
              </Form.Group>
              {userInfoContext.profile !== 2 && (
                <Form.Group as={Col} controlId="formGridFare">
                  <Form.Label>Tarifa</Form.Label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="$"
                    name="fare"
                    ref={register({ required: true, maxLength: 80 })}
                  />
                </Form.Group>
              )}
            </Form.Row>
            <Form.Group controlId="formGridAddress1">
              <Form.Label>Descripción</Form.Label>
              <textarea
                className="form-control"
                placeholder="Por favor escriba una descripcion del lugar ..."
                name="trackDescription"
                ref={register({ required: true, maxLength: 180 })}
              />
            </Form.Group>

            <hr />
            <Form.Row>
              <Form.Group as={Col} controlId="formGridContactName">
                <Form.Label>Persona de contacto</Form.Label>
                <input
                  className="form-control"
                  type="text"
                  name="contact_name"
                  ref={register({ required: true, maxLength: 80 })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridContactPhone">
                <Form.Label>Teléfono de contacto</Form.Label>
                <input
                  className="form-control"
                  type="number"
                  name="cellphone"
                  ref={register({ required: true, maxLength: 80 })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridContactEmail">
                <Form.Label>Email de contacto</Form.Label>
                <input
                  className="form-control"
                  type="email"
                  name="contact_email"
                  ref={register({ required: true, maxLength: 80 })}
                />
              </Form.Group>
            </Form.Row>
            {error && (
              <div className="text-center">
                <small className="text-danger">
                  La información de la pista esta incompleta
                </small>
              </div>
            )}
            <Form.Group id="formGridCheckbox">
              <Form.Check type="checkbox" label="Añadir a pistas favoritas" />
            </Form.Group>

            <Button className={`btn-${userInfoContext.perfil}`} type="submit">
              Agregar
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalNewTrack;
