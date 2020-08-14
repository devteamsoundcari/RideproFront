import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { getDocuments } from "../../../controllers/apiRequests";
type AllDocumentsProps = any;

const AllDocuments: React.FC<AllDocumentsProps> = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      let res = await getDocuments();
      if (res) {
        setDocuments(res.results);
      } else {
        console.log("No hay empresas registradas");
      }
    }
    fetchDocuments();
  }, []);

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
        <Card.Title>Documentos</Card.Title>
        <Card.Body>
          <ToolkitProvider
            bootstrap4
            // defaultSorted={defaultSorted}
            keyField="id"
            data={documents}
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
export default AllDocuments;
