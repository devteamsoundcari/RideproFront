import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Col, Image, Row, Modal, Form, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext.js";
import { editTrack } from "../../controllers/apiRequests";
import MapContainer from "./ModalNewTrack/MapContainer";
import { Track } from "./Tracks";
import TrackPictureEditModal from "./TrackPictureEditModal";

interface TrackEditModalProps {
  onHide: () => void;
  onTrackUpdate: (track: Track) => void
  track: Track;
}

interface TrackEditModalFormValues {
  name: string;
  address: string;
  fare?: number;
  description: string;
  department: string
  city: string;
  cellphone: string;
  contactName: string;
  contactEmail: string;
}

export const TrackEditModal: React.FC<TrackEditModalProps> = (
  props: TrackEditModalProps
) => {
  const [stage, setStage] = useState("waiting");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showTrackPictureEditModal, setShowTrackPictureEditModal] = useState(false);
  const [activateMap, setActivateMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const defaultImage = require("../../assets/img/track.jpg");

  const [submittedData, setSubmittedData] = useState();
  const { userInfoContext } = useContext(AuthContext);
  const defaultValues: TrackEditModalFormValues = {
    name: props.track.name,
    address: props.track.address,
    department: props.track.municipality.department.name,
    description: props.track.description,
    city: props.track.municipality.name,
    cellphone: props.track.cellphone,
    contactName: props.track.contactName,
    contactEmail: props.track.contactEmail,
  };
  if (userInfoContext.profile !== 2) { defaultValues.fare = props.track.fare };

  const form = useForm({ defaultValues: defaultValues });
  const { handleSubmit, control, watch } = form;
  const formValues = watch();
  const [canSave, setCanSave] = useState(false);

  const onSubmit = (data: any) => {
    setShowConfirmationModal(true);
    setStage("confirmation");
    setSubmittedData(data);
  };

  const save = async () => {
    setStage("loading");
    let data = Object.assign(submittedData!);
    let payload = {
      "description": data.description
    };

    let result = await editTrack(props.track.id, payload);
    if (result) {
      props.onTrackUpdate(result);
      setStage("success");
    }
  };

  const handleAccept = () => {
    setShowConfirmationModal(false);
    setStage("waiting");
  };

  useEffect(() => {
    const defaultValuesKeys = Object.keys(defaultValues).sort();
    const currentFormValuesKeys = Object.keys(formValues).sort();

    if (defaultValuesKeys.length !== currentFormValuesKeys.length) {
      setCanSave(true);
      return;
    }

    for (let key of defaultValuesKeys) {
      if (defaultValues[key] !== formValues[key]) {
        setCanSave(true);
        return;
      }
    }

    setCanSave(false);
  }, [defaultValues, form, formValues]);

  const exit = () => {
    props.onHide();
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const confirmationModal = () => {
    return (
      <Modal
        centered
        size="sm"
        className="child-modal"
        show={showConfirmationModal}
        onHide={hideConfirmationModal}
      >
        {stage === "confirmation" && confirmationMessage()}
        {stage === "loading" && loadingSpinner()}
        {stage === "success" && successMessage()}
      </Modal>
    );
  };

  const confirmationMessage = () => {
    return (
      <>
        <Modal.Body>
          <h4>¿Estás seguro de cambiar tus datos?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button className={`btn-${userInfoContext.perfil}`} onClick={save}>
            Si
          </Button>
          <Button variant="secondary" onClick={hideConfirmationModal}>
            No, regresar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const loadingSpinner = () => {
    return (
      <>
        <Modal.Body>
          <Spinner animation="border" role="status" size="sm">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        </Modal.Body>
      </>
    );
  };

  const successMessage = () => {
    return (
      <>
        <Modal.Body>
          <h4>Tus datos han sido modificados exitosamente.</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={`btn-${userInfoContext.perfil}`}
            onClick={handleAccept}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const trackPictureEditModal = () => {
    return (
      <TrackPictureEditModal
        className="child-modal"
        trackId={props.track.id}
        show={showTrackPictureEditModal}
        onHide={closeTrackPictureEditModal}
        onUpdate={() => props.onTrackUpdate(props.track)}
        picture={props.track.pictures}
      />
    );
  };

  const handleTrackPictureEditModal = () => {
    setShowTrackPictureEditModal(true);
  };

  const closeTrackPictureEditModal = () => {
    setShowTrackPictureEditModal(false);
  };

  return (
    <Modal
      size={"lg"}
      show={true}
      onHide={exit}
      className="modal-new-track"
    >
      <Modal.Header closeButton className={`bg-${userInfoContext.perfil}`}>
        <Modal.Title className="text-white">
          Editar pista
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Row>
            <Col>
              <Row>
                <Col>
                  <Image
                      src={
                        props.track.pictures !== "na"
                          ? props.track.pictures
                          : defaultImage
                      }
                      width={251}
                      height={201}
                      thumbnail
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="link" size="sm" onClick={handleTrackPictureEditModal}>
                      Editar
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Departamento</Form.Label>
                    <Controller
                      as={<Form.Control type="text" />}
                      name="department"
                      control={control}
                      disabled={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Ciudad</Form.Label>
                    <Controller
                      as={<Form.Control type="text" />}
                      name="city"
                      control={control}
                      disabled={true}
                    />
                  </Form.Group>
                </Form.Row>
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nombre del lugar</Form.Label>
                <Controller
                  as={<Form.Control type="text" />}
                  name="name"
                  control={control}
                  disabled={true}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Dirección</Form.Label>
                <Controller
                  as={<Form.Control type="text" />}
                  name="address"
                  control={control}
                  disabled={true}
                 />
              </Form.Group>
              {userInfoContext.profile !== 2 && (
                <Form.Group as={Col} controlId="formGridFare">
                  <Form.Label>Tarifa promedio</Form.Label>
                  <Controller
                    as={<Form.Control type="text" />}
                    name="fare"
                    control={control}
                    disabled={true}
                  />
                </Form.Group>
              )}
            </Form.Row>
            {props.track.latitude !== "na" && props.track.longitude !== "na" && (
              <Row className="map-section">
                <Col className="pr-0">
                  <div className="mt-3 map-text">
                    <h6>UBICACIÓN EN EL MAPA</h6>
                    <Form.Check
                      type="switch"
                      id="custom-switch-map"
                      onChange={() => setActivateMap(!activateMap)}
                      label="Agregar ubicación"
                    />
                    {activateMap && (
                      <div className="coords">
                        <small>Latitud: {lat}</small>{" "}
                        <small>Longitud: {lng}</small>
                      </div>
                    )}
                  </div>
                </Col>
                <Col>
                  <MapContainer
                    isMarkerShown={activateMap}
                    markerName={"ubicacion"}
                    containerElement={
                      <div
                        className={`map-container ${activateMap ? "active" : ""}`}
                      />
                    }
                    latitude={(x) => setLat(x)}
                    longitude={(x) => setLng(x)}
                  />
                </Col>
              </Row>
            )}

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Descripción</Form.Label>
              <Controller
                as={<Form.Control as="textarea" />}
                name="description"
                control={control}
              />
            </Form.Group>

            <hr />
            <Form.Row>
              <Form.Group as={Col} controlId="formGridContactName">
                <Form.Label>Persona de contacto</Form.Label>
                <Controller
                  as={<Form.Control type="text" />}
                  name="contactName"
                  control={control}
                  disabled={true}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridContactPhone">
                <Form.Label>Teléfono de contacto</Form.Label>
                <Controller
                  as={<Form.Control type="text" />}
                  name="cellphone"
                  control={control}
                  disabled={true}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridContactEmail">
                <Form.Label>Email de contacto</Form.Label>
                <Controller
                  as={<Form.Control type="text" />}
                  name="contactEmail"
                  control={control}
                  disabled={true}
                />
              </Form.Group>
            </Form.Row>
            <Form.Group id="formGridCheckbox">
              <Form.Check type="checkbox" label="Añadir a pistas favoritas" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={`btn-${userInfoContext.perfil}`}
              type="submit"
              disabled={!canSave}
            >
              Guardar
            </Button>
            <Button variant="secondary" onClick={exit}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Form>
        {confirmationModal()}
        {trackPictureEditModal()}
      </Modal>
    );
  };
