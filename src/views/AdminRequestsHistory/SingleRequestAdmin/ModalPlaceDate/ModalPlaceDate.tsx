import React, { useState, useEffect, useContext } from "react";
// import { useHistory, useRouteMatch } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import swal from "sweetalert";
import { RequestsContext } from "../../../../contexts/RequestsContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import { getTracks, updateRequest } from "../../../../controllers/apiRequests";
import {
  Modal,
  Button,
  Col,
  Row,
  ButtonGroup,
  Form,
  Card,
} from "react-bootstrap";
import useDropdown from "../../../../utils/useDropdown";
import es from "date-fns/locale/es";
import "./ModalPlaceDate.scss";
import ModalNewTrack from "../../../Tracks/ModalNewTrack/ModalNewTrack";

registerLocale("es", es);

interface ModalPlaceDateProps {
  requestId: number;
  handleClose: () => void;
  propsTrack: any;
  propsDate: any;
  propsCity: any;
  operator: any;
  propsOptDate1: any;
  propsOptPlace1: any;
  propsOptDate2: any;
  propsOptPlace2: any;
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
  handleClose,
  propsCity,
  propsDate,
  propsTrack,
  operator,
  propsOptDate1,
  propsOptPlace1,
  propsOptDate2,
  propsOptPlace2,
  requestId,
}) => {
  const [tracks, setTracks] = useState<any>([]);
  const [disabled, setDisabled] = useState(true);
  // const history = useHistory();
  // let { url } = useRouteMatch();
  const [filteredTracks, setFilteredTracks] = useState<Tracks>([]);
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(new Date());
  const [opt1, setOpt1] = useState({
    date: propsOptDate1 ? new Date(propsOptDate1) : "",
    place: "",
  });
  const [opt2, setOpt2] = useState({
    date: propsOptDate2 ? new Date(propsOptDate2) : "",
    place: "",
  });
  const [showAlternative, setShowAlternative] = useState(false);
  const { userInfoContext } = useContext(AuthContext);
  const { updateRequests } = useContext(RequestsContext);
  const [showModalTracks, setShowModalTracks] = useState(false);
  const [selectedPlace, PlacesDropdown] = useDropdown(
    "",
    "Seleccione...",
    filteredTracks
  );
  const [selectedPlace2, PlacesDropdown2] = useDropdown(
    "",
    "Seleccione...",
    filteredTracks
  );

  useEffect(() => {
    if (showAlternative) {
      if (
        propsTrack ||
        (opt1.place &&
          opt1.place !== "Seleccione..." &&
          opt2.place &&
          opt2.place !== "Seleccione...")
      ) {
        if (opt1.date && opt2.date) {
          setDisabled(false);
        }
      } else {
        setDisabled(true);
      }
    } else {
      if (propsTrack && opt1.date !== "") {
        setDisabled(false);
      } else if (opt1.place && opt1.place !== "Seleccione...") {
        if (opt1.date) {
          setDisabled(false);
        }
      } else {
        setDisabled(true);
      }
    }
  }, [
    propsTrack,
    propsOptDate1,
    propsOptDate2,
    propsOptPlace1,
    propsOptPlace2,
    showAlternative,
    opt1,
    opt2,
  ]);

  useEffect(() => {
    if (selectedPlace) {
      setOpt1({
        ...opt1,
        place: selectedPlace,
      });
    }
    if (selectedPlace2) {
      setOpt2({
        ...opt2,
        place: selectedPlace2,
      });
    }
    // eslint-disable-next-line
  }, [selectedPlace, selectedPlace2]);

  useEffect(() => {
    if (propsDate !== undefined) {
      setDate(new Date(propsDate));
      setHour(new Date(propsDate));
    }
  }, [propsDate]);

  useEffect(() => {
    if (propsOptDate1 !== undefined) {
      setOpt1({
        ...opt1,
        date: propsOptDate1,
      });
    }
    if (propsOptPlace1 !== undefined) {
      setOpt1({
        ...opt1,
        place: propsOptPlace1,
      });
    }
    // eslint-disable-next-line
  }, [propsOptDate1, propsOptPlace1]);

  useEffect(() => {
    if (propsOptDate2 !== undefined) {
      setOpt2({
        ...opt2,
        date: propsOptDate2,
      });
    }
    if (propsOptPlace2 !== undefined) {
      setOpt2({
        ...opt2,
        place: propsOptPlace2,
      });
    }
    // eslint-disable-next-line
  }, [propsOptDate2, propsOptPlace2]);

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (url: string) => {
    setFilteredTracks([]);
    let tempTracks: any = [];
    const response = await getTracks(url);
    response.results.forEach(async (item: any) => {
      tempTracks.push(item);
    });
    setTracks((oldArr) => oldArr.concat(tempTracks));
    if (response.next) {
      return await fetchTracks(response.next);
    }
  };
  useEffect(() => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
    // eslint-disable-next-line
  }, []);
  // =============================== FILTER TRACKS BY COMPANY AND CITY ====================================

  useEffect(() => {
    tracks.forEach((item) => {
      if (userInfoContext.company.id === item.company.id) {
        if (item?.municipality?.department?.id === propsCity.department.id) {
          setFilteredTracks((oldArr: any) => [...oldArr, item]);
        }
      }
    });
    //eslint-disable-next-line
  }, [tracks, userInfoContext.company.id]);

  // =============================== CLICK ON ADD TRACK ====================================
  const handleClickAddTrack = () => {
    // let newUrl = url.split("/")[1];
    // history.push({
    //   pathname: `/${newUrl}/pistas`,
    //   state: { detail: "some_value" },
    // });
    setShowModalTracks(true);
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
        <Row>
          <Col md={12} className="text-center">
            <p>
              <strong>RECUERDA:</strong>
              <br />
              Una solicitud podra tener máximo 2 opciones de Lugar / Fecha /
              Hora.
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="pl-3 pr-3 ">
              <h6 className="text-center mb-0 p-2">ALTERNATIVA 1</h6>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      placeholder={propsCity?.name}
                    />
                  </Form.Group>

                  {propsTrack ? (
                    <Form.Group as={Col} controlId="formGridPlace">
                      <Form.Label>
                        Lugar <small>(Cliente)</small>
                      </Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        placeholder={propsTrack?.name}
                      />
                    </Form.Group>
                  ) : propsOptPlace1 ? (
                    <Form.Group as={Col} controlId="formGridPlace">
                      <Form.Label>Lugar</Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        placeholder={propsOptPlace1?.name}
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group as={Col} controlId="formGridPlace">
                      <Form.Label>Lugar</Form.Label>
                      <PlacesDropdown disabled />
                      {filteredTracks.length === 0 && (
                        <small className="text-danger">
                          No tienes pistas en {propsCity?.name}
                        </small>
                      )}
                    </Form.Group>
                  )}

                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Fecha</Form.Label>
                    <DatePicker
                      className={`red-border ${
                        propsOptDate1 ? "disabled" : ""
                      }`}
                      disabled={propsOptDate1 ? true : false}
                      selected={opt1.date ? new Date(opt1.date) : date}
                      onChange={(date) =>
                        setOpt1({
                          ...opt1,
                          date,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Hora</Form.Label>
                    <DatePicker
                      className={`red-border ${
                        propsOptDate1 ? "disabled" : ""
                      }`}
                      disabled={propsOptDate1 ? true : false}
                      selected={opt1.date ? new Date(opt1?.date) : hour}
                      onChange={(hour) =>
                        setOpt1({
                          ...opt1,
                          date: hour,
                        })
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Hora"
                      dateFormat="h:mm aa"
                    />
                  </Form.Group>
                </Form.Row>
              </Form>
            </Card>
          </Col>
        </Row>

        {showAlternative || propsOptDate2 ? (
          <Row>
            <Col md={12}>
              <Card className="pl-3 pr-3  mt-2">
                <h6 className="text-center mb-0 p-2">ALTERNATIVA 2</h6>
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        placeholder={propsCity?.name}
                      />
                    </Form.Group>

                    {propsTrack ? (
                      <Form.Group as={Col} controlId="formGridPlace">
                        <Form.Label>
                          Lugar <small>(Cliente)</small>
                        </Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          placeholder={propsTrack?.name}
                        />
                      </Form.Group>
                    ) : propsOptPlace2 ? (
                      <Form.Group as={Col} controlId="formGridPlace">
                        <Form.Label>Lugar</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          placeholder={propsOptPlace2?.name}
                        />
                      </Form.Group>
                    ) : (
                      <Form.Group as={Col} controlId="formGridPlace2">
                        <Form.Label>Lugar</Form.Label>
                        <PlacesDropdown2 />
                        {filteredTracks.length === 0 && (
                          <small className="text-danger">
                            No tienes pistas en {propsCity?.department?.name}
                          </small>
                        )}
                      </Form.Group>
                    )}

                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Fecha</Form.Label>
                      <DatePicker
                        className={`red-border ${
                          propsOptDate2 ? "disabled" : ""
                        }`}
                        disabled={propsOptDate2 ? true : false}
                        selected={opt2.date ? new Date(opt2.date) : date}
                        onChange={(date) =>
                          setOpt2({
                            ...opt2,
                            date,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Hora</Form.Label>
                      <DatePicker
                        className={`red-border ${
                          propsOptDate2 ? "disabled" : ""
                        }`}
                        disabled={propsOptDate2 ? true : false}
                        selected={opt2.date ? new Date(opt2.date) : hour}
                        onChange={(hour) =>
                          setOpt2({
                            ...opt2,
                            date: hour,
                          })
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Hora"
                        dateFormat="h:mm aa"
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <Row>
          <Col md={12} className="text-center mt-3">
            <ButtonGroup toggle>
              {!propsOptDate2 && !propsOptDate1 ? (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={handleClickAddTrack}
                >
                  Agregar Pistas
                </Button>
              ) : (
                ""
              )}
              {!propsOptDate2 && !propsOptDate1 ? (
                <Form.Check
                  custom
                  className="ml-2"
                  type={"checkbox"}
                  id={`custom-checkbox`}
                  label={`Alternativa 2`}
                  onChange={() => setShowAlternative(!showAlternative)}
                />
              ) : (
                ""
              )}
            </ButtonGroup>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        {!propsOptDate1 && (
          <Button
            variant="primary"
            disabled={disabled}
            onClick={() => {
              swal({
                title: "¿Estas seguro?",
                text:
                  "Une vez confirmes, las opciones de Lugar, Fecha y Hora no podran ser modificadas.",
                icon: "warning",
                buttons: ["No, volver", "Si, confirmar"],
                dangerMode: true,
              }).then(async (willUpdate) => {
                if (willUpdate) {
                  let payload = {
                    optional_place1: opt1.place,
                    optional_date1: opt1.date,
                    operator: userInfoContext.id,
                  };
                  let payload2 = {
                    optional_place1: opt1.place,
                    optional_date1: opt1.date,
                    optional_place2: opt2.place,
                    optional_date2: opt2.date,
                    operator: userInfoContext.id,
                  };

                  let res = await updateRequest(
                    showAlternative ? payload2 : payload,
                    requestId
                  );
                  if (res.status === 200) {
                    // setDisabled(true);
                    updateRequests();
                    swal("Solicitud actualizada!", {
                      icon: "success",
                    });
                  } else {
                    swal("Oops, no se pudo actualizar el servicio.", {
                      icon: "error",
                    });
                  }
                }
              });
            }}
          >
            Confirmar
          </Button>
        )}
      </Modal.Footer>
      {showModalTracks && (
        <ModalNewTrack
          handleClose={() => setShowModalTracks(false)}
          fetchTracks={() =>
            fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`)
          }
        />
      )}
    </Modal>
  );
};
export default ModalPlaceDate;
