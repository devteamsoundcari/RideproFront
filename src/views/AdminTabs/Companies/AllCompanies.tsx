import React from "react";
import { Card, Image } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
type AllCompaniesProps = any;

const AllCompanies: React.FC<AllCompaniesProps> = ({ companies }) => {
  const logoFormatter = (cell) => {
    return <Image src={cell} roundedCircle width="50" height="50" />;
  };

  const columns = [
    {
      dataField: "logo",
      text: "Logo",
      formatter: logoFormatter,
      classes: "md-column",
      headerClasses: "md-column",
    },
    {
      dataField: "name",
      text: "Nombre",
      sort: true,
    },

    {
      dataField: "nit",
      text: "Nit",
      sort: true,
    },
    {
      dataField: "address",
      text: "Dirección",
    },
    {
      dataField: "phone",
      text: "Teléfono",
    },
    {
      dataField: "arl",
      text: "ARL",
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
        <Card.Title>Empresas</Card.Title>
        <Card.Body>
          <ToolkitProvider
            bootstrap4
            // defaultSorted={defaultSorted}
            keyField="id"
            data={companies}
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
export default AllCompanies;
