import React, { useState, useEffect } from "react";
import BootstrapTable, { SelectRowProps } from "react-bootstrap-table-next";
import { Modal, Button } from "react-bootstrap";
import {
  //   updateRequestDocuments,
  //   getRequestDocuments,
  getInstructors,
} from "../../../../../controllers/apiRequests";
import "./ModalDocuments.scss";

type ModalDocumentsProps = any;

const ModalDocuments: React.FC<ModalDocumentsProps> = ({
  handleClose,
  handleSave,
  requestId,
  x,
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<any>(x);
  const [dbDocuments, setDbDocuments] = useState<any>([]);

  // ================================ FETCH DB DOCUMENTS ON LOAD =====================================================
  const fetchDocuments = async (url) => {
    const response = await getInstructors(url);
    response.results.forEach((item) => {
      setDbDocuments((oldArr) => [...oldArr, item]);
    });
    if (response.next) {
      return await fetchDocuments(response.next);
    }
  };
  useEffect(() => {
    fetchDocuments(`${process.env.REACT_APP_API_URL}/api/v1/documents/`);
    //eslint-disable-next-line
  }, []);

  const columns = [
    {
      dataField: "name",
      text: "Nombre",
      headerClasses: "new-style",
    },
    {
      dataField: "description",
      text: "Descripción",
      headerClasses: "new-style",
    },
    {
      dataField: "template",
      text: "Plantilla",
      headerClasses: "new-style",
      formatter: (data) => {
        if (data) {
          return (
            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open(data, "_blank", "resizable=yes")}
            >
              Ver plantilla
            </Button>
          );
        } else {
          return "NA";
        }
      },
    },
  ];

  const fuck = () => selectedDocuments.map((item) => item.id);

  const selectRow: SelectRowProps<any> = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "lightgreen",
    selected: fuck(),
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSelectedDocuments((oldArr) => [...oldArr, row]);
      } else {
        setSelectedDocuments(
          selectedDocuments.filter((item) => item.id !== row.id)
        );
      }
    },
  };

  const handleClick = async () => {
    // let docsIds: any = [];
    // selectedDocuments.forEach((doc: any) => {
    //   docsIds.push(doc.id);
    // });
    // let payload = {
    //   request: requestId,
    //   documents: docsIds,
    // };
    // let res = await updateRequestDocuments(payload);
    // if (res.status === 201) {
    //   handleSave(selectedDocuments);
    // }
    handleSave(selectedDocuments);
  };

  return (
    <div>
      <Modal
        size="lg"
        show={true}
        onHide={() => handleClose()}
        className="modal-documents"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar documentos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapTable
            keyField="id"
            data={dbDocuments}
            columns={columns}
            selectRow={selectRow}
            rowClasses="row-new-style"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="primary" onClick={() => handleClick()}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ModalDocuments;
