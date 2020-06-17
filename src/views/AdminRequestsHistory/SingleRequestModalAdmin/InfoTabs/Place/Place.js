import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, ButtonGroup, Form, Card } from "react-bootstrap";
import SearchByName from "../../../../../utils/SearchByName/SearchByName";
import { getTracks } from "../../.../../../../../controllers/apiRequests";
import "./Place.scss";

const Place = (props) => {
  const [tracks, setTracks] = useState([]);
  const [place, setPlace] = useState({});
  const [municipality, setMunicipality] = useState("");
  const [fare, setFare] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if (props.municipality.id) {
      setMunicipality(
        props.municipality.name.charAt(0).toUpperCase() +
          props.municipality.name.slice(1).toLowerCase()
      );
    }
  }, [props.municipality]);

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

  const addTrack = () => {
    return (
      <Col md="12">
        <Row className="place-header-actions">
          <SearchByName
            items={tracks}
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
                Añadir pistas
              </Button>
              <Button
                size="sm"
                variant={fare > 10000 ? "info" : "outline-secondary"}
                disabled={fare > 10000 ? false : true}
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
                <Form.Group as={Col} controlId="formGridAddress">
                  <Form.Label>Tarifa:</Form.Label>
                  <Form.Control
                    size="sm"
                    type={place.id ? "number" : "text"}
                    value={place.id ? fare : "No aplica"}
                    disabled={place.id ? false : true}
                    onChange={(e) => setFare(e.target.value)}
                  />
                </Form.Group>
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
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control size="sm" disabled />
                </Form.Group>
              </Form.Row>

              {place && (
                <React.Fragment>
                  <hr />
                  <h6>Contacto</h6>
                  <Form.Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        size="sm"
                        disabled
                        type="text"
                        defaultValue="Mark"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        size="sm"
                        disabled
                        type="text"
                        defaultValue="Otto"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        disabled
                        size="sm"
                        type="text"
                        defaultValue="otto@gmail.com"
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
