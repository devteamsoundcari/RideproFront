import React, { useState } from "react";
import { Button } from "react-bootstrap";
import NewDocument from "./NewDocument";
import AllDocuments from "./AllDocuments";
type RequiredDocumentsProps = any;

const RequiredDocuments: React.FC<RequiredDocumentsProps> = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Registrar documentos
      </Button>
      {showModal && <NewDocument handleClose={() => setShowModal(false)} />}
      <AllDocuments />
    </React.Fragment>
  );
};
export default RequiredDocuments;
