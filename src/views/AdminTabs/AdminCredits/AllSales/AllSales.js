import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { dateFormatter } from "../../../../utils/helpFunctions";

import "./AllSales.scss";

const AllSales = (props) => {
  const buyerFormatter = (cell, row) => {
    return `${row.buyer.first_name} ${row.buyer.last_name}`;
  };

  const sellerFormatter = (cell, row) => {
    return `${row.seller.first_name} ${row.seller.last_name}`;
  };

  const paymentFormatter = (cell, row) => {
    switch (row.payment_method) {
      case "cash":
        return "Efectivo";
      case "cupos":
        return "Cupos Arl";
      case "hours":
        return "Horas Arl";
      default:
        return "undefined";
    }
  };

  const columns = [
    {
      dataField: "bill_id",
      text: "Id",
      sort: true,
      classes: "small-column",
      headerClasses: "small-column",
      formatter: (cell) => <small>{cell}</small>,
    },
    {
      dataField: "buyer.first_name",
      text: "Vendido a",
      formatter: buyerFormatter,
    },
    {
      dataField: "buyer.email",
      text: "Email",
      formatter: (cell) => <small>{cell}</small>,
    },
    {
      dataField: "seller.email",
      text: "Vendido por",
      sort: true,
      formatter: sellerFormatter,
    },
    {
      dataField: "payment_method",
      text: "Forma de pago",
      sort: true,
      formatter: paymentFormatter,
    },
    {
      dataField: "created_at",
      text: "Fecha",
      formatter: (cell) => dateFormatter(cell),
      sort: true,
    },
    {
      dataField: "credits",
      text: "Cred",
      classes: "small-column",
      headerClasses: "small-column",
      formatter: (cell) => <p>{cell}</p>,
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
    renderer: (row) => (
      <Row className="expand-credits">
        <Col md={6}>
          <h6>Observaciones / Concepto:</h6>
          <div className="notes-wrapper">
            <p>{row.notes}</p>
          </div>
        </Col>
        <Col md={3}>
          <h6>Forma de Pago:</h6>
          <p>{paymentFormatter("", row)}</p>
          <h6>Valor:</h6>
          <p>{row.value}</p>
        </Col>
        <Col md={3}>
          <h6>Creditos asignados:</h6>
          <p>{row.credits}</p>
          {row.file && (
            <React.Fragment>
              <h6>Orden de compra:</h6>
              <a href={row.file} target="n_blank">
                link
              </a>
            </React.Fragment>
          )}
        </Col>
      </Row>
    ),
  };

  return (
    <Card className="allUsers mt-3 mb-5">
      <Card.Body>
        <Card.Title>Historial de creditos</Card.Title>
        <Card.Body>
          <ToolkitProvider
            bootstrap4
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

export default AllSales;
