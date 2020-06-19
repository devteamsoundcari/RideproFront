import React, { useEffect, useState, useContext } from "react";
import {
  getProviders,
  updateRequestProviders,
} from "../../../../../controllers/apiRequests";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { RequestsContext } from "../../../../../contexts/RequestsContext";
// import { AuthContext } from "../../../../../contexts/AuthContext";
import "./Providers.scss";

const Providers = (props) => {
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [requestProviders, setRequestProviders] = useState([]);
  const { SearchBar } = Search;
  // const { userInfoContext } = useContext(AuthContext);
  const { updateRequestsContext } = useContext(RequestsContext);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (selectedProviders.length > 0) {
      setDisabled(false);
    }
  }, [selectedProviders]);

  useEffect(() => {
    if (props.providers.length > 0) {
      setRequestProviders(props.providers);
    }
  }, [props.providers]);

  // ================================ FETCH PROVIDERS ON LOAD =====================================================
  const fetchProviders = async (url) => {
    let tempArr = [];
    const response = await getProviders(url);
    response.results.forEach(async (item) => {
      item.fare = 0;
      console.log(item);
      tempArr.push(item);
    });
    setProviders(tempArr);
    if (response.next) {
      return await fetchProviders(response.next);
    }
  };
  useEffect(() => {
    fetchProviders(`${process.env.REACT_APP_API_URL}/api/v1/providers/`);
    //eslint-disable-next-line
  }, []);

  const columns = [
    {
      dataField: "official_id",
      text: "Identificación",
      editable: false,
    },
    {
      dataField: "name",
      text: "Nombre",
      editable: false,
    },
    {
      dataField: "services",
      text: "Servicios",
      editable: false,
    },
    {
      dataField: "municipality.name",
      text: "Ciudad",
      editable: false,
    },
    {
      dataField: "municipality.department.name",
      text: "Departamento",
      editable: false,
    },
    {
      dataField: "fare",
      text: "Tarifa $",
    },
  ];

  const expandRow = {
    renderer: (row) => (
      <div>
        <ul>
          <li>
            <small>Email: </small>
            {row.email}
          </li>
          <li>
            <small>Teléfono: </small>
            {row.cellphone}
          </li>
          <li>
            <small>Documentos: </small>
            {row.documents}
          </li>
        </ul>
      </div>
    ),
    showExpandColumn: true,
    onlyOneExpanding: true,
  };

  const containsObject = (obj, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === obj.id) {
        return true;
      }
    }
    return false;
  };

  const selectRow = {
    mode: "checkbox",
    clickToSelect: false,
    hideSelectAll: true,
    selectColumnPosition: "right",
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect && row.fare === 0) {
        alert("Por favor añade una tarifa");
        return false;
      }
      if (isSelect) {
        if (!containsObject(row, selectedProviders)) {
          setSelectedProviders((oldArr) => [...oldArr, row]);
        }
      } else {
        if (containsObject(row, selectedProviders)) {
          setSelectedProviders(
            selectedProviders.filter((item) => item.id !== row.id)
          );
        }
      }
    },
  };

  const handleUpdateProvider = async () => {
    let providersIds = {};
    selectedProviders.forEach((prov) => {
      return (providersIds[prov.id] = prov.fare);
    });
    console.log("IDS", providersIds);
    let res = await updateRequestProviders({
      request: props.requestId,
      providers: providersIds,
    });
    if (res.status === 201) {
      setDisabled(true);
      updateRequestsContext();
    }
  };

  return (
    <div>
      <ToolkitProvider
        keyField="official_id"
        data={providers}
        columns={columns}
        search
      >
        {(props) => (
          <React.Fragment>
            <Row>
              <Col className="actions-providers">
                <div>
                  <h5>Buscar proveedor:</h5>
                  <SearchBar {...props.searchProps} />
                </div>
                <ButtonGroup aria-label="Basic example">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    // onClick={handleClickAddinstructor}
                  >
                    Administrar proveedores
                  </Button>
                  <Button
                    size="sm"
                    variant={disabled ? "outline-secondary" : "info"}
                    disabled={disabled ? true : false}
                    onClick={handleUpdateProvider}
                  >
                    Guardar proveedor
                  </Button>
                </ButtonGroup>
              </Col>
              {requestProviders.length > 0 && (
                <Col>
                  <ul className="list-unstyled">
                    <small>Proveedores: </small>
                    {requestProviders.map((ins, idx) => (
                      <li key={idx}>
                        {ins.providers} = <strong>$ {ins.fare}</strong>
                      </li>
                    ))}
                  </ul>
                </Col>
              )}
            </Row>
            <hr />
            <BootstrapTable
              {...props.baseProps}
              expandRow={expandRow}
              selectRow={selectRow}
              cellEdit={cellEditFactory({
                mode: "click",
                afterSaveCell: (oldValue, newValue, row, column) => {
                  if (containsObject(row, selectedProviders)) {
                    setSelectedProviders(
                      selectedProviders.filter((item) => item.id !== row.id)
                    );
                    setSelectedProviders((oldArr) => [...oldArr, row]);
                  }
                },
              })}
            />
          </React.Fragment>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default Providers;
