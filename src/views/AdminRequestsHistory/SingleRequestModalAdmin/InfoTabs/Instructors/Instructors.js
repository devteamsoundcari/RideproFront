import React, { useEffect, useState, useContext } from "react";
import {
  getInstructors,
  updateRequest,
} from "../../../../../controllers/apiRequests";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Button, ButtonGroup } from "react-bootstrap";
import { RequestsContext } from "../../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../../contexts/AuthContext";

const Instructors = (props) => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const { SearchBar } = Search;
  const { userInfoContext } = useContext(AuthContext);
  const { updateRequestsContext } = useContext(RequestsContext);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (selectedInstructors.length > 0) {
      setDisabled(false);
    }
  }, [selectedInstructors]);

  // ================================ FETCH INSTRUCTORS ON LOAD =====================================================
  const fetchInstructors = async (url) => {
    let tempArr = [];
    const response = await getInstructors(url);
    response.results.forEach(async (item) => {
      item.fare = 0;
      tempArr.push(item);
    });
    setInstructors(tempArr);
    if (response.next) {
      return await getInstructors(response.next);
    }
  };
  useEffect(() => {
    fetchInstructors(`${process.env.REACT_APP_API_URL}/api/v1/instructors/`);
  }, []);

  const columns = [
    {
      dataField: "official_id",
      text: "Identificación",
      editable: false,
    },
    {
      dataField: "first_name",
      text: "Nombre",
      editable: false,
    },
    {
      dataField: "last_name",
      text: "Apellido",
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
          <li>
            <small>Foto: </small>
            {row.picture}
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
        if (!containsObject(row, selectedInstructors)) {
          setSelectedInstructors((oldArr) => [...oldArr, row]);
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
    let instructorsIds = [];
    selectedInstructors.forEach((inst) => instructorsIds.push(inst.id));
    let res = await updateRequest(
      {
        new_request: 0,
        operator: userInfoContext.id,
        instructors: instructorsIds,
      },
      props.requestId
    );
    if (res.status === 200) {
      setDisabled(true);
      updateRequestsContext();
    }
  };

  return (
    <div>
      <ToolkitProvider
        keyField="official_id"
        data={instructors}
        columns={columns}
        search
      >
        {(props) => (
          <div>
            <h5>Buscar instructor:</h5>
            <SearchBar {...props.searchProps} />
            <div class="btn-toolbar mb-2 mb-md-0">
              <ButtonGroup aria-label="Basic example">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  // onClick={handleClickAddinstructor}
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
            <hr />
            <BootstrapTable
              {...props.baseProps}
              expandRow={expandRow}
              selectRow={selectRow}
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
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default Instructors;
