import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { getUsers } from "../../../controllers/apiRequests";
import AllSuperClients from "./AllSuperClients";
import AttachCompanyToUser from "./AttachCompanyToUser";
type SuperClientsProps = any;

const SuperClients: React.FC<SuperClientsProps> = () => {
  const [users, setUsers] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async (url) => {
    const response = await getUsers(url);
    setUsers(response.results.filter((item) => item.profile === 7));
    if (response.next) {
      return await fetchUsers(response.next);
    }
  };
  useEffect(() => {
    fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
    // eslint-disable-next-line
  }, []);
  return (
    <Row>
      <Col>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Asignar empresa a superusuario
        </Button>
        {/* <RegistrarNuevoUsuario
          onUpdate={() => {
            setUsers([]);
            fetchUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
          }}
        /> */}
        {showModal && (
          <AttachCompanyToUser
            handleClose={() => setShowModal(false)}
            onUpdate={() => console.log("As")}
          />
        )}
        <AllSuperClients users={users} />
      </Col>
    </Row>
  );
};
export default SuperClients;
