import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getDepartments,
  getMunicipalities,
  getTracks,
} from "../../../controllers/apiRequests";
import { Container, Form, Col, Button, Card } from "react-bootstrap";
import "./SetPlace.scss";
import useDropdown from "../../../utils/useDropdown";

const SetPlace = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const history = useHistory();
  const { handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [noTrack, setNoTrack] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [track, setTrack] = useState({});
  const [departments, setDepartments] = useState([]);
  const [department, setDpto] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState({});
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
  const [selectedTrack, TracksDropdown, setTracksDropdown] = useDropdown(
    "Seleccionar pista",
    "Seleccione...",
    filteredTracks
  );

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (url) => {
    let tempTracks = [];
    const response = await getTracks(url);
    response.results.forEach(async (item) => {
      tempTracks.push(item);
    });
    setTracks(tempTracks);
    if (response.next) {
      return await getTracks(response.next);
    }
  };
  useEffect(() => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
  }, []);

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

  // =============================== FILTER TRACKS BY CITY ====================================

  useEffect(() => {
    if (city.id) {
      setFilteredTracks([]);
      tracks.forEach((item) => {
        if (item.municipality.id === parseInt(city.id)) {
          console.log(item.municipality.id, parseInt(city.id));
          setFilteredTracks((oldArr) => [...oldArr, item]);
        }
      });
    }
  }, [city, tracks]);

  const handleCheckChange = () => {
    setNoTrack(!noTrack);
    if (!noTrack) {
      setTracksDropdown("disabled");
    } else {
      setTracksDropdown("Seleccione...");
    }
  };

  // =============================== SET DEPARTMENT ====================================

  useEffect(() => {
    if (!isNaN(selectedDepartment)) {
      setDpto({
        id: selectedDepartment,
        name: document.getElementById(
          `use-dropdown-option-${selectedDepartment}`
        ).innerHTML,
      });
    }
  }, [selectedDepartment]);

  // =============================== SET CITY ==========================================

  useEffect(() => {
    if (!isNaN(selectedCity)) {
      setCity({
        id: selectedCity,
        name: document.getElementById(`use-dropdown-option-${selectedCity}`)
          .innerHTML,
      });
    }
  }, [selectedCity]);

  // =============================== SET TRACK ==========================================

  useEffect(() => {
    if (selectedTrack !== "Seleccione..." && selectedTrack !== "disabled") {
      setTrack({
        id: selectedTrack,
        name: document.getElementById(`use-dropdown-option-${selectedTrack}`)
          .innerHTML,
      });
    }
  }, [selectedTrack]);

  // =============================== CLICK ON ADD TRACK ====================================

  const handleClick = () => {
    let url = `${
      userInfoContext.profile === 1 ? "/administrador" : "/cliente"
    }/pistas`;
    history.push(url);
  };

  // ==================================== SUBMIT THE FORM ========================================

  const onSubmit = (data) => {
    setError("");
    if (city.id && department.id) {
      if (noTrack || track.id) {
        data.city = city;
        data.department = department;
        data.track = noTrack ? "na" : track;
        props.setPlace(data);
      } else {
        setError("Especifique el tipo de pista");
      }
    } else {
      setError("Especifique departamento y ciudad");
    }
  };

  // ================================================================================================
  return (
    <Container className="setPlace">
      <p className="lead">
        Ridepro agendara el servicio usando alguna de las pistas que
        <br />
        selecciones a continuación.
      </p>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="4">
            <DepartmentsDropdown />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <CitiesDropdown />
          </Form.Group>
        </Form.Row>
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="4">
            <Card>
              <Card.Body>
                <TracksDropdown />
                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="info"
                    size="sm"
                    className="mr-3"
                    onClick={handleClick}
                    disabled={noTrack}
                  >
                    Ver pistas
                  </Button>
                  <Form.Check
                    onChange={handleCheckChange}
                    checked={noTrack}
                    className="d-flex align-items-center"
                    label="Pista Ridepro"
                  />
                </div>
              </Card.Body>
            </Card>
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
