import React from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "../Usuarios/AllUsers/AllUsers.scss";

const AllSuperClients = (props) => {
  const profileFormatter = (cell, row) => {
    let profileName = "";
    switch (row.profile) {
      case 1:
        profileName = "Admin";
        break;
      case 2:
        profileName = "Cliente";
        break;
      case 3:
        profileName = "Operaciones";
        break;
      case 5:
        profileName = "Técnico";
        break;
      case 7:
        profileName = "SuperCliente";
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
      text: "Email",
    },
  ];

  const MySearch = (props) => {
    let input;
    const handleChange = () => {
      props.onSearch(input.value);
    };
    return (
      <div>
        <input
          className="form-control"
          // style={{ backgroundColor: "pink" }}
          placeholder="Buscar..."
          ref={(n) => (input = n)}
          onChange={handleChange}
          type="text"
        />
      </div>
    );
  };

  return (
    <Card className="allUsers mt-3 mb-5">
      <Card.Body>
        <Card.Title>Superusuarios</Card.Title>
        <Card.Body>
          <ToolkitProvider
            bootstrap4
            // defaultSorted={defaultSorted}
            keyField="id"
            data={props.users}
            columns={columns}
            pagination={paginationFactory()}
            hover
            search
          >
            {(props) => (
              <div>
                <MySearch {...props.searchProps} />
                <hr />
                <BootstrapTable {...props.baseProps} />
              </div>
            )}
          </ToolkitProvider>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllSuperClients;
