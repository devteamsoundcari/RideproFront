import React from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "./AllProviders.scss";

const AllProviders = (props) => {
  const columns = [
    {
      dataField: "official_id",
      text: "Identificación",
      sort: true,
    },
    {
      dataField: "name",
      text: "Nombre",
    },
    {
      dataField: "municipality.name",
      text: "Ciudad",
      sort: true,
    },
    {
      dataField: "services",
      text: "Servicios",
      sort: true,
    },
    {
      dataField: "municipality.department.name",
      text: "Departamento",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "cellphone",
      text: "Teléfono",
    },
  ];

  return (
    <Card className="allUsers mt-3">
      <Card.Body>
        <Card.Title>Servicios</Card.Title>
        <Card.Body>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={props.providers}
            columns={columns}
            pagination={paginationFactory()}
            hover
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllProviders;
