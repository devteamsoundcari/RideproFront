import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "./AllInstructors.scss";

const AllInstructors = (props) => {

  const columns = [
    {
      dataField: "official_id",
      text: "Identificación",
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
      dataField: "municipality.name",
      text: "Ciudad",
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
      text: "Teléfono"
    }
  ];

  return (
    <Card className="allUsers mt-3">
      <Card.Body>
        <Card.Title>Instructores</Card.Title>
        <Card.Body>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={props.instructors}
            columns={columns}
            pagination={paginationFactory()}
            hover
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllInstructors;
