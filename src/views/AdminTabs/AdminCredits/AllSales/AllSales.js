import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { getUsers } from "../../../../controllers/apiRequests";
import { dateFormatter } from "../../../../utils/helpFunctions";
import CustomTable from "../../../../components/CustomTable";

const AllSales = (props) => {
  const [sales, setSales] = useState([]);
  const [totalOfSales, setTotalOfSales] = useState(0);
  const SALES_URL = `${process.env.REACT_APP_API_URL}/api/v1/sale_credits/`;

  const fetchSales = async (url, page) => {
    const newUrl = `${url}${page ? page : ""}`;
    const response = await getUsers(newUrl);
    setTotalOfSales(response.count);
    setSales(response.results);
  };

  useEffect(() => {
    fetchSales(`${SALES_URL}?page=`, 1);
    // eslint-disable-next-line
  }, []);

  const buyerFormatter = (cell, row) => {
    return `${row?.buyer?.first_name} ${row?.buyer?.last_name}`;
  };

  const sellerFormatter = (cell, row) => {
    return `${row?.seller?.first_name} ${row?.seller?.last_name}`;
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
      formatter: (cell) => <small>{cell}</small>
    },
    {
      dataField: "buyer.first_name",
      text: "Vendido a",
      formatter: buyerFormatter
    },
    {
      dataField: "buyer.email",
      text: "Email",
      formatter: (cell) => <small>{cell}</small>
    },
    {
      dataField: "seller.email",
      text: "Vendido por",
      sort: true,
      formatter: sellerFormatter
    },
    {
      dataField: "payment_method",
      text: "Forma de pago",
      sort: true,
      formatter: paymentFormatter
    },
    {
      dataField: "created_at",
      text: "Fecha",
      formatter: (cell) => dateFormatter(cell),
      sort: true
    },
    {
      dataField: "credits",
      text: "Cred",
      classes: "small-column",
      headerClasses: "small-column",
      formatter: (cell) => <p>{cell}</p>
    }
  ];

  const handleSearch = (value) => {
    const url = `${SALES_URL}?search=${value}`;
    fetchSales(url);
  };

  const expandRow = {
    parentClassName: "parent-row",
    onlyOneExpanding: true,
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
    )
  };

  const handlePageChange = (page, sizePerPage) => {
    setSales([]);
    fetchSales(`${SALES_URL}?page=`, page);
  };

  return (
    <Card className="allUsers mt-3 mb-5">
      <Card.Body>
        <Card.Title>Historial de creditos</Card.Title>
        <Card.Body>
          <CustomTable
            columns={columns}
            data={sales}
            sizePerPage={25}
            onPageChange={handlePageChange}
            totalSize={totalOfSales}
            expandRow={expandRow}
            onSearch={handleSearch}
            showTopPagination
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
};

export default AllSales;
