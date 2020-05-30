import React from "react";
import { Card } from "react-bootstrap";

const AllUsers = (props) => {
  return (
    <Card className="allUsers mt-3">
      <Card.Body>
        <Card.Title>Usuarios</Card.Title>
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Clientes</Card.Title>
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Conductores</Card.Title>
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>Staff</Card.Title>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default AllUsers;
