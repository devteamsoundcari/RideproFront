import React, { useState, useEffect, useContext } from "react";
import { Card, Form } from "react-bootstrap";
import swal from "sweetalert";
import { setRequestFile } from "../../../../../controllers/apiRequests";
import { FaRegFilePdf, FaCheckCircle } from "react-icons/fa";
import "./SingleFile.scss";
import { RequestsContext } from "../../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../../contexts/AuthContext";

type SingleFileProps = any;

const SingleFile: React.FC<SingleFileProps> = ({ document, requestId }) => {
  const [doc, setDoc] = useState<any>("");
  const [fileName, setFileName] = useState("Vacio");
  const { updateRequests } = useContext(RequestsContext);
  const { userInfoContext } = useContext(AuthContext);

  useEffect(() => {
    setDoc(document);
  }, [document]);

  const onFileUpload = (e: any) => {
    let uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFileName(uploadedFile.name);
      setRequestFile(requestId, doc.id, doc.document.id, uploadedFile).then(
        async (result) => {
          if (result.status === 200) {
            swal("Buen trabajo!", "Carga exitosa!", "success");
            updateRequests();
          }
        }
      );
    } else {
      swal("Oops!", "Solo se permite formato .pdf", "error");
    }
  };

  const renderFileName = () => {
    let name = doc.file.split("/");
    name = name[name.length - 1];
    return name;
  };

  if (doc) {
    return (
      <Card className="single-file">
        <Card.Body>
          <Card.Title>{doc.document.name}</Card.Title>
          <Card.Text>{doc.document.description}</Card.Text>
        </Card.Body>
        {doc.file && (
          <div className="fileSection">
            <a href={doc.file} target={"n_blank"} className="pdf-icon">
              <FaRegFilePdf />
            </a>
            <span className="pdf-icon text-success">
              <FaCheckCircle />
            </span>
          </div>
        )}
        <Form className="m-2">
          <Form.File
            id={`custom-file-${doc.id}`}
            label={doc.file ? renderFileName() : fileName}
            custom
            disabled={userInfoContext.profile !== 3 ? true : false}
            onChange={onFileUpload}
          />
        </Form>
        <Card.Footer>
          Actualización:
          <small className="text-muted">{doc.document.updated_at}</small>
        </Card.Footer>
      </Card>
    );
  } else {
    return <small>Loading...</small>;
  }
};
export default SingleFile;
