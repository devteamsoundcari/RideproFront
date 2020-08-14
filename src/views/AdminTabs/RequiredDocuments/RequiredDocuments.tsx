import React from "react";
import NewDocument from "./NewDocument";
import AllDocuments from "./AllDocuments";
type RequiredDocumentsProps = any;

const RequiredDocuments: React.FC<RequiredDocumentsProps> = () => {
  return (
    <React.Fragment>
      <NewDocument />
      <AllDocuments />
    </React.Fragment>
  );
};
export default RequiredDocuments;
