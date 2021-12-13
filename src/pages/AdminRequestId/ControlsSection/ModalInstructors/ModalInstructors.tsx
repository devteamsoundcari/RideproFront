import React, { useEffect, useState, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Row, Col, ButtonGroup, Button, Modal, Image, Spinner } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import swal from 'sweetalert';
import { useProfile } from '../../../../utils';
import { SingleRequestContext, InstructorsContext } from '../../../../contexts';
import { ModalAddInstructor } from '../../../../components/molecules';
import './ModalInstructors.scss';

interface ModalInstructorsProps {
  requestId: number;
  handleClose: () => void;
}

type SelectedInstructors = any;

const ModalInstructors: React.FC<ModalInstructorsProps> = ({ requestId, handleClose }) => {
  const {
    getSingleRequest,
    currentRequest,
    requestInstructors,
    setRequestInstructors,
    addRequestInstructors,
    updateRequestInstructors
  } = useContext(SingleRequestContext);
  const { getInstructorsByCity, instructors, setInstructors, loadingInstructors } =
    useContext(InstructorsContext);
  const [selectedInstructors, setSelectedInstructors] = useState<SelectedInstructors>([]);
  const [profile] = useProfile();
  const [disabled, setDisabled] = useState(true);
  const { SearchBar } = Search;
  const [showAddInstructorsModal, setShowAddInstructorsModal] = useState(false);
  const [instructorsToShow, setInstructorsToShow] = useState([]);

  useEffect(() => {
    if (selectedInstructors.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedInstructors]);

  useEffect(() => {
    const instructorsUpdated = instructors.map((ins) => {
      const foundInstructor = requestInstructors.find((reqIns) => reqIns.instructors.id === ins.id);
      ins.fare = foundInstructor ? foundInstructor.fare : 0;
      return ins;
    });
    setInstructorsToShow(instructorsUpdated);
  }, [requestInstructors, instructors]);

  // ================================ FETCH INSTRUCTORS ON LOAD =====================================================
  useEffect(() => {
    if (currentRequest?.municipality) getInstructorsByCity(currentRequest?.municipality.name);
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
      dataField: 'first_name',
      text: 'Nombre',
      editable: false,
      headerClasses: 'new-style'
    },
    {
      dataField: 'last_name',
      text: 'Apellido',
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
      text: 'Departamento',
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
        swal('Ooops!', 'Por favor añade una tarifa para el instructor', 'warning');
        return false;
      }
      if (isSelect) {
        if (!containsObject(row, selectedInstructors)) {
          setSelectedInstructors((oldArr: any) => [...oldArr, row]);
        }
      } else {
        const res = selectedInstructors.filter((item) => item.id !== row.id);
        setSelectedInstructors(res);
      }
    }
  };

  const handleUpdateInstructor = async () => {
    // Fares to update
    const instructorsToUpdate = requestInstructors.filter(({ instructors }) =>
      selectedInstructors.some((selInst) => instructors.id === selInst.id)
    );

    // New instructors to add to the request
    let newInstructorsToAdd: any = selectedInstructors.filter(
      (selInst) => !requestInstructors.some(({ instructors }) => instructors.id === selInst.id)
    );

    // ==== MAKE AN OBJECT WITH THE NEW INSTRUCTORS ====
    let tempObjNewInstructorsToAdd = {};
    newInstructorsToAdd.forEach((inst) => {
      return (tempObjNewInstructorsToAdd[inst.id] = { fare: inst.fare, f_p: 0 });
    });
    newInstructorsToAdd = { ...tempObjNewInstructorsToAdd };

    // console.log(duplicatedInstructors, newInstructorsToAdd);

    // const resToUpdate = await updateRequestInstructors();
    let resToAdd;
    let resToUpdate;
    // if (newInstructorsToAdd.length)
    //   resToAdd = await addRequestInstructors({
    //     request: requestId,
    //     instructors: newInstructorsToAdd
    //   });

    // if (duplicatedInstructors.length)
    //   resToUpdate = await updateRequestInstructors(duplicatedInstructors);

    if (Object.keys(newInstructorsToAdd).length && instructorsToUpdate.length) {
      console.log('add and update');
    } else if (Object.keys(newInstructorsToAdd).length && !instructorsToUpdate.length) {
      resToAdd = await addRequestInstructors({
        request: requestId,
        instructors: newInstructorsToAdd
      });
      if (resToAdd.status === 201) {
        setDisabled(true);
        getSingleRequest(requestId);
        swal('Perfecto!', 'Instructores actualizados exitosamente!', 'success');
        setInstructors([]);
        setRequestInstructors([]);
        handleClose();
      } else {
        swal('Error!', 'Algo salio mal!', 'error');
      }
    } else if (!Object.keys(newInstructorsToAdd).length && instructorsToUpdate.length) {
      console.log('only update');
      resToUpdate = await updateRequestInstructors(instructorsToUpdate);
      if (resToUpdate.status === 201) {
        setDisabled(true);
        getSingleRequest(requestId);
        swal('Perfecto!', 'Instructores actualizados exitosamente!', 'success');
        setInstructors([]);
        setRequestInstructors([]);
        handleClose();
      } else {
        swal('Error!', 'Algo salio mal!', 'error');
      }
    }

    // if (resToAdd.status === 201) {
    //   setDisabled(true);
    //   getSingleRequest(requestId);
    // swal('Perfecto!', 'Instructores actualizados exitosamente!', 'success');
    //   setInstructors([]);
    //   setRequestInstructors([]);
    //   handleClose();
    // } else {
    //   swal('Error!', 'Algo salio mal!', 'error');
    // }
  };

  // =============================== CLICK ON ADD INSTRUCTOR ====================================
  const handleClickAddInstructor = () => {
    setShowAddInstructorsModal(true);
  };

  const defaultSorted = [
    {
      dataField: 'fare',
      order: 'desc'
    }
  ];

  return (
    <React.Fragment>
      <Modal
        size="lg"
        show={true}
        onHide={() => {
          setInstructors([]);
          handleClose();
        }}
        className="modal-admin-instructors">
        <Modal.Header className={`bg-${profile}`} closeButton>
          <Modal.Title className="text-white">Instructores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToolkitProvider keyField="official_id" data={instructorsToShow} columns={columns} search>
            {(props) => (
              <React.Fragment>
                <div className="top d-flex flex-wrap">
                  <div className="action-filters flex-grow-1">
                    <SearchBar
                      {...props.searchProps}
                      className="custome-search-field"
                      placeholder={`Buscar instructores en ${currentRequest?.municipality?.name} - ${currentRequest?.municipality?.department?.name}...`}
                    />
                  </div>
                  <div className="action-btns d-flex align-items-center">
                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setInstructors([]);
                          getInstructorsByCity(currentRequest?.municipality.name);
                        }}>
                        <MdRefresh />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleClickAddInstructor}>
                        Agregar instructor
                      </Button>
                      <Button
                        size="sm"
                        variant={disabled ? 'outline-secondary' : 'info'}
                        disabled={disabled ? true : false}
                        onClick={handleUpdateInstructor}>
                        Guardar
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>

                <BootstrapTable
                  {...props.baseProps}
                  expandRow={expandRow}
                  selectRow={selectRow}
                  defaultSorted={defaultSorted}
                  pagination={paginationFactory()}
                  rowClasses="row-new-style"
                  noDataIndication={() =>
                    loadingInstructors ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      <p className="text-muted font-italic">
                        No hay instructores registrados en {currentRequest?.municipality?.name}.
                        <br />
                        Haz click en "Agregar instructor"
                      </p>
                    )
                  }
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      if (containsObject(row, selectedInstructors)) {
                        setSelectedInstructors(
                          selectedInstructors.filter((item) => item.id !== row.id)
                        );
                        setSelectedInstructors((oldArr) => [...oldArr, row]);
                      }
                    }
                  })}
                />
              </React.Fragment>
            )}
          </ToolkitProvider>
        </Modal.Body>
      </Modal>
      {showAddInstructorsModal && (
        <ModalAddInstructor handleClose={() => setShowAddInstructorsModal(false)} />
      )}
    </React.Fragment>
  );
};
export default ModalInstructors;
