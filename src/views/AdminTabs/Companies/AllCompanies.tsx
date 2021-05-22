import React from "react";
import { Card, Image } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
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
      classes: "lg-column",
      headerClasses: "lg-column",
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

  const options = {
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    showTotal: true,
    totalSize: companies.length,
  };
  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div>
      <PaginationListStandalone {...paginationProps} />
      <ToolkitProvider keyField="id" columns={columns} data={companies} search>
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
        <Card.Title>{`Empresas (${companies.length})`}</Card.Title>
        <Card.Body>
          <PaginationProvider pagination={paginationFactory(options)}>
            {contentTable}
          </PaginationProvider>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};
export default AllCompanies;
