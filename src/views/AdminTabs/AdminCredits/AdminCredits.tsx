import React, { useEffect, useState } from "react";
import AllUsers from "../Usuarios/AllUsers/AllUsers";
import { getUsers } from "../../../controllers/apiRequests";
import { Button } from "react-bootstrap";
import NewCredit from "./NewCredit";

type AdminCreditsProps = any;
const AdminCredits: React.FC<AdminCreditsProps> = () => {
  const [users, setUsers] = useState<any>([]);
  const [showNewCredit, setShowNewCredit] = useState(true);

  const fetchUsers = async (url) => {
    const response = await getUsers(url);
    setUsers((oldArr) => [...oldArr, ...response.results]);
    if (response.next) {
      return await fetchUsers(response.next);
    }
  };
  useEffect(() => {
    fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
    // eslint-disable-next-line
  }, []);
  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setShowNewCredit(true)}>
        Asignar créditos
      </Button>
      {showNewCredit && (
        <NewCredit handleClose={() => setShowNewCredit(false)} users={users} />
      )}
      <AllUsers users={users} />
    </React.Fragment>
  );
};
export default AdminCredits;
