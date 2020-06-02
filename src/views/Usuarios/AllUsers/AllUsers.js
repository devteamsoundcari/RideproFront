import React from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "./AllUsers.scss";

const AllUsers = (props) => {
  const profileFormatter = (cell, row) => {
    console.log("cell", cell, "row", row);
    let profileName = "";
    switch (row.profile) {
      case 1:
        profileName = "Admin";
        break;
      case 2:
        profileName = "Cliente";
        break;
      case 3:
        profileName = "Operario";
        break;
      default:
        profileName = "No definido";
        break;
    }

    return (
      <span>
        <strong>{profileName}</strong>
      </span>
    );
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      sort: true,
      classes: "small-column",
      headerClasses: "small-column",
    },
    {
      dataField: "profile",
      text: "Perfil",
      sort: true,
      classes: "small-column",
      headerClasses: "small-column",
      formatter: profileFormatter,
    },

    {
      dataField: "company.name",
      text: "Empresa",
      sort: true,
    },
    {
      dataField: "first_name",
      text: "Nombre",
    },
    {
      dataField: "last_name",
      text: "Apellido",
    },
    {
      dataField: "email",
      text: "email",
    },
  ];
  return (
    <Card className="allUsers mt-3">
      <Card.Body>
        <Card.Title>Usuarios</Card.Title>
        <Card.Body>
          <BootstrapTable
            bootstrap4
            // defaultSorted={defaultSorted}
            keyField="id"
            data={props.users}
            columns={columns}
            pagination={paginationFactory()}
            hover
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllUsers;
