import React, { useEffect, useState, useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Row, Col, ButtonGroup, Button, Modal, Image } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getInstructors,
  updateRequestInstructors,
} from "../../../../controllers/apiRequests";
import { RequestsContext } from "../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./ModalInstructors.scss";

interface ModalInstructorsProps {
  requestId: number;
  handleClose: () => void;
  propsInstructors: any[];
}

type SelectedInstructors = any;

const ModalInstructors: React.FC<ModalInstructorsProps> = ({
  requestId,
  handleClose,
  propsInstructors,
}) => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState<
    SelectedInstructors
  >([]);
  const [requestInstructors, setRequestInstructors] = useState<any[]>([]);
  const { updateRequestsContext } = useContext(RequestsContext);
  const [disabled, setDisabled] = useState(true);
  const { userInfoContext } = useContext(AuthContext);
  const { SearchBar } = Search;
  const history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    if (selectedInstructors.length > 0) {
      setDisabled(false);
    }
  }, [selectedInstructors]);

  useEffect(() => {
    if (propsInstructors.length > 0) {
      setRequestInstructors(propsInstructors);
    }
  }, [propsInstructors]);

  // ================================ FETCH INSTRUCTORS ON LOAD =====================================================
  const fetchInstructors = async (url) => {
    let tempArr: any = [];
    const response = await getInstructors(url);
    response.results.forEach(async (item: any) => {
      item.fare = 0;
      item.f_p = 0;
      tempArr.push(item);
    });
    setInstructors(tempArr);
    if (response.next) {
      return await fetchInstructors(response.next);
    }
  };
  useEffect(() => {
    fetchInstructors(`${process.env.REACT_APP_API_URL}/api/v1/instructors/`);
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
      dataField: "first_name",
      text: "Nombre",
      editable: false,
      headerClasses: "new-style",
    },
    {
      dataField: "last_name",
      text: "Apellido",
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
      text: "Departamento",
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
    {
      dataField: "f_p",
      text: "Viaticos $",
      headerClasses: "new-style",
      editCellClasses: "editing-cell",
      headerStyle: {
        width: "95px",
      },
    },
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
              <tr>
                <td>Foto:</td>
                <td>{row.picture}</td>
              </tr>
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
        if (!containsObject(row, selectedInstructors)) {
          setSelectedInstructors((oldArr: any) => [...oldArr, row]);
        }
      } else {
        if (containsObject(row, selectedInstructors)) {
          setSelectedInstructors(
            selectedInstructors.filter((item) => item.id !== row.id)
          );
        }
      }
    },
  };

  const handleUpdateInstructor = async () => {
    let instructorsIds = {};
    selectedInstructors.forEach((inst) => {
      return (instructorsIds[inst.id] = { fare: inst.fare, f_p: inst.f_p });
    });
    console.log("IDS", instructorsIds);
    let res = await updateRequestInstructors({
      request: requestId,
      instructors: instructorsIds,
    });
    if (res.status === 201) {
      setDisabled(true);
      updateRequestsContext();
    }
  };

  // =============================== CLICK ON ADD INSTRUCTOR ====================================
  const handleClickAddInstructor = () => {
    let newUrl = url.split("/")[1];
    history.push({
      pathname: `/${newUrl}/instructores`,
      state: { detail: "some_value" },
    });
  };

  return (
    <Modal
      size="lg"
      show={true}
      onHide={handleClose}
      className="modal-admin-instructors"
    >
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Instructores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToolkitProvider
          keyField="official_id"
          data={instructors}
          columns={columns}
          search
        >
          {(props) => (
            <React.Fragment>
              {/* {requestInstructors.length > 0 && (
                <Col>
                  <ul className="list-unstyled">
                    <small>Instructores: </small>
                    {requestInstructors.map((ins, idx) => (
                      <li key={idx}>
                        {ins.instructors.first_name} {ins.instructors.last_name}
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
                    placeholder="Buscar Instructor"
                  />
                </div>
                <div className="action-btns d-flex align-items-center">
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleClickAddInstructor}
                    >
                      Administrar Instructores
                    </Button>
                    <Button
                      size="sm"
                      variant={disabled ? "outline-secondary" : "info"}
                      disabled={disabled ? true : false}
                      onClick={handleUpdateInstructor}
                    >
                      Guardar Instructor
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
                    if (containsObject(row, selectedInstructors)) {
                      setSelectedInstructors(
                        selectedInstructors.filter((item) => item.id !== row.id)
                      );
                      setSelectedInstructors((oldArr) => [...oldArr, row]);
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
export default ModalInstructors;
