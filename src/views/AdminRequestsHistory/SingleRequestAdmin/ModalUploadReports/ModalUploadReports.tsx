import React, { useState, useEffect, useContext } from "react";
import { Row, Col, ButtonGroup, Button, Modal, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import { FaUpload, FaSave } from "react-icons/fa";
import { fetchDriver } from "../../../../controllers/apiRequests";
import { RequestsContext } from "../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./ModalUploadReports.scss";

type ModalUploadReports = any;

interface Participant {
  official_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: number;
}

type ParticipantsData = Participant[];

const ModalUploadReports: React.FC<ModalUploadReports> = ({
  handleClose,
  drivers,
}) => {
  const { userInfoContext } = useContext(AuthContext);
  const { SearchBar } = Search;
  const [participants, setParticipants] = useState<ParticipantsData>([]);

  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================

  const getDrivers = async (driversIds: any) => {
    return Promise.all(driversIds.map((id: string) => fetchDriver(id)));
  };

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      getDrivers(drivers).then((data) => {
        data.forEach((item: any) => {
          item.result = "---";
          item.url = "---";
          setParticipants((oldArr: any) => [...oldArr, item]);
        });
      });
    }
  }, [drivers]);

  const fileSelector = (editorProps, row, value) => {
    console.log("editorProps", editorProps);
    const { onUpdate } = editorProps;
    return (
      <Form.File
        id="custom-file-translate-scss"
        label={
          <span>
            <FaUpload /> Subir archivo
          </span>
        }
        lang="es"
        onChange={(e) => onUpdate(e.target.files[0].name)}
      />
    );
  };

  const saveRowFormatter = (cell, row) => {
    return (
      <Button variant="link" size="sm" onClick={() => console.log(row)}>
        <FaSave />
      </Button>
    );
  };

  const columns = [
    {
      dataField: "official_id",
      text: "Id",
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
      dataField: "result",
      text: "Resultado",
      headerClasses: "new-style",
      editor: {
        type: Type.SELECT,
        options: [
          {
            value: "Aprobado",
            label: "Aprobado",
          },
          {
            value: "No aprobado",
            label: "No aprobado",
          },
        ],
      },
    },
    {
      dataField: "url",
      text: "Link",
      headerClasses: "new-style",
      editCellClasses: "editing-cell",
    },
    {
      dataField: "report",
      text: "Informe",
      headerClasses: "new-style",
      headerStyle: {
        width: "125px",
      },
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => fileSelector(editorProps, row, value),
    },
    {
      dataField: "municipality",
      editable: false,
      headerClasses: "new-style",
      headerStyle: {
        width: "3.5rem",
      },
      formatter: saveRowFormatter,
    },
  ];

  return (
    <Modal
      size="lg"
      show={true}
      onHide={handleClose}
      className="modal-upload-reports"
    >
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Generar informes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToolkitProvider
          keyField="official_id"
          data={participants}
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
                    placeholder="Buscar participante"
                  />
                </div>
              </div>

              <BootstrapTable
                {...props.baseProps}
                // expandRow={expandRow}
                // selectRow={selectRow}
                rowClasses="row-new-style"
                cellEdit={cellEditFactory({
                  mode: "click",
                  blurToSave: true,
                  afterSaveCell: (oldValue, newValue, row, column) => {
                    console.log("After Saving Cell!!", newValue);
                  },
                })}
                // cellEdit={cellEditFactory({
                //   mode: "click",
                //   afterSaveCell: (oldValue, newValue, row, column) => {
                //     if (containsObject(row, selectedInstructors)) {
                //       setSelectedInstructors(
                //         selectedInstructors.filter((item) => item.id !== row.id)
                //       );
                //       setSelectedInstructors((oldArr) => [...oldArr, row]);
                //     }
                //   },
                // })}
              />
            </React.Fragment>
          )}
        </ToolkitProvider>
      </Modal.Body>
    </Modal>
  );
};
export default ModalUploadReports;
