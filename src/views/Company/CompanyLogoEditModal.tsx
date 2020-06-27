import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Container,
  Modal,
  Col,
  Row,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { setCompanyLogo, getUserInfo } from "../../controllers/apiRequests";
import "./CompanyLogoEditModal.scss";


const CompanyLogoEditModal = (props: any) => {
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const { company } = userInfoContext;
  const [imageName, setImageName] = useState("Importar imagen");
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>();
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement>();

  const save = async (e: any) => {
    e.preventDefault();
    setCompanyLogo(company.id, selectedImage).then(async (result) => {
      if (result.status === 200) {
        let newUserInfo = await getUserInfo();
        setUserInfoContext(newUserInfo);
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
      setImgSrc(reader.result);
    };
  };


  return (
    <Modal show={props.show} onHide={props.onHide} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Logo</Modal.Title>
      </Modal.Header>
      <Form className="upload-company-logo-form" onSubmit={save}>
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col>
                <Image src={imgSrc ? imgSrc : company.logo} fluid />
              </Col>
            </Row>
            <Row>
              <Form.Group as={Col} className="upload-file">
              <Form.File
               name="logo"
               onChange={onFileUpload}
               className="custom-file-label"
               label={imageName}
               custom
              />
              </Form.Group>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CompanyLogoEditModal;
