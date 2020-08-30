import React from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "../../Usuarios/AllUsers/AllUsers.scss";
import "./AllSuperClients.scss";
import ExpandSection from "./ExpandSection";

const AllSuperClients = (props) => {
  const columns = [
    {
      dataField: "id",
      text: "Id",
      sort: true,
      classes: "small-column",
      headerClasses: "small-column",
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
      dataField: "company.name",
      text: "Empresa",
      sort: true,
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

  const expandRow = {
    parentClassName: "parent-row",
    className: "expanding-foo",
    onlyOneExpanding: true,
    renderer: (row) => <ExpandSection row={row} />,
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
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
                <BootstrapTable
                  {...props.baseProps}
                  expandRow={expandRow}
                  rowClasses={"rowClass"}
                />
              </div>
            )}
          </ToolkitProvider>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllSuperClients;
