import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import NewCompany from "./NewCompany";
import AllCompanies from "./AllCompanies";
import { getUsers } from "../../../controllers/apiRequests";

type CompaniesProps = any;

const Companies: React.FC<CompaniesProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<any>([]);

  const fetchCompanies = async (url) => {
    let oldArr: any = [];
    const response = await getUsers(url);
    response.results.forEach((cpny: any) => oldArr.push(cpny));
    setCompanies((x) => [...x, ...oldArr]);
    if (response.next) {
      return await fetchCompanies(response.next);
    }
  };
  useEffect(() => {
    fetchCompanies(`${process.env.REACT_APP_API_URL}/api/v1/companies/`);
    // eslint-disable-next-line
  }, []);

  const hanldeUpdate = () => {
    fetchCompanies(`${process.env.REACT_APP_API_URL}/api/v1/companies/`);
  };

  return (
    <React.Fragment>
      <Button onClick={() => setShowModal(true)}>Registrar empresa</Button>
      {showModal && (
        <NewCompany
          handleClose={() => setShowModal(false)}
          onUpdate={() => hanldeUpdate()}
        />
      )}
      <AllCompanies companies={companies} />
    </React.Fragment>
  );
};
export default Companies;
