import React from "react";
import NewCompany from "./NewCompany";
import AllCompanies from "./AllCompanies";

type CompaniesProps = any;

const Companies: React.FC<CompaniesProps> = () => {
  return (
    <React.Fragment>
      <NewCompany />
      <AllCompanies />
    </React.Fragment>
  );
};
export default Companies;
