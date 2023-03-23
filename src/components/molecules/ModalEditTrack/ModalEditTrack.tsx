import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Image, Row, Modal, Form, Button, Spinner } from 'react-bootstrap';
import { AuthContext, TracksContext } from '../../../contexts';
import { Track } from '../../../interfaces';
import { useProfile } from '../../../utils';
import defaultImage from '../../../assets/img/track.jpg';
import { GoogleMapContainer } from '../../atoms';
import { ModalTrackPicture } from '../ModalTrackPicture/ModalTrackPicture';

interface ModalEditTrackProps {
  onHide: () => void;
  onTrackUpdate: (track: Track) => void;
  track: Track;
}

interface ModalEditTrackFormValues {
  name: string;
  address: string;
  fare?: number;
  description: string;
  department: string;
  city: string;
  cellphone: string;
  contactName: string;
  contactEmail: string;
}

export const ModalEditTrack: React.FC<ModalEditTrackProps> = (props: ModalEditTrackProps) => {
  const [profile] = useProfile();
  const [stage, setStage] = useState('waiting');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showTrackPictureEditModal, setShowTrackPictureEditModal] = useState(false);
  const [activateMap, setActivateMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const { editTrackInfo } = useContext(TracksContext);
  const [submittedData, setSubmittedData] = useState();
  const { userInfo } = useContext(AuthContext) as any;
  const defaultValues: ModalEditTrackFormValues = {
    name: props.track.name,
    address: props.track.address,
    department: props.track.municipality.department.name,
    description: props.track.description,
    city: props.track.municipality.name,
    cellphone: props.track.cellphone,
    contactName: props.track.contactName,
    contactEmail: props.track.contactEmail
  };
  if (userInfo.profile !== 2) {
    defaultValues.fare = props.track.fare;
  }

  const form = useForm({ defaultValues: defaultValues });
  const { handleSubmit, control, watch } = form;
  const formValues = watch();
  const [canSave, setCanSave] = useState(false);
  const [picture, setPicture] = useState(props.track.pictures);

  const onPictureChange = (track: Track) => {
    setPicture(track.pictures);
    props.onTrackUpdate(track);
  };

  const onSubmit = (data: any) => {
    setShowConfirmationModal(true);
    setStage('confirmation');
    setSubmittedData(data);
  };

  const save = async () => {
    setStage('loading');
    let data = Object.assign(submittedData!);
    let payload = {
      description: data.description
    };

    let result = await editTrackInfo(payload, props.track.id);
    if (result) {
      props.onTrackUpdate(result);
      setStage('success');
    }
  };

  const handleAccept = () => {
    setShowConfirmationModal(false);
    setStage('waiting');
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
        onHide={hideConfirmationModal}>
        {stage === 'confirmation' && confirmationMessage()}
        {stage === 'loading' && loadingSpinner()}
        {stage === 'success' && successMessage()}
      </Modal>
    );
  };

  const confirmationMessage = () => {
    return (
      <>
        <Modal.Body>
          <h4>¿Estás segur@ de actualizar los datos?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button className={`btn-${profile}`} onClick={save}>
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
          <Button className={`btn-${profile}`} onClick={handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const trackPictureEditModal = () => {
    return (
      <ModalTrackPicture
        className="child-modal"
        track={props.track}
        show={showTrackPictureEditModal}
        onHide={() => setShowTrackPictureEditModal(false)}
        onUpdate={onPictureChange}
        picture={picture}
      />
    );
  };

  const handleTrackPictureEditModal = () => {
    setShowTrackPictureEditModal(true);
  };

  return (
    <Modal size={'lg'} show={true} onHide={exit} className="modal-new-track">
      <Modal.Header closeButton className={`bg-${profile}`}>
        <Modal.Title className="text-white">Editar pista</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Row>
            <Col>
              <Row>
                <Col>
                  <Image
                    src={picture ? picture : defaultImage}
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
            {userInfo.profile !== 2 && (
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
          {props.track.latitude !== 'na' && props.track.longitude !== 'na' && (
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
                      <small>Latitud: {lat}</small> <small>Longitud: {lng}</small>
                    </div>
                  )}
                </div>
              </Col>
              <Col>
                <GoogleMapContainer
                  isMarkerShown={activateMap}
                  markerName={'ubicacion'}
                  containerElement={
                    <div className={`map-container ${activateMap ? 'active' : ''}`} />
                  }
                  latitude={(x) => setLat(x)}
                  longitude={(x) => setLng(x)}
                />
              </Col>
            </Row>
          )}

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Descripción</Form.Label>
            <Controller as={<Form.Control as="textarea" />} name="description" control={control} />
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={exit}>
            Cerrar
          </Button>
          <Button className={`btn-${profile}`} type="submit" disabled={!canSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
      {confirmationModal()}
      {trackPictureEditModal()}
    </Modal>
  );
};
