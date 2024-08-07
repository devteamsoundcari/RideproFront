import React, { useEffect, useState, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Row, Col, ButtonGroup, Button, Modal, Image } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import swal from 'sweetalert';

import {
  getInstructors,
  updateRequestInstructors
} from '../../../../controllers/apiRequests';
import { AuthContext } from '../../../../contexts/AuthContext';
import './ModalInstructors.scss';
import RegisterNewInstructor from '../../../Instructors/Registration/RegisterNewInstructor';

interface ModalInstructorsProps {
  requestId: number;
  handleClose: () => void;
  propsInstructors: any[];
  onUpdate: () => void;
}

type SelectedInstructors = any;

const ModalInstructors: React.FC<ModalInstructorsProps> = ({
  requestId,
  handleClose,
  propsInstructors,
  onUpdate
}) => {
  const [instructors, setInstructors] = useState<any>([]);
  const [
    selectedInstructors,
    setSelectedInstructors
  ] = useState<SelectedInstructors>([]);
  const [requestInstructors, setRequestInstructors] = useState<any[]>([]);
  const [disabled, setDisabled] = useState(true);
  const { userInfoContext } = useContext(AuthContext);
  const { SearchBar } = Search;
  const [showAddInstructorsModal, setShowAddInstructorsModal] = useState(false);
  const [instructorsToShow, setInstructorsToShow] = useState([]);

  useEffect(() => {
    if (selectedInstructors.length > 0) {
      setDisabled(false);
    }
  }, [selectedInstructors]);

  useEffect(() => {
    let newArr: any = instructors;
    for (let index = 0; index < newArr.length; index++) {
      let item: any = newArr[index];
      requestInstructors.forEach((ele: any) => {
        if (item.id === ele.instructors.id) {
          item.fare = ele.fare;
        }
      });
    }
    setInstructorsToShow(newArr);
  }, [instructors, requestInstructors]);

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
      tempArr.push(item);
    });
    setInstructors((x) => [...x, ...tempArr]);
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
      editCellClasses: 'editing-cell'
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
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect && row.fare === 0) {
        alert('Por favor añade una tarifa');
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
    }
  };

  const handleUpdateInstructor = async () => {
    let instructorsIds = {};
    selectedInstructors.forEach((inst) => {
      return (instructorsIds[inst.id] = { fare: inst.fare, f_p: 0 });
    });
    let res = await updateRequestInstructors({
      request: requestId,
      instructors: instructorsIds
    });
    if (res.status === 201) {
      setDisabled(true);
      onUpdate();
      swal('Perfecto!', `Instructores actualizados exitosamente!`, 'success');
      handleClose();
    }
  };

  // =============================== CLICK ON ADD INSTRUCTOR ====================================
  const handleClickAddInstructor = () => {
    setShowAddInstructorsModal(true);
  };

  return (
    <React.Fragment>
      <Modal
        size="lg"
        show={true}
        onHide={handleClose}
        className="modal-admin-instructors">
        <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
          <Modal.Title className="text-white">Instructores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToolkitProvider
            keyField="official_id"
            data={instructorsToShow}
            columns={columns}
            search>
            {(props) => (
              <React.Fragment>
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
                        onClick={() =>
                          fetchInstructors(
                            `${process.env.REACT_APP_API_URL}/api/v1/instructors/`
                          )
                        }>
                        <MdRefresh />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleClickAddInstructor}>
                        Agregar Instructor
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
                  pagination={paginationFactory()}
                  rowClasses="row-new-style"
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      if (containsObject(row, selectedInstructors)) {
                        setSelectedInstructors(
                          selectedInstructors.filter(
                            (item) => item.id !== row.id
                          )
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
        <Modal
          size="lg"
          show={true}
          onHide={() => setShowAddInstructorsModal(false)}
          className="modal-add-instructors">
          <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
            <Modal.Title className="text-white">
              Registrar instructor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RegisterNewInstructor />
          </Modal.Body>
        </Modal>
      )}
    </React.Fragment>
  );
};
export default ModalInstructors;
