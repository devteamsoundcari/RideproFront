import React, { useEffect, useState, useContext } from 'react';
import { Modal, Form, Button, Col, Spinner, Row } from 'react-bootstrap';
import { AuthContext, TracksContext } from '../../../contexts';
import { FaCheckCircle } from 'react-icons/fa';
import { PERFIL_CLIENTE, useDropdown, useProfile } from '../../../utils';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import MapContainer from './MapContainer';
import './ModalNewTrack.scss';

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

export const ModalNewTrack: React.FC<Props> = ({
  handleClose,
  fetchTracks
}) => {
  const { register, handleSubmit } = useForm();
  const { userInfo } = useContext(AuthContext);
  const [profile] = useProfile();
  const {
    getDepartments,
    departments,
    getCitiesByDepartmentId,
    cities,
    setCities,
    loadingDepartments,
    loadingCities,
    createNewTrack
  } = useContext(TracksContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department>({
    id: '',
    name: ''
  });

  const [currentCity, setCurrentCity] = useState<City>({ id: '', name: '' });
  const [activateMap, setActivateMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [selectedDepartment, DepartmentsDropdown] = useDropdown(
    'Departamento',
    'Seleccione...',
    departments,
    loadingDepartments
  );
  const [selectedCity, CitiesDropdown] = useDropdown(
    'Ciudad',
    'Seleccione...',
    cities,
    loadingCities
  );

  //========================== HANDLE SUBMIT =====================================

  const onSubmit = async (data: any) => {
    swal({
      title: 'Importante',
      text: 'Une vez crees una pista no podras eliminar o cambiar su nombre/dirección',
      icon: 'warning',
      buttons: ['Volver', 'Continuar'],
      dangerMode: true
    }).then(async (willCreate) => {
      if (willCreate && currentCity.id) {
        setError(false);
        setLoading(true);
        data.trackMunicipality = currentCity.id;
        data.companyId = userInfo.company.id;
        if (userInfo.profile === PERFIL_CLIENTE.profile) {
          data.fare = 0;
        }
        data.latitude = lat;
        data.longitude = lng;
        data.pictures = 'na';
        const response = await createNewTrack(data);
        if (response) {
          setLoading(false);
          swal('Perfecto!', `Pista registrada exitosamente`, 'success');
          fetchTracks();
          handleClose();
        } else {
          console.error('Algo paso!, no fue posible crear la pista');
        }
      } else {
        setLoading(false);
      }
    });
  };

  // =========================== FETCHING DEPARTMENTS ===================================

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================== FETCHING CITIES ===================================

  useEffect(() => {
    if (currentDepartment.id && currentDepartment.name) {
      getCitiesByDepartmentId(currentDepartment.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDepartment]);

  // =============================== SET DEPARTMENT ====================================

  useEffect(() => {
    if (!isNaN(selectedDepartment)) {
      const foundDepartment = departments.find(
        ({ id }) => id === parseInt(selectedDepartment)
      );
      setCurrentDepartment(foundDepartment);
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment]);

  // =============================== SET CITY ==========================================

  useEffect(() => {
    if (!isNaN(selectedCity)) {
      const foundCity = cities.find(({ id }) => id === parseInt(selectedCity));
      setCurrentCity(foundCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  return (
    <Modal
      size={loading ? 'sm' : success ? 'sm' : 'lg'}
      show={true}
      onHide={handleClose}
      className="modal-new-track">
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white">
          {loading
            ? 'Creando pista...'
            : success
            ? 'Pista creada!'
            : 'Crear nueva pista'}
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
                  name="trackName"
                  ref={register({ required: true, maxLength: 80 })}
                />
              </Form.Group>

              {userInfo.profile !== 2 && (
                <Form.Group as={Col} controlId="formGridFare">
                  <Form.Label>Tarifa promedio</Form.Label>
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

            <Row className="map-section">
              <Col className="pr-0">
                <Form.Label>Dirección</Form.Label>
                <input
                  className="form-control"
                  type="text"
                  name="trackAddress"
                  ref={register({ required: true, maxLength: 80 })}
                />
                <div className="mt-3 map-text">
                  <h6>
                    UBICACIÓN EN EL MAPA <span>(opcional)</span>
                  </h6>
                  <p>
                    Arrastra el marcador rojo hasta el lugar exacto de la pista.
                    Recuerda que poner una ubicación errornea podra causar
                    retrasos y confusiones.
                  </p>
                  <Form.Check
                    type="switch"
                    id="custom-switch-map"
                    onChange={() => setActivateMap(!activateMap)}
                    label="Agregar ubicación"
                  />
                  {activateMap && (
                    <div className="coords">
                      <small>Latitud: {lat}</small>{' '}
                      <small>Longitud: {lng}</small>
                    </div>
                  )}
                </div>
              </Col>
              <Col>
                <MapContainer
                  isMarkerShown={activateMap}
                  markerName={'ubicacion'}
                  containerElement={
                    <div
                      className={`map-container ${activateMap ? 'active' : ''}`}
                    />
                  }
                  latitude={(x) => setLat(x)}
                  longitude={(x) => setLng(x)}
                />
              </Col>
            </Row>

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
            <Button className={`btn-${userInfo.profile}`} type="submit">
              Agregar
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};
