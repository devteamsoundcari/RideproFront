import React, { useState, useEffect, useContext } from 'react';
// import { useHistory, useRouteMatch } from "react-router-dom";
import DatePicker, { registerLocale } from 'react-datepicker';
import swal from 'sweetalert';
// import { RequestsContext } from '../../../../contexts/RequestsContext';
import { AuthContext } from '../../../../contexts/AuthContext';
import { TracksContext } from '../../../../contexts/TracksContext';
import {
  /*getTracks,*/ updateRequest
} from '../../../../controllers/apiRequests';
import { PaginationTable } from '../../../PaginationTable/PaginationTable';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { SelectRowProps } from 'react-bootstrap-table-next';
import {
  Modal,
  Button,
  Col,
  Row,
  ButtonGroup,
  Form,
  Card
} from 'react-bootstrap';
// import useDropdown from '../../../../utils/useDropdown';
import es from 'date-fns/locale/es';
import './ModalPlaceDate.scss';
import ModalNewTrack from '../../../Tracks/ModalNewTrack/ModalNewTrack';
import defaultImage from '../../../../assets/img/track.jpg';
import { Track } from '../../../Tracks/Tracks';
import { Spinner } from 'react-bootstrap';

registerLocale('es', es);

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

// interface Track {
//   id: number;
//   name: string;
//   address: string;
//   description: string;
//   municipality: any;
//   company: any;
// }
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
  requestId
}) => {
  const { getTracksV2, loadingTracks, setLoadingTracks, url } =
    useContext(TracksContext);
  const [sizePerPage, setSizePerPage] = useState<number>(25);
  const [totalTracks, setTotalTracks] = useState<number>(0);
  const [disabled, setDisabled] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [altCurrentPage, setAltCurrentPage] = useState<number>(1);
  // const history = useHistory();
  // let { url } = useRouteMatch();
  const [filteredTracks, setFilteredTracks] = useState<Tracks>([]);
  const [altFilteredTracks, setAltFilteredTracks] = useState<Tracks>([]);
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(new Date());
  const [opt1, setOpt1] = useState({
    date: propsOptDate1 ? new Date(propsOptDate1) : '',
    place: ''
  });
  const [opt2, setOpt2] = useState({
    date: propsOptDate2 ? new Date(propsOptDate2) : '',
    place: ''
  });
  const [showAlternative, setShowAlternative] = useState(false);
  const { userInfoContext } = useContext(AuthContext);
  const [showModalTracks, setShowModalTracks] = useState(false);

  useEffect(() => {
    if (propsDate !== undefined) {
      setDate(new Date(propsDate));
      setHour(new Date(propsDate));
    }
  }, [propsDate]);

  useEffect(() => {
    if (propsOptDate1 !== undefined || propsOptDate1 !== null) {
      setOpt1({
        ...opt1,
        date: propsOptDate1 === '' ? new Date().toDateString() : propsOptDate1
      });
    }
    if (propsOptPlace1 !== undefined) {
      setOpt1({
        ...opt1,
        place: propsOptPlace1
      });
    }
    // eslint-disable-next-line
  }, [propsOptDate1, propsOptPlace1]);

  useEffect(() => {
    if (propsOptDate2 !== undefined) {
      setOpt2({
        ...opt2,
        date: propsOptDate2 === '' ? new Date().toDateString() : propsOptDate2
      });
    }
    if (propsOptPlace2 !== undefined) {
      setOpt2({
        ...opt2,
        place: propsOptPlace2
      });
    }
    // eslint-disable-next-line
  }, [propsOptDate2, propsOptPlace2]);

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (searchT: string) => {
    // Se pone un condicional para verificar si el search term es = al propsCity.name y así agregar las búsquedasademás de la ciudad
    const searchTerm =
      searchT === propsCity.name ? searchT : `${propsCity.name} ${searchT}`;

    // Alternativa al ternario
    /*let searchTerm: string = '';
    if (searchT === propsCity.name) {
      searchTerm = searchT;
    } else {
      searchTerm = `${propsCity.name} ${searchT}`;
    }*/

    const response = await getTracksV2(url, searchTerm);
    // console.log('Response', response.data.results);
    setFilteredTracks(response.data.results);
    setAltFilteredTracks(response.data.results);
    setSizePerPage(response.data.results.length);
    setTotalTracks(response.data.count);
  };

  async function fetchTracksV2(
    url: string,
    type: string,
    alternative?: boolean
  ) {
    if (type === 'page') {
      let tempArr: any[] = [];
      const response: {
        data: any;
        results: object[];
        count: number;
      } = await getTracksV2(url, propsCity.name);

      // console.log('Response data', response.data);

      response.data.results.forEach((item: any) => {
        tempArr.push(item);
      });

      if (!alternative) {
        setFilteredTracks(tempArr);
      } else {
        setAltFilteredTracks(tempArr);
      }
    } else if (type === 'word') {
      const response: {
        data: any;
        results: object[];
        count: number;
      } = await getTracksV2(url, propsCity.name);

      if (!alternative) {
        setFilteredTracks(response.data.results as Tracks);
        setCurrentPage(1);
      } else {
        setAltFilteredTracks(response.data.results as Tracks);
        setCurrentPage(1);
      }
    }
    setLoadingTracks(false);
  }

  const search = async (
    value: number | string,
    param: string,
    type: string,
    pageToGo?: number | null,
    alternative?: boolean
  ) => {
    if (value !== '') {
      // se le pasa la url con el parametro casi siempre search y el valor
      const url2 = `${url}&${param}=${value}`;
      await fetchTracksV2(url2, type, alternative);
      if (pageToGo) {
        if (!alternative) {
          setCurrentPage(pageToGo);
        } else {
          setAltCurrentPage(pageToGo);
        }
      } else {
        if (!alternative) {
          setCurrentPage(1);
        } else {
          setAltCurrentPage(1);
        }
      }
    }
    if (value === '') {
      // se le pasa la url sin parametros en el caso que el usuario quiera ver de nuevo todos los resultados
      fetchTracksV2(`${url}/api/v1/tracks/`, type, alternative);
      if (!alternative) {
        setCurrentPage(1);
      } else {
        setAltCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    fetchTracks(propsCity.name);
    // eslint-disable-next-line
  }, []);

  // ================================ DATOS TABLA =============================================================
  // const [showAddTrack, setShowAddTrack] = useState(false);
  // const [showTrackEditModal, setShowTrackEditModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedTrack2, setSelectedTrack2] = useState<Track | null>(null);

  useEffect(() => {
    if (showAlternative) {
      if (
        propsTrack ||
        (opt1.place && opt1.place !== '' && opt2.place && opt2.place !== '')
      ) {
        if (opt1.date && opt2.date) {
          setDisabled(false);
        }
      } else {
        setDisabled(true);
      }
    } else {
      if (propsTrack && opt1.date !== '') {
        setDisabled(false);
      } else if (opt1.place && opt1.place !== null) {
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
    opt2
  ]);

  useEffect(() => {
    if (selectedTrack) {
      setOpt1((prevOpt1) => ({
        ...prevOpt1,
        place: selectedTrack.id.toString()
      }));
    }
    // eslint-disable-next-line
  }, [selectedTrack]);

  useEffect(() => {
    if (selectedTrack2) {
      setOpt2((prevOpt2) => ({
        ...prevOpt2,
        place: selectedTrack2.id.toString()
      }));
    }
    // eslint-disable-next-line
  }, [selectedTrack2]);

  const formatLocation = (cell: any, row: any) => {
    if (cell !== '4.681475271707987') {
      return (
        <a
          className="m-0 p-0 track-link"
          target="n_blank"
          href={`https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`}>
          Ver <FaExternalLinkAlt />
        </a>
      );
    } else {
      return '---';
    }
  };

  const formatImg = (cell: any) => {
    return (
      <div
        style={{
          background: `url(${
            cell ? cell : defaultImage
          }) no-repeat center center`,
          backgroundSize: 'cover',
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          margin: 'auto'
        }}></div>
    );
  };

  const fields = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true
    },
    {
      dataField: 'pictures',
      text: 'Img',
      formatter: formatImg,
      headerStyle: {
        width: '5rem'
      },
      style: {
        padding: '5px 0px'
      }
    },
    {
      dataField: 'name',
      text: 'Nombre'
      // filter: textFilter()
    },
    {
      dataField: 'municipality.department.name',
      text: 'Departamento',
      // filter: textFilter(),
      sort: true
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      // filter: textFilter(),
      sort: true
    },
    {
      dataField: 'address',
      text: 'Dirección'
    },
    {
      dataField: 'latitude',
      text: 'Ubicación',
      formatter: formatLocation
    }
  ];

  const selectRow: SelectRowProps<any> = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    // @ts-ignore
    bgColor: 'lightgreen',
    onSelect: (row: any) => {
      setSelectedTrack(row);
      setTrackData(row, false);
    }
  };

  const selectRow2: SelectRowProps<any> = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    // @ts-ignore
    bgColor: 'lightgreen',
    onSelect: (row: any) => {
      setSelectedTrack2(row);
      setTrackData(row, true);
    }
  };

  const setTrackData = (row: any, alternative: boolean) => {
    const track: Track = row;
    track.contactName = row.contact_name;
    track.contactEmail = row.contact_email;

    setSelectedTrack(track);

    // Se incluye un parámetro alternative, que permite actualizar la opción 1 o 2 que seleccione el usuario
    alternative
      ? setOpt1({
          ...opt1,
          place: track.name
        })
      : setOpt2({ ...opt2, place: track.name });
  };

  const handlePageChange = async (page: number, alternative: boolean) => {
    await search(page, 'page', 'page', null, alternative);
    if (!alternative) {
      setCurrentPage(page);
    } else {
      setAltCurrentPage(page);
    }
  };

  // const updateTrackInfo = (track: Track) => {
  //   let newTracks = [...tracks];
  //   let index = newTracks.findIndex((t) => t.id === track.id);
  //   if (index >= 0) {
  //     newTracks[index] = track;
  //   }
  // };

  // =============================== FILTER TRACKS BY COMPANY AND CITY ====================================

  useEffect(() => {
    if (filteredTracks.length > 0) {
      return;
    } else {
      filteredTracks.forEach((item) => {
        if (userInfoContext.company.id === item.company.id) {
          setFilteredTracks((oldArr: any) => [...oldArr, item]);
        }
      });
    }
    //eslint-disable-next-line
  }, [filteredTracks, userInfoContext.company.id]);

  useEffect(() => {
    if (altFilteredTracks.length > 0) {
      return;
    } else {
      altFilteredTracks.forEach((item) => {
        if (userInfoContext.company.id === item.company.id) {
          setAltFilteredTracks((oldArr: any) => [...oldArr, item]);
        }
      });
    }
    //eslint-disable-next-line
  }, [altFilteredTracks, userInfoContext.company.id]);

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
      className="modal-admin-placedate">
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

                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Fecha</Form.Label>
                    <DatePicker
                      className={`red-border ${
                        propsOptDate1 ? 'disabled' : ''
                      }`}
                      disabled={propsOptDate1 ? true : false}
                      selected={opt1.date ? new Date(opt1.date) : date}
                      onChange={(date) =>
                        setOpt1({
                          ...opt1,
                          date
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Hora</Form.Label>
                    <DatePicker
                      className={`red-border ${
                        propsOptDate1 ? 'disabled' : ''
                      }`}
                      disabled={propsOptDate1 ? true : false}
                      selected={opt1.date ? new Date(opt1?.date) : hour}
                      onChange={(hour) =>
                        setOpt1({
                          ...opt1,
                          date: hour
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

        {loadingTracks ? (
          <Spinner animation="border" role="status" size="sm">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        ) : (
          <PaginationTable
            onTableSearch={(text) => fetchTracks(text)}
            columns={fields}
            data={filteredTracks}
            page={currentPage}
            sizePerPage={sizePerPage}
            totalSize={totalTracks}
            onPageChange={(page: any) => handlePageChange(page, false)}
            onRowClick={selectRow}
          />
        )}

        {showAlternative || propsOptDate2 ? (
          <>
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

                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Fecha</Form.Label>
                        <DatePicker
                          className={`red-border ${
                            propsOptDate2 ? 'disabled' : ''
                          }`}
                          disabled={propsOptDate2 ? true : false}
                          selected={opt2.date ? new Date(opt2.date) : date}
                          onChange={(date) =>
                            setOpt2({
                              ...opt2,
                              date
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Hora</Form.Label>
                        <DatePicker
                          className={`red-border ${
                            propsOptDate2 ? 'disabled' : ''
                          }`}
                          disabled={propsOptDate2 ? true : false}
                          selected={opt2.date ? new Date(opt2.date) : hour}
                          onChange={(hour) =>
                            setOpt2({
                              ...opt2,
                              date: hour
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

            {propsTrack ? (
              <Form.Group as={Col} controlId="formGridPlace">
                <Form.Label>
                  Lugar <small>(Cliente)</small>
                </Form.Label>
                {loadingTracks ? (
                  <Spinner animation="border" role="status" size="sm">
                    <span className="sr-only">Cargando...</span>
                  </Spinner>
                ) : (
                  <PaginationTable
                    onTableSearch={(text) => fetchTracks(text)}
                    columns={fields}
                    data={altFilteredTracks}
                    page={altCurrentPage}
                    sizePerPage={sizePerPage}
                    totalSize={totalTracks}
                    onPageChange={(page: any) => handlePageChange(page, true)}
                    onRowClick={selectRow2}
                  />
                )}
              </Form.Group>
            ) : propsOptPlace2 ? (
              <Form.Group as={Col} controlId="formGridPlace">
                <Form.Label>Lugar</Form.Label>
                {loadingTracks ? (
                  <Spinner animation="border" role="status" size="sm">
                    <span className="sr-only">Cargando...</span>
                  </Spinner>
                ) : (
                  <PaginationTable
                    onTableSearch={(text) => fetchTracks(text)}
                    columns={fields}
                    data={altFilteredTracks}
                    page={altCurrentPage}
                    sizePerPage={sizePerPage}
                    totalSize={totalTracks}
                    onPageChange={(page: any) => handlePageChange(page, true)}
                    onRowClick={selectRow2}
                  />
                )}
              </Form.Group>
            ) : (
              <>
                {loadingTracks ? (
                  <Spinner animation="border" role="status" size="sm">
                    <span className="sr-only">Cargando...</span>
                  </Spinner>
                ) : (
                  <PaginationTable
                    onTableSearch={(text) => fetchTracks(text)}
                    columns={fields}
                    data={altFilteredTracks}
                    page={altCurrentPage}
                    sizePerPage={sizePerPage}
                    totalSize={totalTracks}
                    onPageChange={(page: any) => handlePageChange(page, true)}
                    onRowClick={selectRow2}
                  />
                )}
              </>
            )}
          </>
        ) : (
          ''
        )}
        <Row>
          <Col md={12} className="text-center mt-3">
            <ButtonGroup toggle>
              {!propsOptDate2 && !propsOptDate1 ? (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={handleClickAddTrack}>
                  Agregar Pistas
                </Button>
              ) : (
                ''
              )}
              {!propsOptDate2 && !propsOptDate1 ? (
                <Form.Check
                  custom
                  className="ml-2"
                  type={'checkbox'}
                  id={`custom-checkbox`}
                  label={`Alternativa 2`}
                  onChange={() => setShowAlternative(!showAlternative)}
                />
              ) : (
                ''
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
                title: '¿Estas seguro?',
                text: 'Une vez confirmes, las opciones de Lugar, Fecha y Hora no podran ser modificadas.',
                icon: 'warning',
                buttons: ['No, volver', 'Si, confirmar'],
                dangerMode: true
              }).then(async (willUpdate) => {
                if (willUpdate) {
                  let payload = {
                    optional_place1: opt1.place,
                    optional_date1: new Date(opt1.date).toISOString(),
                    operator: userInfoContext.id
                  };
                  let payload2 = {
                    optional_place1: opt1.place,
                    optional_date1: new Date(opt1.date).toISOString(),
                    optional_place2: opt2.place,
                    optional_date2: new Date(opt2.date).toISOString(),
                    operator: userInfoContext.id
                  };

                  // console.log('Date 1', opt1.date);
                  // console.log('Payload', payload);

                  let res = await updateRequest(
                    showAlternative ? payload2 : payload,
                    requestId
                  );
                  if (res.status === 200) {
                    setDisabled(true);

                    // updateRequests();
                    swal('Solicitud actualizada!', {
                      icon: 'success',
                      closeOnClickOutside: true,
                      closeOnEsc: true
                    });
                  } else {
                    swal('Oops, no se pudo actualizar el servicio.', {
                      icon: 'error'
                    });
                  }
                }
              });
            }}>
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
