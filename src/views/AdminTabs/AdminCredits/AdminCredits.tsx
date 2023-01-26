import React, { useState } from "react";
import AllSales from "./AllSales/AllSales";
import { Button } from "react-bootstrap";
import NewCredit from "./NewCredit";

type AdminCreditsProps = any;
const AdminCredits: React.FC<AdminCreditsProps> = () => {
  const [showNewCredit, setShowNewCredit] = useState(false);

  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setShowNewCredit(true)}>
        Asignar créditos
      </Button>
      {showNewCredit && (
        <NewCredit
          handleClose={() => setShowNewCredit(false)}
          onUpdate={() => {
            console.log("TODO: reload data");
          }}
        />
      )}
      <AllSales />
    </React.Fragment>
  );
};
export default AdminCredits;
