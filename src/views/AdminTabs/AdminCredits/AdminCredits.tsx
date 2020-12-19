import React, { useEffect, useState } from "react";
import AllSales from "./AllSales/AllSales";
import { getUsers } from "../../../controllers/apiRequests";
import { Button } from "react-bootstrap";
import NewCredit from "./NewCredit";

type AdminCreditsProps = any;
const AdminCredits: React.FC<AdminCreditsProps> = () => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const [sales, setSales] = useState<any>([]);
  const [showNewCredit, setShowNewCredit] = useState(false);

  const fetchUsers = async (url) => {
    setLoading(true);
    const response = await getUsers(url);
    setUsers((oldArr) => [...oldArr, ...response.results]);
    if (response.next) {
      return await fetchUsers(response.next);
    }
    setLoading(false);
  };

  const fetchSales = async (url) => {
    setLoading(true);
    const response = await getUsers(url);
    setSales((oldArr) => [...oldArr, ...response.results]);
    if (response.next) {
      return await fetchSales(response.next);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
    fetchSales(`${process.env.REACT_APP_API_URL}/api/v1/sale_credits/`);
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setShowNewCredit(true)}>
        Asignar créditos
      </Button>
      {showNewCredit && (
        <NewCredit
          handleClose={() => setShowNewCredit(false)}
          users={users}
          onUpdate={() => {
            setSales([]);
            fetchSales(`${process.env.REACT_APP_API_URL}/api/v1/sale_credits/`);
          }}
        />
      )}
      <AllSales users={sales} />
    </React.Fragment>
  );
};
export default AdminCredits;
