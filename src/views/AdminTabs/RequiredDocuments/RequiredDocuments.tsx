import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import NewDocument from "./NewDocument";
import AllDocuments from "./AllDocuments";
import { getDocuments } from "../../../controllers/apiRequests";

type RequiredDocumentsProps = any;

const RequiredDocuments: React.FC<RequiredDocumentsProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);

  async function fetchDocuments() {
    let res = await getDocuments();
    if (res) {
      setDocuments(res.results);
    } else {
      console.log("No hay empresas registradas");
    }
  }
  useEffect(() => {
    fetchDocuments();
    //eslinnd-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Registrar documentos
      </Button>
      {showModal && (
        <NewDocument
          handleClose={() => setShowModal(false)}
          onUpdate={() => fetchDocuments()}
        />
      )}
      <AllDocuments documents={documents} />
    </React.Fragment>
  );
};
export default RequiredDocuments;
