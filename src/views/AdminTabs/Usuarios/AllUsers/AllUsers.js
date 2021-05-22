import React from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "./AllUsers.scss";

const AllUsers = (props) => {
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
      dataField: "profile",
      text: "Perfil",
      sort: true,
      classes: "md-column",
      headerClasses: "md-column",
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
      text: "Email",
      classes: "lg-column",
      headerClasses: "lg-column",
    },
    {
      dataField: "credit",
      text: "Cred",
      classes: "small-column",
      headerClasses: "small-column",
      formatter: (cell) => <p>${cell}</p>,
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

  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    showTotal: true,
    totalSize: props.users.length,
  };
  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div>
      <PaginationListStandalone {...paginationProps} />
      <ToolkitProvider
        keyField="id"
        columns={columns}
        data={props.users}
        search
      >
        {(toolkitprops) => (
          <div>
            <MySearch {...toolkitprops.searchProps} />
            <BootstrapTable
              striped
              hover
              {...toolkitprops.baseProps}
              {...paginationTableProps}
            />
          </div>
        )}
      </ToolkitProvider>
      <PaginationListStandalone {...paginationProps} />
    </div>
  );

  return (
    <Card className="allUsers mt-3 mb-5">
      <Card.Body>
        <Card.Title>{`Usuarios (${props.users.length})`}</Card.Title>
        <Card.Body>
          <PaginationProvider pagination={paginationFactory(options)}>
            {contentTable}
          </PaginationProvider>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllUsers;
