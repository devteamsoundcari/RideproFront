import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
type AllDocumentsProps = any;

const AllDocuments: React.FC<AllDocumentsProps> = ({ documents }) => {
  const linkFormatter = (cell) => {
    if (cell) {
      return (
        <a href={cell} target="n_blank">
          <FaExternalLinkAlt />
        </a>
      );
    }
  };
  const columns = [
    {
      dataField: "name",
      text: "Nombre",
      sort: true,
    },

    {
      dataField: "description",
      text: "Descripción",
      sort: true,
    },
    {
      dataField: "template",
      text: "Plantilla",
      classes: "md-column",
      headerClasses: "md-column",
      formatter: linkFormatter,
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
    totalSize: documents.length,
  };
  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div>
      <PaginationListStandalone {...paginationProps} />
      <ToolkitProvider keyField="id" columns={columns} data={documents} search>
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
        <Card.Title>{`Documentos (${documents.length})`}</Card.Title>
        <Card.Body>
          <PaginationProvider pagination={paginationFactory(options)}>
            {contentTable}
          </PaginationProvider>
        </Card.Body>
      </Card.Body>
    </Card>
  );
};
export default AllDocuments;
