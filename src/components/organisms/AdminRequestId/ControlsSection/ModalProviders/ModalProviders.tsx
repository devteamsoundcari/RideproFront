import React, { useEffect, useState, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Row, Col, ButtonGroup, Button, Modal, Image, Spinner } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { SingleRequestContext, ProvidersContext } from '../../../../../contexts';
import { useProfile } from '../../../../../utils';
import { ModalAddProvider } from '../../../../../components/molecules';
import swal from 'sweetalert';
import './ModalProviders.scss';

interface ModalProvidersProps {
  requestId: number;
  handleClose: () => void;
}

type SelectedProviders = any;

const ModalProviders: React.FC<ModalProvidersProps> = ({ requestId, handleClose }) => {
  const [profile] = useProfile();
  const { currentRequest, getSingleRequest, requestProviders, updateRequestProviders } =
    useContext(SingleRequestContext);
  const { getProvidersByCity, providers, loadingProviders, setProviders } =
    useContext(ProvidersContext);
  const [selectedProviders, setSelectedProviders] = useState<SelectedProviders>([]);
  const [disabled, setDisabled] = useState(true);
  const { SearchBar } = Search;
  const [showAddProvidersModal, setShowAddProvidersModal] = useState(false);
  const [providersToShow, setProvidersToShow] = useState([]);

  useEffect(() => {
    if (selectedProviders.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedProviders]);

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    const providersUpdated = providers.filter((ins) => {
      const foundInstructor = requestProviders.find((reqIns) => reqIns.providers.id === ins.id);
      if (!foundInstructor) {
        ins.fare = 0;
        return ins;
      }
    });
    setProvidersToShow(providersUpdated);
  }, [providers, requestProviders]);

  // ================================ FETCH PROVIDERS ON LOAD =====================================================
  useEffect(() => {
    if (currentRequest?.municipality) getProvidersByCity(currentRequest?.municipality.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRequest]);

  const columns = [
    {
      dataField: 'official_id',
      text: 'Identificación',
      editable: false,
      headerClasses: 'new-style',
      headerStyle: {
        width: '125px'
      }
    },
    {
      dataField: 'name',
      text: 'Nombre',
      editable: false,
      headerClasses: 'new-style'
    },
    {
      dataField: 'services',
      text: 'Servicios',
      editable: false,
      headerClasses: 'new-style'
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      editable: false,
      headerClasses: 'new-style'
    },
    {
      dataField: 'municipality.department.name',
      text: 'Dpto.',
      editable: false,
      headerClasses: 'new-style',
      headerStyle: {
        width: '125px'
      }
    },
    {
      dataField: 'fare',
      text: 'Tarifa $',
      headerClasses: 'new-style',
      editCellClasses: 'editing-cell',
      classes: 'tarifa-cell',
      formatter: (cell) => Number(cell).toLocaleString('es'),
      sort: true
    }
  ];

  const expandRow = {
    parentClassName: 'parent-expand-foo',
    className: 'expanded-div',
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
    }
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
    mode: 'checkbox',
    clickToSelect: false,
    hideSelectAll: true,
    selectColumnPosition: 'right',
    onSelect: (row, isSelect) => {
      if (isSelect && row.fare === 0) {
        swal('Ooops!', 'Por favor añade una tarifa para el proveedor', 'warning');
        return false;
      }
      if (isSelect && row.f_p === 0) {
        swal('Ooops!', 'Por favor añade el pago de viaticos', 'warning');
        return false;
      }
      if (isSelect) {
        if (!containsObject(row, selectedProviders)) {
          setSelectedProviders((oldArr: any) => [...oldArr, row]);
        }
      } else {
        const res = selectedProviders.filter((item) => item.id !== row.id);
        setSelectedProviders(res);
      }
    }
  };

  const handleUpdateProvider = async () => {
    let providersIds = {};
    selectedProviders.forEach((prov) => {
      return (providersIds[prov.id] = { fare: prov.fare, f_p: 0 });
    });
    let res = await updateRequestProviders({
      request: requestId,
      providers: providersIds
    });
    if (res.status === 201) {
      setDisabled(true);
      getSingleRequest(requestId);
      swal('Perfecto!', `Proveedores actualizados exitosamente!`, 'success');
      handleClose();
    } else {
      swal('Error!', 'Algo salio mal!', 'error');
    }
  };

  // =============================== CLICK ON ADD INSTRUCTOR ====================================
  const handleClickAddProvider = () => {
    setShowAddProvidersModal(true);
  };

  return (
    <React.Fragment>
      <Modal size="lg" show={true} onHide={handleClose} className="modal-admin-providers">
        <Modal.Header className={`bg-${profile}`} closeButton>
          <Modal.Title className="text-white">Proveedores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToolkitProvider keyField="official_id" data={providersToShow} columns={columns} search>
            {(props) => (
              <React.Fragment>
                <div className="top d-flex flex-wrap">
                  <div className="action-filters flex-grow-1">
                    <SearchBar
                      {...props.searchProps}
                      className="custome-search-field"
                      placeholder={`Buscar proveedores en ${currentRequest?.municipality?.name}...`}
                    />
                  </div>
                  <div className="action-btns d-flex align-items-center">
                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setProviders([]);
                          getProvidersByCity(currentRequest?.municipality.name);
                        }}>
                        <MdRefresh />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleClickAddProvider}>
                        Agregar Proveedor
                      </Button>
                      <Button
                        size="sm"
                        variant={disabled ? 'outline-secondary' : 'info'}
                        disabled={disabled ? true : false}
                        onClick={handleUpdateProvider}>
                        Guardar
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>

                <BootstrapTable
                  {...props.baseProps}
                  expandRow={expandRow}
                  selectRow={selectRow}
                  pagination={paginationFactory()}
                  rowClasses="row-new-style"
                  noDataIndication={() =>
                    loadingProviders ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      <p className="text-muted font-italic">
                        No hay proveedores registrados en {currentRequest?.municipality?.name}.
                        <br />
                        Haz click en "Agregar instructor"
                      </p>
                    )
                  }
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      if (containsObject(row, selectedProviders)) {
                        setSelectedProviders(
                          selectedProviders.filter((item) => item.id !== row.id)
                        );
                        setSelectedProviders((oldArr) => [...oldArr, row]);
                      }
                    }
                  })}
                />
              </React.Fragment>
            )}
          </ToolkitProvider>
        </Modal.Body>
      </Modal>
      {showAddProvidersModal && (
        <ModalAddProvider handleClose={() => setShowAddProvidersModal(false)} />
      )}
    </React.Fragment>
  );
};
export default ModalProviders;
