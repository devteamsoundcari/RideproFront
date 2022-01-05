import React, { useState, useContext } from 'react';
import { Container, Modal, Col, Row, Form, Button, Image, Spinner } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { Track } from '../../../interfaces';
import { useProfile } from '../../../utils';
import { TracksContext } from '../../../contexts';

interface ModalTrackPictureProps {
  className?: string;
  picture: string;
  track: Track;
  show: boolean;
  onHide: () => void;
  onUpdate: Function;
}

export const ModalTrackPicture: React.FC<ModalTrackPictureProps> = (
  props: ModalTrackPictureProps
) => {
  const [profile] = useProfile();
  const { editTrackPicture } = useContext(TracksContext);
  const [stage, setStage] = useState('waiting');
  const [imageName, setImageName] = useState('Importar imagen');
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement>();

  const save = async (e: any) => {
    setStage('loading');
    e.preventDefault();
    editTrackPicture(selectedImage, props.track.id).then(async (result) => {
      if (result.status === 200) {
        props.onUpdate(result.data);
        setStage('success');
      }
    });
  };

  const onFileUpload = (e: any) => {
    let uploadedFile = e.target.files[0];
    let reader = new FileReader();

    if (uploadedFile) {
      let fileName: string;
      fileName = e.target.value.split(String.fromCharCode(92));
      setImageName(fileName[fileName.length - 1]);
      setSelectedImage(uploadedFile);
      reader.readAsDataURL(uploadedFile);
    }

    reader.onloadend = () => {
      setImgSrc(reader.result!.toString());
    };
  };

  const handleExit = () => {
    props.onHide();
  };

  const reset = () => {
    setStage('waiting');
  };

  const loadingMessage = () => {
    return (
      <Modal.Body>
        <Spinner animation="border" variant="danger" />
      </Modal.Body>
    );
  };

  const successMessage = () => {
    return (
      <>
        <Modal.Body>
          <h2>
            La imagen ha sido cambiada exitosamente. <FaCheckCircle />
          </h2>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExit}>
            Regresar
          </Button>
        </Modal.Footer>
      </>
    );
  };

  const uploadFileForm = () => {
    return (
      <>
        <Modal.Header closeButton className={`bg-${profile}`}>
          <Modal.Title className="text-white">Imagen</Modal.Title>
        </Modal.Header>
        <Form className="upload-company-logo-form" onSubmit={save}>
          <Modal.Body>
            <Container fluid>
              <Row>
                <Col>
                  <Image src={imgSrc ? imgSrc : props.picture} fluid />
                </Col>
              </Row>
              <Row>
                <Form.Group as={Col} className="upload-file">
                  <Form.File name="logo" onChange={onFileUpload} label={imageName} custom />
                </Form.Group>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button className={`btn-${profile}`} size="sm" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </>
    );
  };

  return (
    <Modal
      className={props.className}
      show={props.show}
      onHide={props.onHide}
      onExited={reset}
      size="sm"
      centered>
      {stage === 'loading' && loadingMessage()}
      {stage === 'success' && successMessage()}
      {stage === 'waiting' && uploadFileForm()}
    </Modal>
  );
};
