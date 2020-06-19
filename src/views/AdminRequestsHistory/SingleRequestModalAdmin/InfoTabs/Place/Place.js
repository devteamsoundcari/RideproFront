import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, ButtonGroup, Form, Card } from "react-bootstrap";
import SearchByName from "../../../../../utils/SearchByName/SearchByName";
import {
  getTracks,
  updateRequest,
} from "../../.../../../../../controllers/apiRequests";
import "./Place.scss";
import { AuthContext } from "../../../../../contexts/AuthContext";
import { RequestsContext } from "../../../../../contexts/RequestsContext";

const Place = (props) => {
  const [tracks, setTracks] = useState([]);
  const [place, setPlace] = useState({});
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [municipality, setMunicipality] = useState("");
  const [fare, setFare] = useState(0);
  const history = useHistory();
  const { userInfoContext } = useContext(AuthContext);
  const { updateRequestsContex } = useContext(RequestsContext);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (props.municipality.id) {
      setMunicipality(
        props.municipality.name.charAt(0).toUpperCase() +
          props.municipality.name.slice(1).toLowerCase()
      );
    }
    if (props.fareTrack) {
      setFare(props.fareTrack);
    }
  }, [props.municipality, props.fareTrack]);

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (url) => {
    let tempTracks = [];
    const response = await getTracks(url);
    response.results.forEach(async (item) => {
      if (item.municipality.id === props.municipality.id) {
        item.municipality.name =
          props.municipality.name.charAt(0).toUpperCase() +
          props.municipality.name.slice(1).toLowerCase();
        tempTracks.push(item);
      }
    });
    setTracks(tempTracks);
    if (response.next) {
      return await getTracks(response.next);
    }
  };
  useEffect(() => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    tracks.forEach((item) => {
      if (userInfoContext.company.id === item.company.id) {
        setFilteredTracks((oldArr) => [...oldArr, item]);
      }
    });
  }, [tracks, userInfoContext.company.id]);

  const hanldeSearch = (item) => {
    setPlace(item);
  };

  // =============================== CLICK ON ADD TRACK ====================================
  const handleClickAddTrack = () => {
    history.push({
      pathname: "/administrador/pistas",
      state: { detail: "some_value" },
    });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (value !== props.fareTrack) {
      setFare(value);
      setDisabled(false);
    }
  };

  const handleUpdatePlace = async () => {
    let res = await updateRequest(
      { fare_track: fare, track: place.id },
      props.requestId
    );
    if (res.status === 200) {
      setDisabled(true);
      updateRequestsContex();
    }
  };

  const addTrack = () => {
    return (
      <Col md="12" className="text-center">
        <h5>Agregar lugar</h5>

        <Row className="place-header-actions">
          <SearchByName
            items={filteredTracks}
            returnedItem={hanldeSearch}
            title="Buscar por nombre"
            city={municipality}
          />
          <div class="btn-toolbar mb-2 mb-md-0">
            <ButtonGroup aria-label="Basic example">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleClickAddTrack}
              >
                Mis pistas
              </Button>
              <Button
                size="sm"
                variant={disabled ? "outline-secondary" : "info"}
                disabled={disabled}
                onClick={handleUpdatePlace}
              >
                Guardar Lugar
              </Button>
            </ButtonGroup>
          </div>
        </Row>
        {place.name && renderTrack(place)}
      </Col>
    );
  };

  const renderTrack = (track) => {
    return (
      <Col md="12">
        <Card className="shadow">
          <Card.Body>
            {!track.fare && <h5>Pista inscrita por el cliente</h5>}
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>Nombre del lugar</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={track.name}
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridAddress">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={track.address}
                    disabled
                  />
                </Form.Group>
                {track.fare !== 0 && (
                  <Form.Group as={Col} controlId="formGridAddress">
                    <Form.Label>Agregar tarifa:</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      value={fare}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
              </Form.Row>
              <Form.Group controlId="formGridDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  size="sm"
                  value={track.description}
                  disabled
                />
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control size="sm" value={municipality} disabled />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Departamento</Form.Label>
                  <Form.Control
                    size="sm"
                    value={track.municipality.department.name}
                    disabled
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formPhone">
                  <Form.Label>Tarifa promedio</Form.Label>
                  <Form.Control size="sm" disabled value={`$ ${track.fare}`} />
                </Form.Group>
              </Form.Row>

              {place && (
                <React.Fragment>
                  <hr />
                  <h6>Contacto</h6>
                  <Form.Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Persona de contacto</Form.Label>
                      <Form.Control
                        size="sm"
                        disabled
                        type="text"
                        value={track.contact_name}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formPhone">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        size="sm"
                        disabled
                        value={track.cellphone}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        disabled
                        size="sm"
                        type="text"
                        value={track.contact_email}
                      />
                    </Form.Group>
                  </Form.Row>
                </React.Fragment>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Row className="requestPlace">
      {props.track ? renderTrack(props.track) : addTrack()}
    </Row>
  );
};

export default Place;
