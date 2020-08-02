import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Container,
  Modal,
  Col,
  Row,
  Form,
  Button,
  Image,
  Spinner,
} from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { setUserProfilePicture } from "../../controllers/apiRequests";
import "./ProfilePictureEditModal.scss";

const ProfilePictureEditModal = (props: any) => {
  const { userInfoContext, updateUserInfo } = useContext(AuthContext);
  const [stage, setStage] = useState("waiting");
  const [imageName, setImageName] = useState("Importar imagen");
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>();
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement>();

  const save = async (e: any) => {
    setStage("loading");
    e.preventDefault();
    setUserProfilePicture(userInfoContext, selectedImage).then(
      async (result) => {
        if (result.status === 200) {
          updateUserInfo().then(() => {
            setStage("success");
          });
        }
      }
    );
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
      setImgSrc(reader.result);
    };
  };

  const handleExit = () => {
    props.onHide();
  };

  const reset = () => {
    setStage("waiting");
  };

  const loadingMessage = () => {
    return (
      <>
        <Modal.Body>
          <Spinner animation="border" variant="danger" />
        </Modal.Body>
      </>
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
        <Modal.Header closeButton>
          <Modal.Title>Logo</Modal.Title>
        </Modal.Header>
        <Form className="upload-company-logo-form" onSubmit={save}>
          <Modal.Body>
            <Container fluid>
              <Row>
                <Col>
                  <Image src={imgSrc ? imgSrc : userInfoContext.picture} fluid />
                </Col>
              </Row>
              <Row>
                <Form.Group as={Col} className="upload-file">
                  <Form.File
                    name="logo"
                    onChange={onFileUpload}
                    label={imageName}
                    custom
                  />
                </Form.Group>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={`btn-${userInfoContext.perfil}`}
              size="sm"
              type="submit"
            >
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
      centered
    >
      {stage === "loading" && loadingMessage()}
      {stage === "success" && successMessage()}
      {stage === "waiting" && uploadFileForm()}
    </Modal>
  );
};

export default ProfilePictureEditModal;
