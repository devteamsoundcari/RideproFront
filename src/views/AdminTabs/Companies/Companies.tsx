import React, { useState } from "react";
import { Button } from "react-bootstrap";
import NewCompany from "./NewCompany";
import AllCompanies from "./AllCompanies";

type CompaniesProps = any;

const Companies: React.FC<CompaniesProps> = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <React.Fragment>
      <Button onClick={() => setShowModal(true)}>Registrar empresa</Button>
      {showModal && <NewCompany handleClose={() => setShowModal(false)} />}
      <AllCompanies />
    </React.Fragment>
  );
};
export default Companies;
