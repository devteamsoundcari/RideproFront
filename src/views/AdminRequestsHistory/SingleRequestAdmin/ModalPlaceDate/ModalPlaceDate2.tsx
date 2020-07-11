import React, { useEffect, useState, useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import { Row, Col, ButtonGroup, Button, Modal, Image } from "react-bootstrap";
import { RequestsContext } from "../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import { getTracks, updateRequest } from "../../../../controllers/apiRequests";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SetHour from "./SetHour";
import SetDate from "./SetDate";
import "./ModalPlaceDate.scss";

interface ModalPlaceDateProps {
  requestId: number;
  handleClose: () => void;
  propsTrack: any;
  propsDate: any;
  propsCity: any;
}

interface Track {
  id: number;
  name: string;
  address: string;
  description: string;
  municipality: any;
  company: any;
}
type Tracks = Track[];

const ModalPlaceDate: React.FC<ModalPlaceDateProps> = ({
  requestId,
  handleClose,
  propsTrack,
  propsDate,
  propsCity,
}) => {
  const { userInfoContext } = useContext(AuthContext);
  const { updateRequestsContext } = useContext(RequestsContext);
  const { SearchBar } = Search;
  const history = useHistory();
  let { url } = useRouteMatch();
  const [tracks, setTracks] = useState<any>([]);
  const [disabled, setDisabled] = useState(true);
  const [filteredTracks, setFilteredTracks] = useState<Tracks>([]);
  const [selectedOption, setSelectedOption] = useState<any>({});

  const columns = [
    {
      dataField: "name",
      text: "Nombre",
      editable: false,
      headerClasses: "new-style",
    },
    {
      dataField: "address",
      text: "Dirección",
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
      dataField: "date",
      text: "Fecha",
      headerClasses: "new-style",
      editCellClasses: "editing-cell short-input",
      formatter: (cell) => dateFormatter(cell),
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => <SetDate {...editorProps} value={value} />,
    },
    {
      dataField: "hour",
      text: "Hora",
      headerClasses: "new-style",
      editCellClasses: "editing-cell short-input",
      headerStyle: {
        width: "95px",
      },
      formatter: (cell) => formatAMPM(cell),
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => <SetHour {...editorProps} value={value} />,
    },
    {
      dataField: "option",
      text: "Opción #",
      headerClasses: "new-style ",
      editCellClasses: "editing-cell short-input",
      editor: {
        type: Type.SELECT,
        options: [
          {
            value: "1",
            label: "1",
          },
          {
            value: "2",
            label: "2",
          },
        ],
      },
    },
  ];

  // ======================================== UPDATING REQUEST OPTIONS ==========================================
  const handleUpdatePlaceDate = async () => {
    // This part was fucking with me -- att Mike
    let x = new Date(new Date(selectedOption.date).getTime());
    let t = new Date(selectedOption.hour);
    x.setHours(t.getHours());
    x.setMinutes(t.getMinutes());
    x.setSeconds(0);
    x.setMilliseconds(0);
    const payload1 = {
      optional_place1: selectedOption.id,
      optional_date1: x,
    };
    const payload2 = {
      optional_place2: selectedOption.id,
      optional_date2: x,
    };

    let res = await updateRequest(
      selectedOption.option === 1 ? payload1 : payload2,
      requestId
    );
    if (res.status === 200) {
      setDisabled(true);
      updateRequestsContext();
    }
  };

  // ======================================== DATE FORMATTER ==========================================

  const dateFormatter = (date: string) => {
    let d = new Date(date);
    const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(d);
    return `${month}/${day}/${year}`;
  };

  const formatAMPM = (startDate) => {
    let date = new Date(startDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minutes2 = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes2 + " " + ampm;
    return strTime;
  };

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (url: string) => {
    let tempTracks: any = [];
    const response = await getTracks(url);
    response.results.forEach(async (item: any) => {
      tempTracks.push(item);
    });
    setTracks(tempTracks);
    if (response.next) {
      return await getTracks(response.next);
    }
  };
  useEffect(() => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
  }, []);
  // =============================== FILTER TRACKS && ADDING DATE ====================================

  useEffect(() => {
    tracks.forEach((item) => {
      if (userInfoContext.company.id === item.company.id) {
        item.date = propsDate;
        item.hour = propsDate;
        item.option = 1;
        setFilteredTracks((oldArr: any) => [...oldArr, item]);
      }
    });
    //eslint-disable-next-line
  }, [tracks, userInfoContext.company.id]);

  // =============================== CLICK ON ADD TRACK ====================================
  const handleClickAddTrack = () => {
    let newUrl = url.split("/")[1];
    history.push({
      pathname: `/${newUrl}/proveedores`,
      state: { detail: "some_value" },
    });
  };

  const expandRow = {
    className: "expanded-div",
    renderer: (row) => (
      <Row>
        <Col md={8}>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Contacto:</td>
                <td className="users-view-username">{row.contact_name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td className="users-view-username">{row.contact_email}</td>
              </tr>
              <tr>
                <td>Teléfono:</td>
                <td className="users-view-name">{row.cellphone}</td>
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

  const selectRow = {
    mode: "radio",
    clickToSelect: false,
    hideSelectAll: true,
    selectColumnPosition: "right",
    classes: "parent-expand-foo",
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setDisabled(false);
        setSelectedOption(row);
      }
    },
  };

  return (
    <Modal
      size="lg"
      show={true}
      onHide={handleClose}
      className="modal-admin-placedate"
    >
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Lugar / Fecha / Hora</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <ToolkitProvider
          keyField="id"
          data={filteredTracks}
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
              <Row>
                <Col md={12} className="text-center">
                  <p>
                    <strong>RECUERDA:</strong>
                    <br />
                    Una solicitud podra tener máximo 2 opciones de Lugar / Fecha
                    / Hora.
                  </p>
                </Col>
              </Row>
              <div className="top d-flex flex-wrap">
                <div className="action-filters flex-grow-1">
                  <SearchBar
                    {...props.searchProps}
                    className="custome-search-field"
                    placeholder="Buscar pista"
                  />
                </div>
                <div className="action-btns d-flex align-items-center">
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleClickAddTrack}
                    >
                      Administrar Pistas
                    </Button>
                    <Button
                      size="sm"
                      variant={disabled ? "outline-secondary" : "info"}
                      disabled={disabled ? true : false}
                      onClick={handleUpdatePlaceDate}
                    >
                      Guardar opción
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
                  blurToSave: true,
                })}
              />
            </React.Fragment>
          )}
        </ToolkitProvider>
      </Modal.Body>
    </Modal>
  );
};
export default ModalPlaceDate;
