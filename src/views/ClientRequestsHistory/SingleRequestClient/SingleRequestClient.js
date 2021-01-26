import React, { useState, useEffect, useContext } from 'react';
import swal from 'sweetalert';
import {
  Row,
  Spinner,
  Tabs,
  Tab,
  Col,
  Table,
  Nav,
  Button,
  Tooltip,
  OverlayTrigger,
  Form
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
  getRequest,
  fetchDriver,
  getAllDrivers,
  cancelRequestId,
  sendEmail,
  updateRequest,
  fetchInstructor
} from '../../../controllers/apiRequests';
import { TiCogOutline } from 'react-icons/ti';
import { EditableTable } from '../../../utils/EditableTable';
import {
  MdHelpOutline,
  MdLocalPhone,
  MdPeople,
  MdWarning
} from 'react-icons/md';
import { FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { dateFormatter, formatAMPM } from '../../../utils/helpFunctions';
import ClientStatus from '../../../utils/ClientStatus';
import RegularExpressions from '../../../utils/RegularExpressions';
import { ParticipantsContext } from '../../../contexts/ParticipantsContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { RequestsContext } from '../../../contexts/RequestsContext';
import ServiceEditConfirmationModal from './ServiceEditConfirmationModal';
import NotEnoughCreditsModal from './NotEnoughCreditsModal';
import './SingleRequestClient.scss';
import SingleDriver from '../../AdminRequestsHistory/SingleRequestAdmin/Drivers/SingleDriver';

const SingleRequestClient = () => {
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // const [showCancellationModal, setShowCancellationModal] = useState(false);
  let { requestId } = useParams();
  const [loading, setLoading] = useState(false);

  const { updateRequests } = useContext(RequestsContext);
  const [selectedOption, setSelectedOption] = useState(0);

  const [data, setData] = useState();
  const {
    setAllParticipantsInfoContext,
    setRegisteredParticipantsContext,
    setParticipantsToRegisterContext,
    newParticipantsContext
    // setNewParticipantsContext,
  } = useContext(ParticipantsContext);
  const [showNotEnoughCreditsModal, setShowNotEnoughCreditsModal] = useState(
    false
  );
  const [additionalCredits, setAdditionalCredits] = useState(0);
  const [driversForReplacing, setDriversForReplacing] = useState([]);
  const [allDrivers, setAllDrivers] = useState(null);
  const [initialRegisteredDrivers, setInitialRegisteredDrivers] = useState(
    null
  );
  const [registeredDrivers, setRegisteredDrivers] = useState(null);
  const [newDrivers, setNewDrivers] = useState([]);
  //eslint-disable-next-line
  const [areDriversValid, setAreDriversValid] = useState(true);
  const [canSaveDrivers, setCanSaveDrivers] = useState(false);
  const [defaultTab, setDefaultTab] = useState('participants');
  const [instructor, setInstructor] = useState(null);
  const [penaltyRides, setPenaltyRides] = useState(0);

  // ================ Set penalty rides =================

  useEffect(() => {
    if (data) {
      let eventDate = new Date(data.start_time);
      let now = new Date();
      let diffHours = Math.floor(Math.abs(eventDate - now) / 36e5);
      let hoursPriority = cancelationPriority(data.service.priority);
      if (diffHours <= hoursPriority) {
        setPenaltyRides(data.service.penalty_rides);
      } else {
        setPenaltyRides(0);
      }
    }
  }, [data]);

  // ===================== Get first instructor ========================
  useEffect(() => {
    async function getFirstInstructor(id) {
      const res = await fetchInstructor(id);
      setInstructor(res);
    }
    if (data && data.instructors.length > 0) {
      getFirstInstructor(data.instructors[0]);
    }
  }, [data]);

  // ==================== Set defaulkey tab depending on status =====================
  //

  useEffect(() => {
    if (data) {
      if (data.status.step === 2) {
        setDefaultTab('place');
      } else {
        setDefaultTab('participants');
      }
    }
  }, [data]);

  // ============ Listening Socket==================
  useEffect(() => {
    let token = localStorage.getItem('token');
    let requestsSocket = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
    );
    requestsSocket.addEventListener('open', () => {
      let payload = {
        action: 'subscribe_to_requests',
        request_id: userInfoContext.id
      };
      requestsSocket.send(JSON.stringify(payload));
    });
    requestsSocket.onmessage = async function (event) {
      let data = JSON.parse(event.data);
      if (data.data.id === parseInt(requestId)) {
        fetchRequest(data.data.id);
      }
    };
    // eslint-disable-next-line
  }, []);

  // =============== Fetch request ===================
  async function fetchRequest(id) {
    setLoading(true);
    const responseRequest = await getRequest(id);
    setLoading(false);
    setData(responseRequest);
  }

  useEffect(() => {
    setAllDrivers(null);
    fetchRequest(requestId);
    // eslint-disable-next-line
  }, [requestId]);

  const fields = {
    official_id: {
      name: 'Identificación',
      format: 'string',
      regex: /^E?\d+$/,
      unique: true,
      errorMessages: {
        regex: 'Por favor, ingresa un número válido.',
        unique: 'Oops, este documento ya esta siendo usado por otra persona.'
      }
    },
    first_name: {
      name: 'Nombre',
      regex: RegularExpressions.name,
      unique: false,
      errorMessages: {
        regex: 'Por favor, ingresa un nombre válido.'
      }
    },
    last_name: {
      name: 'Apellido',
      regex: RegularExpressions.name,
      unique: false,
      errorMessages: {
        regex: 'Por favor, ingresa un apellido válido.'
      }
    },
    email: {
      name: 'Email',
      regex: RegularExpressions.email,
      unique: false,
      errorMessages: {
        regex: 'Por favor, ingresa un email válido.'
      }
    },
    cellphone: {
      name: 'Teléfono',
      regex: /^\d{7,10}$/,
      unique: false,
      errorMessages: {
        regex: 'Por favor, ingresa un teléfono válido..'
      }
    },
    isRegistered: {
      name: '',
      format: 'boolean',
      hidden: true,
      default: false
    }
  };

  useEffect(() => {
    if (newParticipantsContext.length > 0 && allDrivers.length > 0) {
      setDriversForReplacing(
        newParticipantsContext.map((driver) => {
          driver.isRegistered = true;
          return driver;
        })
      );
      setInitialRegisteredDrivers(newParticipantsContext);
      setRegisteredDrivers(newParticipantsContext);
      setNewDrivers([]);
      setAreDriversValid(true);
      setCanSaveDrivers(false);
    }
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers_company/`);
    //eslint-disable-next-line
  }, [newParticipantsContext]);

  useEffect(() => {
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers_company/`);
    // eslint-disable-next-line
  }, []);

  // =============== Fetch drivers of request ===================
  useEffect(() => {
    if (data) {
      let getDrivers = async (ids) => {
        return Promise.all(ids.map((id) => fetchDriver(id)));
      };
      getDrivers(data.drivers).then((data) => {
        let obtainedDrivers = data.map((driver) => {
          driver.isRegistered = true;
          return driver;
        });
        setAllDrivers(obtainedDrivers);
        setRegisteredDrivers(obtainedDrivers);
        setInitialRegisteredDrivers(obtainedDrivers);
      });
    }
    // eslint-disable-next-line
  }, [data]);

  const fetchDrivers = async (url) => {
    const items = [];
    const response = await getAllDrivers(url);
    if (response) {
      if (response.next) {
        response.results.map((item) => {
          items.push(item);
          return true;
        });
        return await fetchDrivers(response.next);
      }
      response.results.map((item) => {
        items.push(item);
        return true;
      });
    }
    setAllParticipantsInfoContext(items);
  };
  const hideNotEnoughCreditsModal = () => {
    setShowNotEnoughCreditsModal(false);
  };

  const handleAllDrivers = (x) => {
    setAllDrivers(x);
  };

  const handleNewDriversValidation = (x) => {
    setAreDriversValid(x);
  };

  const saveDrivers = () => {
    if (userInfoContext.credit >= additionalCredits) {
      setShowConfirmationModal(true);
    } else {
      setShowNotEnoughCreditsModal(true);
    }
  };

  const isParticipantAlreadyRegistered = (participant) => {
    if (participant.isRegistered === true) {
      return true;
    }
  };

  useEffect(() => {
    if (allDrivers && registeredDrivers) {
      let registeredIDs = registeredDrivers.map((driver) => {
        return driver.official_id;
      });
      let unregistered = allDrivers.filter((driver) => {
        let index = registeredIDs.findIndex((id) => {
          return id === driver.official_id;
        });
        return index < 0 ? true : false;
      });
      let registered = allDrivers.filter((driver) => {
        let index = registeredIDs.findIndex((id) => {
          return id === driver.official_id;
        });
        return index >= 0 ? true : false;
      });
      setRegisteredDrivers(registered);
      setRegisteredParticipantsContext(registered);
      setNewDrivers(unregistered);
      setParticipantsToRegisterContext(allDrivers);
      setAdditionalCredits(unregistered.length * data?.service?.ride_value);
    }
    //eslint-disable-next-line
  }, [allDrivers]);

  useEffect(() => {
    if (registeredDrivers && initialRegisteredDrivers) {
      if (
        registeredDrivers.length !== initialRegisteredDrivers.length ||
        newDrivers.length > 0
      ) {
        if (registeredDrivers.length === 0) {
          setCanSaveDrivers(false);
        } else {
          setCanSaveDrivers(true);
        }
      } else {
        setCanSaveDrivers(false);
      }
    }
    //eslint-disable-next-line
  }, [newDrivers, registeredDrivers]);

  const cancelMessage = () => {
    if (penaltyRides > 0) {
      return `Cancelar este servicio te costara ${data.service.penalty_rides} rides`;
    } else {
      return 'Cancelar este servicio no genera costo alguno.';
    }
  };

  const handleCancelEvent = async (z) => {
    // setShowCancellationModal(true);
    swal({
      title: 'Un momento!',
      text: `${cancelMessage()} ¿Estas seguro que deseas cancelar esta solicitud?`,
      icon: 'warning',
      buttons: ['No, volver', 'Si, estoy seguro'],
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        setLoading(true);

        let payload = {
          id: requestId,
          user: userInfoContext,
          companyId: userInfoContext.company.id,
          reject_msg: `Cancelado por el usuario ${
            penaltyRides ? `| Penalidad: $${penaltyRides} rides` : ''
          }`,
          newCredit:
            parseInt(userInfoContext.credit) +
            parseInt(data.spent_credit) -
            parseInt(penaltyRides)
        };
        const res = await cancelRequestId(payload);
        if (res.canceled.status === 200 && res.refund.status === 200) {
          setUserInfoContext({
            ...userInfoContext,
            credit: res.refund.data.credit
          });
          swal('Poof! Esta solicitud ha sido cancelada', {
            icon: 'success'
          });
          setLoading(false);

          const payload = {
            id: res.canceled.data.id,
            emailType: 'canceledRequest',
            subject: 'Solicitud cancelada ❌',
            email: userInfoContext.email,
            name: userInfoContext.name,
            date: res.canceled.data.start_time,
            refund_credits: res.canceled.data.spent_credit,
            service: res.canceled.data.service.name,
            municipality: {
              city: res.canceled.data.municipality.name,
              department: res.canceled.data.municipality.department.name
            }
          };
          await sendEmail(payload); // SEND SERVICE CANCELED EMAIL TO USER
        } else {
          setLoading(false);
          swal('Ooops! No pudimos cancelar la solicitud', {
            icon: 'error'
          });
        }
      } else {
        swal('Tranqui, no paso nada!');
      }
    });
  };

  const notEnoughCreditsModal = () => {
    return (
      <NotEnoughCreditsModal
        show={showNotEnoughCreditsModal}
        onHide={hideNotEnoughCreditsModal}
        creditCost={additionalCredits}
        className="child-modal"
      />
    );
  };

  const renderTooltipTrack = (track) => {
    return (
      <Tooltip id={`button-${track.name}`}>
        {track.name}
        <br />
        {track.address}
        <br />
        {track.municipality.name}
        <br />
        {track.municipality.department.name}
      </Tooltip>
    );
  };

  const renderPlaceDateOptions = (track) => {
    if (data.status.step === 2) {
      return (
        <Tab
          eventKey="place"
          title={
            <span className="text-danger">
              <MdWarning /> Lugar y Fecha
            </span>
          }>
          <div className="w-100 text-center">
            {data.optional_date1 && data.status.step < 3 ? (
              <div className="d-flex align-items-center justify-content-between">
                <Table bordered hover size="sm" className="ml-4 mr-4">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Ciudad</th>
                      <th>Lugar</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {track
                          ? track.municipality.name
                          : data.optional_place1.municipality.name}
                      </td>
                      <td>{track ? track.name : data.optional_place1.name}</td>
                      <td>{dateFormatter(new Date(data.optional_date1))}</td>
                      <td>{formatAMPM(new Date(data.optional_date1))}</td>
                      <td>
                        <Form.Check
                          type="radio"
                          label="Opción 1"
                          name="formHorizontalRadios"
                          id="formHorizontalRadios1"
                          onChange={() => setSelectedOption(1)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ) : (
              ''
            )}

            {data.optional_date2 && data.status.step < 3 ? (
              <div className="d-flex align-items-center justify-content-between">
                <Table bordered hover size="sm" className="ml-4 mr-4">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Ciudad</th>
                      <th>Lugar</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {track
                          ? track.municipality.name
                          : data.optional_place2.municipality.name}
                      </td>
                      <td>{track ? track.name : data.optional_place2.name}</td>
                      <td>{dateFormatter(new Date(data.optional_date2))}</td>
                      <td>{formatAMPM(new Date(data.optional_date2))}</td>
                      <td>
                        <Form.Check
                          type="radio"
                          label="Opción 2"
                          name="formHorizontalRadios"
                          id="formHorizontalRadios2"
                          // style={{ width: "7rem" }}
                          onChange={() => setSelectedOption(2)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ) : (
              ''
            )}

            {data.track && data.status.step > 2 ? (
              <div className="d-flex align-items-center justify-content-between">
                <Table bordered hover size="sm" className="ml-4 mr-4">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Ciudad</th>
                      <th>Lugar</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{track.municipality.name}</td>
                      <td>{track.name}</td>
                      <td>{dateFormatter(new Date(data.start_time))}</td>
                      <td>{formatAMPM(new Date(data.start_time))}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ) : (
              ''
            )}
          </div>

          {userInfoContext.profile === 2 && (
            <div className="text-center w-100">
              <Button
                variant="success"
                size="sm"
                disabled={selectedOption !== 0 ? false : true}
                onClick={() => {
                  swal({
                    title: 'Confirmando programación',
                    text: `Tu solicitud se llevara acabo el ${
                      selectedOption === 1
                        ? dateFormatter(data.optional_date1)
                        : selectedOption === 2
                        ? dateFormatter(data.optional_date2)
                        : ''
                    } en ${
                      track
                        ? track.name
                        : selectedOption === 1
                        ? data.optional_place1.name
                        : selectedOption === 2
                        ? data.optional_place2.name
                        : ''
                    } - ${
                      track
                        ? track.municipality.name
                        : selectedOption === 1
                        ? data.optional_place1.municipality.name
                        : selectedOption === 2
                        ? data.optional_place2.municipality.name
                        : ''
                    } - ${
                      track
                        ? track.municipality.department.name
                        : selectedOption === 1
                        ? data.optional_place1.municipality.department.name
                        : selectedOption === 2
                        ? data.optional_place2.municipality.department.name
                        : ''
                    } a las ${
                      selectedOption === 1
                        ? formatAMPM(new Date(data.optional_date1))
                        : selectedOption === 2
                        ? formatAMPM(new Date(data.optional_date2))
                        : ''
                    }`,
                    icon: 'info',
                    buttons: ['No, volver', 'Si, confirmar servicio'],
                    dangerMode: true
                  }).then(async (willUpdate) => {
                    if (willUpdate) {
                      let payload1 = {
                        track:
                          track !== null
                            ? track.id
                            : data.optional_place1
                            ? data.optional_place1.id
                            : '',
                        start_time: data.optional_date1,
                        status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`
                      };
                      let payload2 = {
                        track:
                          track !== null
                            ? track.id
                            : data.optional_place2
                            ? data.optional_place2.id
                            : '',
                        start_time: data.optional_date2,
                        status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`
                      };

                      let res = await updateRequest(
                        selectedOption === 1 ? payload1 : payload2,
                        requestId
                      );
                      if (res.status === 200) {
                        updateRequests();
                        swal('Solicitud actualizada!', {
                          icon: 'success'
                        });
                        // SEND EMAIL
                        const payload = {
                          id: requestId,
                          emailType: 'requestConfirmed',
                          subject: 'Servicio programado ✅',
                          email: userInfoContext.email,
                          name: userInfoContext.name,
                          instructor: instructor,
                          date:
                            selectedOption === 1
                              ? payload1.start_time
                              : payload2.start_time,
                          track:
                            track !== null
                              ? track
                              : selectedOption === 1
                              ? data.optional_place1
                              : data.optional_place2,
                          service: data.service.name
                        };
                        await sendEmail(payload); // SEND SERVICE CONFIRMED EMAIL TO USER
                        const payloadDrivers = {
                          id: requestId,
                          emailType: 'requestConfirmedDrivers',
                          subject: 'Prueba programada ✅',
                          email: allDrivers.map((driver) => driver.email),
                          name: userInfoContext.name,
                          instructor: instructor,
                          date:
                            selectedOption === 1
                              ? payload1.start_time
                              : payload2.start_time,
                          track:
                            track !== null
                              ? track
                              : selectedOption === 1
                              ? data.optional_place1
                              : data.optional_place2,
                          service: data.service.name
                        };
                        await sendEmail(payloadDrivers); // SEND SERVICE CONFIRMED EMAIL TO PARTIVIPANTS
                      } else {
                        swal('Oops, no se pudo actualizar el servicio.', {
                          icon: 'error'
                        });
                      }
                    }
                  });
                }}>
                Aceptar programación
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="ml-2"
                onClick={() => {
                  swal({
                    title: 'Rechazar programación',
                    text: `Estamos tristes de no poder cumplir con tus requerimientos. Si rechazas la programación la solicitud quedara cancelada. ¿Que deseas hacer?`,
                    icon: 'info',
                    buttons: ['Volver', 'Reachazar programación'],
                    dangerMode: true
                  }).then(async (willUpdate) => {
                    if (willUpdate) {
                      swal({
                        title: '¿Por qué cancelas?',
                        content: {
                          element: 'input',
                          attributes: {
                            placeholder: 'Escribe el motivo de la cancelación',
                            rows: '4',
                            cols: '50'
                          }
                        },
                        buttons: {
                          cancel: 'Volver',
                          confirm: 'Continuar'
                        }
                      }).then(async (msg) => {
                        if (msg !== null) {
                          // setLoading(true);

                          // let payload = {
                          //   id: requestId,
                          //   company: userInfoContext.company,
                          //   reject_msg: msg ? msg : "na",
                          //   refund_credits:
                          //     userInfoContext.credit + data.spent_credit,
                          // };

                          let payload = {
                            id: requestId,
                            user: userInfoContext,
                            companyId: userInfoContext.company.id,
                            reject_msg: msg
                              ? msg
                              : `Cancelado por el usuario ${
                                  penaltyRides
                                    ? `| Penalidad: $${penaltyRides} rides`
                                    : ''
                                }`,
                            newCredit:
                              parseInt(userInfoContext.credit) +
                              parseInt(data.spent_credit) // Removing penalty rides when rejecting a request
                          };
                          const res = await cancelRequestId(payload);
                          if (
                            res.canceled.status === 200 &&
                            res.refund.status === 200
                          ) {
                            setUserInfoContext({
                              ...userInfoContext,
                              credit: res.refund.data.credit
                            });
                            swal('Poof! Esta solicitud ha sido cancelada', {
                              icon: 'success'
                            });
                            setLoading(false);

                            const payload = {
                              id: res.canceled.data.id,
                              emailType: 'canceledRequest',
                              subject: 'Solicitud cancelada ❌',
                              email: userInfoContext.email,
                              name: userInfoContext.name,
                              date: res.canceled.data.start_time,
                              refund_credits: res.canceled.data.spent_credit,
                              service: res.canceled.data.service.name,
                              municipality: {
                                city: res.canceled.data.municipality.name,
                                department:
                                  res.canceled.data.municipality.department.name
                              }
                            };
                            await sendEmail(payload); // SEND SERVICE CANCELED EMAIL TO USER
                          } else {
                            setLoading(false);
                            swal('Ooops! No pudimos cancelar la solicitud', {
                              icon: 'error'
                            });
                          }
                        } else {
                          swal('Tranqui, no paso nada!');
                        }
                      });
                    }
                  });
                }}>
                Rechazar
              </Button>
            </div>
          )}
        </Tab>
      );
    }
  };

  const cancelationPriority = (priority) => {
    switch (priority) {
      case 0:
        return 5;
      case 1:
        return 7;
      default:
        return 9;
    }
  };

  const canBeCanceled = (date) => {
    let eventTime = new Date(date);
    let now = new Date();

    return now >= eventTime || data.status.step === 0 ? false : true;
  };

  if (loading) {
    return <Spinner animation="border" />;
  } else {
    return (
      <Row className="single-request-client">
        <div className="col-xl-9 col-md-8 col-12">
          <div className="card invoice-print-area">
            <div className="card-content">
              <div className="card-body pb-0 mx-25">
                <div className="row">
                  <div className="col-xl-4 col-md-12">
                    <span className="invoice-number mr-50">Solicitud#</span>
                    <span>{requestId}</span>
                  </div>
                  <div className="col-xl-8 col-md-12">
                    <div className="d-flex align-items-center justify-content-xl-end flex-wrap">
                      <div className="mr-3">
                        <small className="text-muted">
                          Fecha de creación:{' '}
                        </small>
                        <span>
                          {data?.created_at
                            ? dateFormatter(data.created_at)
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-6">
                    <h4 className="text-primary">Solicitud</h4>
                    <span>{data?.service?.name}</span>
                    <br />
                    <span>
                      {data?.municipality?.name}
                      {' - '}
                      {data?.municipality?.department?.name}
                    </span>
                  </div>
                  <div className="col-6 text-right pr-4 mt-4">
                    <span>
                      <strong>
                        Creditos{' '}
                        {data?.status.step === 0 ? 'reembolsados' : 'usados'}:
                      </strong>{' '}
                      ${data?.spent_credit}
                    </span>
                    <br />
                    {data && data.status.step > 2 ? (
                      <span>
                        <strong>Encargado Ridepro:</strong>{' '}
                        {instructor ? (
                          <span>{`${instructor.first_name} ${instructor.last_name}`}</span>
                        ) : (
                          'Cargando...'
                        )}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <hr />
                <div className="row invoice-info">
                  <div className="col-6 mt-1">
                    <h6 className="invoice-from">Detalle</h6>
                    <div className="mb-1">
                      <span>
                        Fecha:{' '}
                        {data?.start_time ? dateFormatter(data.start_time) : ''}{' '}
                        {data?.status.step < 3 ? (
                          <small>(Pendiente por confirmar)</small>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span>
                        Hora:{' '}
                        {data?.start_time ? formatAMPM(data.start_time) : ''}{' '}
                        {data?.status.step < 3 ? (
                          <small>(Pendiente por confirmar)</small>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span>Lugar: </span>
                      {data ? (
                        data.track ? (
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipTrack(data.track)}>
                            {data.track.latitude &&
                            data.track.latitude !== 'na' &&
                            data.track.longitude &&
                            data.track.longitude !== 'na' ? (
                              <a
                                className="m-0 p-0 track-link"
                                target="n_blank"
                                href={`https://www.google.com/maps/search/?api=1&query=${data.track.latitude},${data.track.longitude}`}>
                                {data.track.name} <FaExternalLinkAlt />
                              </a>
                            ) : (
                              <Button variant="link" className="m-0 p-0">
                                {data.track.name}
                              </Button>
                            )}
                          </OverlayTrigger>
                        ) : (
                          <small>Pista Ridepro (Pendiente)</small>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-6 mt-1">
                    <div className="comments">
                      <p>Observaciones:</p>
                      <div className="user-message">
                        <div className="avatar">
                          <img
                            src={data ? data.customer.picture : ''}
                            alt={
                              data
                                ? data.customer.first_name
                                : 'customer-picture'
                            }
                            width="32"
                            height="32"
                          />
                        </div>
                        <div className="d-inline-block mt-25">
                          <h6 className="mb-0 text-bold-500">
                            {data ? data.customer.first_name : ''}{' '}
                            {data ? data.customer.last_name : ''}
                          </h6>
                          <p className="text-muted mt-1">
                            <small>{data ? data.accept_msg : ''}</small>
                          </p>
                        </div>
                      </div>
                      {data && data.status.step === 0 ? (
                        <div className="user-message">
                          <div className="avatar">
                            <img
                              src={data ? data.customer.picture : ''}
                              alt={
                                data
                                  ? data.customer.first_name
                                  : 'customer-picture'
                              }
                              width="32"
                              height="32"
                            />
                          </div>
                          <div className="d-inline-block mt-25">
                            <h6 className="mb-0 text-bold-500">
                              {data ? data.customer.first_name : ''}{' '}
                              {data ? data.customer.last_name : ''}
                            </h6>
                            <p className="text-muted mt-1">
                              <small>{data ? data.reject_msg : ''}</small>
                            </p>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
                <hr />
              </div>
              <div className="invoice-product-details table-responsive mx-md-25">
                {data && (
                  <Tabs
                    activeKey={defaultTab}
                    onSelect={(k) => setDefaultTab(k)}
                    id="uncontrolled-tab-request"
                    className="uncontrolled-tab-request">
                    {/* {renderPlaceDateOptions(data ? data.track : "")} */}
                    {data && renderPlaceDateOptions(data.track)}

                    <Tab
                      eventKey="participants"
                      title={
                        <span>
                          <MdPeople /> Participantes
                        </span>
                      }
                      style={{ overflow: 'auto' }}>
                      {data?.status?.step === 1 &&
                      userInfoContext.profile === 2 &&
                      allDrivers ? (
                        <React.Fragment>
                          <EditableTable
                            size="sm"
                            dataSet={allDrivers}
                            fields={fields}
                            onValidate={handleNewDriversValidation}
                            onUpdate={handleAllDrivers}
                            readOnly={true}
                            readOnlyIf={isParticipantAlreadyRegistered}
                            recordsForReplacing={driversForReplacing}
                          />
                          {data?.status.step === 1 && (
                            <Button
                              variant="dark"
                              onClick={saveDrivers}
                              style={{ margin: 'auto' }}
                              {...(!canSaveDrivers
                                ? { disabled: 'true' }
                                : {})}>
                              Guardar
                            </Button>
                          )}
                        </React.Fragment>
                      ) : allDrivers && allDrivers.length > 0 ? (
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Documento</th>
                              <th>Nombre</th>
                              <th>Apellido</th>
                              <th>Email</th>
                              <th>Teléfono</th>
                              {data.status.step > 4 && (
                                <React.Fragment>
                                  <th className="text-white">Resultado</th>
                                  <th className="text-white">Link</th>
                                  <th className="text-white">Reporte</th>
                                </React.Fragment>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {allDrivers.length &&
                              allDrivers.map((driver, idx) => {
                                return (
                                  <SingleDriver
                                    data={driver}
                                    key={idx}
                                    requestId={requestId}
                                    status={data.status.step}
                                  />
                                );
                              })}
                          </tbody>
                        </Table>
                      ) : (
                        ''
                      )}
                    </Tab>

                    <Tab eventKey="options" title={<TiCogOutline />}>
                      <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey="first">
                        <Row className="mt-2">
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              <Nav.Item>
                                <Nav.Link eventKey="first">
                                  <TiCogOutline /> General
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="second">
                                  <MdHelpOutline /> Ayuda
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <Tab.Pane eventKey="first">
                                <Row>
                                  <Col md={12}>
                                    <p>
                                      Recuerda que puedes cancelar sin penalidad{' '}
                                      <strong>
                                        hasta{' '}
                                        {cancelationPriority(
                                          data.municipality.service_priority
                                        )}{' '}
                                        horas antes
                                      </strong>{' '}
                                      del evento. Ten en cuenta que estos
                                      valores pueden cambiar dependiendo del
                                      lugar de la solicitud.
                                      <br />
                                      <br />
                                      Luego de este plazo se te cargaran{' '}
                                      <strong>
                                        {data.service.penalty_rides} rides de
                                        penalidad
                                      </strong>{' '}
                                      por este servicio.
                                      <br />
                                    </p>
                                    {canBeCanceled(data.start_time) &&
                                    userInfoContext.profile === 2 ? (
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        // disabled={
                                        //   data.status.step !== 1 ? true : false
                                        // }
                                        onClick={() =>
                                          handleCancelEvent(penaltyRides)
                                        }>
                                        Cancelar solicitud
                                      </Button>
                                    ) : (
                                      ''
                                    )}
                                  </Col>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                <Row className="mt-2">
                                  <Col md={12}>
                                    <div className="row">
                                      <div className="col-12 text-center">
                                        <p className="p-2 text-muted">
                                          Si tienes unca solicitud, o no
                                          encuentras la respuesta a tus dudas,
                                          ponte en contacto con nosotos!
                                        </p>
                                      </div>
                                      <div className="fucki">
                                        <div className="help-icon border">
                                          <span className="text-muted ">
                                            <MdLocalPhone />
                                          </span>
                                          <h5>+ (319) 242 1712</h5>
                                          <p className="text-muted font-medium-1">
                                            {' '}
                                            Disponibles 24*7. Estaremos felices
                                            de ayudar
                                          </p>
                                        </div>
                                        <div className="help-icon border">
                                          <span className="text-muted">
                                            <FaEnvelope />
                                          </span>
                                          <h5>
                                            <a href="sdelrio@ridepro.co">
                                              sdelrio@ridepro.co
                                            </a>
                                          </h5>
                                          <p className="text-muted font-medium-1">
                                            La manera mas rapida de respuesta.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Tab>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-4 col-12">
          <div className="card invoice-action-wrapper shadow-none border">
            <div className="card-body">
              <div className="mt-2 mb-3">
                <ClientStatus step={data?.status?.step} />
              </div>
            </div>
          </div>
        </div>
        {showConfirmationModal && (
          <ServiceEditConfirmationModal
            show={true}
            setShow={(e) => setShowConfirmationModal(e)}
            request={data}
          />
        )}
        {showNotEnoughCreditsModal && notEnoughCreditsModal()}
      </Row>
    );
  }
};
export default SingleRequestClient;
