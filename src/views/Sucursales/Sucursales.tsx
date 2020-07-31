import React, { useEffect, useState } from "react";
import { Alert, Container, Spinner, Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { getSuperUserCompanies } from "../../controllers/apiRequests";

type SucursalesProps = any;

const Sucursales: React.FC<SucursalesProps> = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================================ FETCH COMPANIES ON LOAD=====================================================
  const fetchCompanies = async () => {
    setLoading(true);
    const response = await getSuperUserCompanies();
    if (response.status === 200) {
      setCompanies(response.data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
    // setCompanies()
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "Cód.",
      headerClasses: "small-column",
      sort: true,
    },
    {
      dataField: "company.name",
      text: "Nombe",
      //   formatter: formatDate,
      sort: true,
    },
    {
      dataField: "company.nit",
      text: "NIT",
      //   formatter: formatDate,
      sort: true,
    },
    {
      dataField: "company.phone",
      text: "Teléfono",
      //   formatter: formatDate,
      sort: true,
    },

    {
      dataField: "company.address",
      text: "Dirección",
      //   formatter: formatDate,
      sort: true,
    },
  ];

  return (
    <Container fluid="md" id="client-requests-history">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Card>
          {companies.length === 0 ? (
            <Alert variant="light">
              <Alert.Heading>¡Sin Sucursales!</Alert.Heading>
              <p>
                Ponte en contacto con Ridepro para que se te sean asignadas tus
                sucursales.
              </p>
            </Alert>
          ) : (
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={companies}
              columns={columns}
              //   selectRow={selectRow}
              filter={filterFactory()}
              pagination={paginationFactory()}
            />
          )}
        </Card>
      )}
    </Container>
  );
};
export default Sucursales;
