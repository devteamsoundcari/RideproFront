import React, { useEffect, useState, useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Row, Col, ButtonGroup, Button, Modal, Image } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getProviders,
  updateRequestProviders,
} from "../../../../controllers/apiRequests";
import { RequestsContext } from "../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./ModalProviders.scss";

interface ModalProvidersProps {
  requestId: number;
  handleClose: () => void;
  propsProviders: any[];
}

type SelectedProviders = any;

const ModalProviders: React.FC<ModalProvidersProps> = ({
  requestId,
  handleClose,
  propsProviders,
}) => {
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState<SelectedProviders>(
    []
  );
  // eslint-disable-next-line
  const [requestProviders, setRequestProviders] = useState<any[]>([]);
  const { updateRequests } = useContext(RequestsContext);
  const [disabled, setDisabled] = useState(true);
  const { userInfoContext } = useContext(AuthContext);
  const { SearchBar } = Search;
  const history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    if (selectedProviders.length > 0) {
      setDisabled(false);
    }
  }, [selectedProviders]);

  useEffect(() => {
    if (propsProviders.length > 0) {
      setRequestProviders(propsProviders);
    }
  }, [propsProviders]);

  // ================================ FETCH PROVIDERS ON LOAD =====================================================
  const fetchProviders = async (url) => {
    let tempArr: any = [];
    const response = await getProviders(url);
    response.results.forEach(async (item: any) => {
      item.fare = 0;
      //   item.f_p = 0;
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
      headerClasses: "new-style",
      headerStyle: {
        width: "125px",
      },
    },
    {
      dataField: "name",
      text: "Nombre",
      editable: false,
      headerClasses: "new-style",
    },
    {
      dataField: "services",
      text: "Servicios",
      editable: false,
      headerClasses: "new-style",
    },
    {
      dataField: "municipality.name",
      text: "Ciudad",
      editable: false,
      headerClasses: "new-style",
    },
    {
      dataField: "municipality.department.name",
      text: "Dpto.",
      editable: false,
      headerClasses: "new-style",
      headerStyle: {
        width: "125px",
      },
    },
    {
      dataField: "fare",
      text: "Tarifa $",
      headerClasses: "new-style",
      editCellClasses: "editing-cell",
    },
    // {
    //   dataField: "f_p",
    //   text: "Viaticos $",
    //   headerClasses: "new-style",
    //   editCellClasses: "editing-cell",
    //   headerStyle: {
    //     width: "95px",
    //   },
    // },
  ];

  const expandRow = {
    parentClassName: "parent-expand-foo",
    className: "expanded-div",
    renderer: (row) => (
      <Row>
        <Col md={8}>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Email:</td>
                <td className="users-view-username">{row.email}</td>
              </tr>
              <tr>
                <td>Teléfono:</td>
                <td className="users-view-name">{row.cellphone}</td>
              </tr>
              <tr>
                <td>Documentos:</td>
                <td className="users-view-email"> {row.documents}</td>
              </tr>
              {/* <tr>
                <td>Foto:</td>
                <td>{row.picture}</td>
              </tr> */}
            </tbody>
          </table>
        </Col>
        <Col md={4} className="text-center  my-auto">
          <Image src="https://via.placeholder.com/150" roundedCircle />
        </Col>
      </Row>
    ),
    showExpandColumn: true,
    onlyOneExpanding: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <FaChevronUp />;
      }
      return <FaChevronDown />;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <FaChevronUp />;
      }
      return <FaChevronDown />;
    },
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
      if (isSelect && row.f_p === 0) {
        alert("Por favor añade el pago de viaticos");
        return false;
      }
      if (isSelect) {
        if (!containsObject(row, selectedProviders)) {
          setSelectedProviders((oldArr: any) => [...oldArr, row]);
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
      return (providersIds[prov.id] = { fare: prov.fare, f_p: 0 });
    });
    let res = await updateRequestProviders({
      request: requestId,
      providers: providersIds,
    });
    if (res.status === 201) {
      setDisabled(true);
      updateRequests();
    }
  };

  // =============================== CLICK ON ADD INSTRUCTOR ====================================
  const handleClickAddProvider = () => {
    let newUrl = url.split("/")[1];
    history.push({
      pathname: `/${newUrl}/proveedores`,
      state: { detail: "some_value" },
    });
  };

  return (
    <Modal
      size="lg"
      show={true}
      onHide={handleClose}
      className="modal-admin-providers"
    >
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Proveedores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToolkitProvider
          keyField="official_id"
          data={providers}
          columns={columns}
          search
        >
          {(props) => (
            <React.Fragment>
              {/* {requestProviders.length > 0 && (
                <Col>
                  <ul className="list-unstyled">
                    <small>Provideres: </small>
                    {requestProviders.map((ins, idx) => (
                      <li key={idx}>
                        {ins.providers.first_name} {ins.providers.last_name}
                        = <strong>$ {ins.fare}</strong>
                      </li>
                    ))}
                  </ul>
                </Col>
              )} */}

              <div className="top d-flex flex-wrap">
                <div className="action-filters flex-grow-1">
                  <SearchBar
                    {...props.searchProps}
                    className="custome-search-field"
                    placeholder="Buscar Proveedor"
                  />
                </div>
                <div className="action-btns d-flex align-items-center">
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleClickAddProvider}
                    >
                      Administrar Proveedores
                    </Button>
                    <Button
                      size="sm"
                      variant={disabled ? "outline-secondary" : "info"}
                      disabled={disabled ? true : false}
                      onClick={handleUpdateProvider}
                    >
                      Guardar Proveedor
                    </Button>
                  </ButtonGroup>
                </div>
              </div>

              <BootstrapTable
                {...props.baseProps}
                expandRow={expandRow}
                selectRow={selectRow}
                rowClasses="row-new-style"
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
      </Modal.Body>
    </Modal>
  );
};
export default ModalProviders;
