import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import {
  getDepartments,
  getMunicipalities,
  getTracks
} from '../../../controllers/apiRequests';
import { Container, Form, Col, Button, Card, Spinner } from 'react-bootstrap';
import './SetPlace.scss';
import useDropdown from '../../../utils/useDropdown';
import ModalNewTrack from '../../Tracks/ModalNewTrack/ModalNewTrack';

const SetPlace = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  // const history = useHistory();
  const { handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [noTrack, setNoTrack] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [track, setTrack] = useState({});
  const [departments, setDepartments] = useState([]);
  const [department, setDpto] = useState('');
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState({});
  const [showModalTracks, setShowModalTracks] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('Seleccione...');
  const [selectedCity, setSelectedCity] = useState('Seleccione...');

  const [selectedTrack, TracksDropdown, setTracksDropdown] = useDropdown(
    'Tus pistas',
    'Seleccione...',
    filteredTracks
  );
  const [loading, setLoading] = useState(true);

  // ================================ FETCH TRACKS ON LOAD =====================================================

  const fetchTracks = async (url) => {
    setLoading(true);
    const response = await getTracks(url);

    const companyTracks = response.results.filter(
      (item) => item.company.id === userInfoContext.company.id
    );

    setFilteredTracks((oldArr) => oldArr.concat(companyTracks));
    if (response.next) {
      return await fetchTracks(response.next);
    } else {
      setLoading(false);
    }
  };

  const getTracksByDepartment = async (departmentName) => {
    const url = `${process.env.REACT_APP_API_URL}/api/v1/tracks/?search=${departmentName}`;
    setFilteredTracks([]);
    fetchTracks(url);
  };

  // =========================== FETCHING DEPARTMENTS ===================================

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

  // =========================== FETCHING CITIES ===================================

  useEffect(() => {
    if (department.id && department.name) {
      const items = [];
      setLoading(true);
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
            setLoading(false);
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
    if (department.name) {
      getTracksByDepartment(department.name);
    }

    //eslint-disable-next-line
  }, [department]);

  const handleCheckChange = () => {
    setNoTrack(!noTrack);
    if (!noTrack) {
      setTracksDropdown('disabled');
    } else {
      setTracksDropdown('Seleccione...');
    }
  };

  // =============================== SET DEPARTMENT ====================================

  useEffect(() => {
    if (!isNaN(selectedDepartment)) {
      setDpto({
        id: selectedDepartment,
        name: document.getElementById(
          `use-dropdown-option-${selectedDepartment}`
        ).innerHTML
      });
    }
  }, [selectedDepartment]);

  // =============================== SET CITY ==========================================

  useEffect(() => {
    if (!isNaN(selectedCity)) {
      let city = cities.find((city) => city.id === parseInt(selectedCity));
      setCity({
        id: selectedCity,
        name: document.getElementById(`use-dropdown-option-${selectedCity}`)
          .innerHTML,
        service_priority: city.service_priority
      });
    }
    // eslint-disable-next-line
  }, [selectedCity]);

  // =============================== SET TRACK ==========================================

  useEffect(() => {
    if (selectedTrack !== 'Seleccione...' && selectedTrack !== 'disabled') {
      setTrack({
        id: selectedTrack,
        name: document.getElementById(`use-dropdown-option-${selectedTrack}`)
          .innerHTML
      });
    }
  }, [selectedTrack]);

  // =============================== CLICK ON ADD TRACK ====================================

  const handleClick = () => {
    // let url = `${
    //   userInfoContext.profile === 1 ? "/administrador" : "/cliente"
    // }/pistas`;
    // history.push(url);
    setShowModalTracks(true);
  };

  // ==================================== SUBMIT THE FORM ========================================

  const onSubmit = (data) => {
    setError('');
    if (city.id && department.id) {
      if (noTrack || track.id) {
        data.city = city;
        data.department = department;
        data.track = noTrack ? 'na' : track;
        props.setPlace(data);
      } else {
        setError('Por favor especifique el tipo de pista');
      }
    } else {
      setError('Por favor especifique departamento y ciudad');
    }
  };

  // ================================================================================================

  const departmentsDropdown = () => (
    <React.Fragment>
      <Form.Label>Departamento:</Form.Label>
      <Form.Control
        as="select"
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        onBlur={(e) => setSelectedDepartment(e.target.value)}
        disabled={
          departments.length === 0 || selectedDepartment === 'disabled'
        }>
        <option>Seleccione...</option>
        {departments.map((item) => (
          <option
            key={item.id}
            value={item.id}
            id={`use-dropdown-option-${item.id}`}>
            {item.name}
          </option>
        ))}
      </Form.Control>
    </React.Fragment>
  );

  const citiesDropdown = () => (
    <React.Fragment>
      <Form.Label>Ciudad:</Form.Label>
      <Form.Control
        as="select"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        onBlur={(e) => setSelectedCity(e.target.value)}
        disabled={cities.length === 0 || selectedCity === 'disabled'}>
        <option>Seleccione...</option>
        {cities.map((item) => (
          <option
            key={item.id}
            value={item.id}
            id={`use-dropdown-option-${item.id}`}>
            {item.name}
          </option>
        ))}
      </Form.Control>
    </React.Fragment>
  );

  return (
    <Container className="setPlace">
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="4">
            {departmentsDropdown()}
          </Form.Group>
          <Form.Group as={Col} md="4">
            {citiesDropdown()}
          </Form.Group>
        </Form.Row>
        {loading && <Spinner animation="border" size="sm" />}
        <p className="lead">
          Ridepro agendara el servicio usando alguna de las pistas que
          <br />
          selecciones a continuación.
        </p>
        <Form.Row className="justify-content-md-center">
          <Form.Group as={Col} md="4">
            <Card className={noTrack ? 'bg-disabled' : ''}>
              <Card.Body>
                <TracksDropdown />
                {!filteredTracks.length && city.id ? (
                  <div className="d-flex justify-content-center mt-2">
                    <small className="font-italic text-danger">
                      No tienes pistas en {department.name}
                    </small>
                  </div>
                ) : (
                  ''
                )}
                <Button
                  variant="info"
                  size="sm"
                  onClick={handleClick}
                  className="mt-2">
                  Agregar pista
                </Button>
              </Card.Body>
            </Card>
          </Form.Group>

          <Form.Group as={Col} md="4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-center mt-3">
                  <h5>Dejar que Ridepro encuentre una pista</h5>
                </div>
                <Form.Check
                  onChange={handleCheckChange}
                  checked={noTrack}
                  label="Pista Ridepro"
                  type="switch"
                  id="custom-switch"
                />
              </Card.Body>
            </Card>
          </Form.Group>
        </Form.Row>
        <Form.Row className="justify-content-center mt-2">
          <Button type="submit">Continuar</Button>
        </Form.Row>
      </Form>
      {showModalTracks && (
        <ModalNewTrack
          handleClose={() => setShowModalTracks(false)}
          fetchTracks={() =>
            fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`)
          }
        />
      )}
    </Container>
  );
};

export default SetPlace;
