import React, { useState, useEffect, useContext } from 'react';
import BootstrapTable, { SelectRowProps } from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Modal, Button, Spinner, Col, Row } from 'react-bootstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import './ModalDocuments.scss';
import { SingleRequestContext } from '../../../../../contexts';
import { useProfile } from '../../../../../utils';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import swal from 'sweetalert';

type ModalDocumentsProps = any;
const { SearchBar } = Search;

const ModalDocuments: React.FC<ModalDocumentsProps> = ({ handleClose, requestId }) => {
  const {
    getAllDocuments,
    allDocuments,
    loadingDocuments,
    attachRequestDocuments,
    currentRequest
  } = useContext(SingleRequestContext);
  const [profile] = useProfile();
  const [selectedDocuments, setSelectedDocuments] = useState<any>([]);
  const [newSelectedDocuments, setNewSelectedDocuments] = useState<any>([]);

  useEffect(() => {
    getAllDocuments();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentRequest.documents.length) {
      setSelectedDocuments(
        currentRequest.documents.map((selDoc) => {
          return { id: selDoc };
        })
      );
    }
  }, [currentRequest]);

  const columns = [
    {
      dataField: 'name',
      text: 'Nombre',
      headerClasses: 'new-style'
    },
    {
      dataField: 'template',
      text: 'Plantilla',
      headerClasses: 'new-style small-column',
      formatter: (data) => {
        if (data) {
          return (
            <Button
              className="text-center m-auto"
              size="sm"
              variant="primary"
              onClick={() => window.open(data, '_blank', 'resizable=yes')}>
              Ver plantilla
            </Button>
          );
        } else {
          return 'NA';
        }
      }
    }
  ];

  const selectDoc = () => selectedDocuments?.map((item) => item.id);

  const selectRow: SelectRowProps<any> = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectAll: true,
    nonSelectable: selectDoc(),
    nonSelectableStyle: { backgroundColor: 'palegreen' },
    bgColor: 'springgreen' as any,
    // selected: newSelectedDocuments,
    onSelect: (row, isSelect) => {
      if (isSelect) {
        setNewSelectedDocuments((oldArr) => [...oldArr, row]);
      } else {
        setNewSelectedDocuments(selectedDocuments.filter((item) => item.id !== row.id));
      }
    }
  };

  const handleSaveDocs = async () => {
    swal({
      title: 'Importante',
      text: 'Una vez guardes los documentos, no podran ser borrados!',
      icon: 'warning',
      buttons: ['Cancelar', 'Guardar'],
      dangerMode: true
    }).then(async (willSave) => {
      if (willSave) {
        try {
          const res = await attachRequestDocuments({
            request: requestId,
            documents: newSelectedDocuments.map((doc) => doc.id)
          });
          if (res.status === 201) {
            swal('Perfecto!', 'Documentos adjuntados correctamente!', 'success');
            handleClose();
          }
        } catch (error) {
          swal('Ooops!', 'No pudimos adjuntar los documentos!', 'error');
        }
      }
    });
  };

  const expandRow = {
    parentClassName: 'parent-expand-foo',
    className: 'expanded-div',
    renderer: (row) => (
      <Row>
        <Col md={12}>
          <h6>Descripción:</h6>
          <small>{row.description}</small>
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
    }
  };

  return (
    <div>
      <Modal size="lg" show={true} onHide={() => handleClose()} className="modal-documents">
        <Modal.Header className={`bg-${profile}`} closeButton>
          <Modal.Title className="text-white">Confirmar documentos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToolkitProvider
            keyField="id"
            data={allDocuments}
            columns={columns}
            selectRow={selectRow}
            rowClasses="row-new-style"
            search>
            {(props) => (
              <>
                <div className="w-100 d-flex justify-content-between mb-2">
                  <SearchBar
                    {...props.searchProps}
                    className="custome-search-field"
                    placeholder={'Buscar documentos'}
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={!newSelectedDocuments.length || loadingDocuments}
                    onClick={() => handleSaveDocs()}>
                    {loadingDocuments ? (
                      <>
                        'Cargando...'
                        <Spinner animation="border" role="status" size="sm" />
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </Button>
                </div>
                <BootstrapTable
                  {...props.baseProps}
                  expandRow={expandRow}
                  selectRow={selectRow}
                  rowClasses="row-new-style align-middle"
                  pagination={paginationFactory()}
                  noDataIndication={() =>
                    loadingDocuments ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      <p className="text-muted font-italic">No hay resultados</p>
                    )
                  }
                />
              </>
            )}
          </ToolkitProvider>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default ModalDocuments;
