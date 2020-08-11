import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Row, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import swal from "sweetalert";
import {
  getRequest,
  updateRequest,
  sendEmail,
} from "../../../controllers/apiRequests";
import "./SingleRequestAdmin.scss";
import Drivers from "./Drivers/Drivers";
import Instructors from "./Instructors/Instructors";
import Providers from "./Providers/Providers";
import ModalInstructors from "./ModalInstructors/ModalInstructors";
import ModalProviders from "./ModalProviders/ModalProviders";
import ModalPlaceDate from "./ModalPlaceDate/ModalPlaceDate";
import PlaceDate from "./PlaceDate/PlaceDate";
import { AuthContext } from "../../../contexts/AuthContext";
import ConfirmSection from "./ConfirmSection/ConfirmSection";
import Documents from "./Documents/Documents";
import ModalOC from "./ModalOC/ModalOC";
import OperacionesStatus from "../../../utils/OperacionesStatus";
import TecnicoStatus from "../../../utils/TecnicoStatus";
import ModalUploadReports from "./ModalUploadReports/ModalUploadReports";

interface Service {
  name: string;
}

interface Company {
  logo: string;
  name: string;
  nit: string;
  arl: string;
  phone: string;
  address: string;
}

interface Customer {
  company?: Company;
  first_name: string;
  last_name: string;
  charge: string;
  email: string;
  picture: string;
}

interface Department {
  name: string;
}

interface Municipality {
  name: string;
  department: Department;
}

interface Status {
  name: string;
  profile_action: number;
  step: number;
}

interface RequestData {
  created_at: string;
  start_time: string;
  service?: Service;
  customer?: Customer;
  municipality?: Municipality;
  track: any;
  status?: Status;
  drivers: any;
  instructors: any;
  providers: any;
  optional_date1: any;
  optional_place1: any;
  optional_date2: any;
  optional_place2: any;
  operator: any;
  fare_track: any;
  f_p_track: any;
  accept_msg: string;
  reject_msg: string;
}

type Instructors = any[];
type Providers = any[];

const SingleRequestAdmin = () => {
  let { requestId } = useParams();
  const [data, setData] = useState<RequestData>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [showModalInstructors, setShowModalInstructors] = useState(false);
  const [showModalProviders, setShowModalProviders] = useState(false);
  const [showModalPlace, setShowModalPlace] = useState(false);
  const [instructors, setInstructors] = useState<Instructors>([]);
  const [providers, setProviders] = useState<Providers>([]);
  const { userInfoContext } = useContext(AuthContext);
  const [documentsOk, setDocumentsOk] = useState(false);
  const [showModalOC, setShowModalOC] = useState(false);
  const [showModalUploadReports, setShowModalUploadReports] = useState(false);

  async function fetchRequest(id: string) {
    setLoading(true);
    const responseRequest = await getRequest(id);
    setLoading(false);
    setData(responseRequest);
  }

  useEffect(() => {
    fetchRequest(requestId);
    // eslint-disable-next-line
  }, []);
  // ============ Listening Socket==================
  useEffect(() => {
    let token = localStorage.getItem("token");
    let requestsSocket = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
    );
    requestsSocket.addEventListener("open", () => {
      let payload = {
        action: "subscribe_to_requests",
        request_id: userInfoContext.id,
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

  const renderStatus = () => {
    if (userInfoContext.profile === 3) {
      return <OperacionesStatus step={data?.status?.step} />;
    } else {
      return <TecnicoStatus step={data?.status?.step} />;
    }
  };

  const checkDisabled = () => {
    if (
      data?.instructors.length > 0 &&
      data?.providers.length > 0 &&
      data?.optional_date1
    ) {
      if (data?.status?.step === 1) {
        return false;
      } else return true;
    } else return true;
  };

  if (loading) {
    return <Spinner animation="border" />;
  } else {
    return (
      <section className="single-request-admin mb-3">
        <Row>
          <div className="col-xl-9 col-md-8 col-12">
            <div className="card invoice-print-area">
              <div className="card-content">
                <div className="card-body pb-0 mx-25">
                  <Row>
                    <div className="col-xl-4 col-md-12">
                      <span className="invoice-number mr-50">Solicitud#</span>
                      <span>{requestId}</span>
                    </div>
                    <div className="col-xl-8 col-md-12">
                      <div className="d-flex align-items-center justify-content-xl-end flex-wrap">
                        <div className="mr-3">
                          <small className="text-muted">
                            Fecha de creación:{" "}
                          </small>
                          <span>
                            {data?.created_at
                              ? dateFormatter(data.created_at)
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="row my-3">
                    <div className="col-6">
                      <h4 className="text-primary">Solicitud</h4>
                      <span>{data?.service?.name}</span>
                      <br />
                      <span>
                        {data?.start_time ? dateFormatter(data.start_time) : ""}
                      </span>
                      <br />
                      <span>
                        {data?.start_time ? formatAMPM(data.start_time) : ""}
                      </span>
                      <br />
                      <span>
                        {data?.municipality?.name}{" "}
                        {data?.municipality?.department?.name}
                      </span>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                      <img
                        src={data?.customer?.company?.logo}
                        alt="logo"
                        height="80"
                        width="80"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row invoice-info">
                    <div className="col-4 mt-1">
                      <h6 className="invoice-from">Solicitado por</h6>
                      <div className="mb-1">
                        <span>
                          {data?.customer?.first_name}{" "}
                          {data?.customer?.last_name}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span>{data?.customer?.email}</span>
                      </div>
                      <div className="mb-1">
                        <span>{data?.customer?.charge}</span>
                      </div>
                      <div className="mb-1">
                        <span>601-678-8022</span>
                      </div>
                    </div>
                    <div className="col-4 mt-1">
                      <h6 className="invoice-to">Empresa</h6>
                      <div className="mb-1">
                        <span>{data?.customer?.company?.name}</span>
                      </div>
                      <div className="mb-1">
                        <span>{data?.customer?.company?.nit}</span>
                      </div>
                      <div className="mb-1">
                        <span>{data?.customer?.company?.arl}</span>
                      </div>
                      <div className="mb-1">
                        <span>{data?.customer?.company?.address}</span>
                      </div>
                      <div className="mb-1">
                        <span>{data?.customer?.company?.phone}</span>
                      </div>
                    </div>
                    <div className="col-4 mt-1">
                      <h6 className="invoice-to">Observaciones</h6>
                      <div className="comments">
                        <div className="user-message">
                          <div className="avatar">
                            <img
                              src={data?.customer?.picture}
                              alt={data?.customer?.first_name}
                              width="32"
                              height="32"
                            />
                          </div>
                          <div className="d-inline-block mt-25">
                            <h6 className="mb-0 text-bold-500">
                              {data?.customer?.first_name}{" "}
                              {data?.customer?.last_name}
                            </h6>
                            <p className="text-muted mt-1">
                              <small>{data?.accept_msg}</small>
                            </p>
                          </div>
                        </div>
                        {data?.status?.step === 0 ? (
                          <div className="user-message">
                            <div className="avatar">
                              <img
                                src={data?.customer?.picture}
                                alt={data?.customer?.first_name}
                                width="32"
                                height="32"
                              />
                            </div>
                            <div className="d-inline-block mt-25">
                              <h6 className="mb-0 text-bold-500">
                                {data?.customer?.first_name}{" "}
                                {data?.customer?.last_name}
                              </h6>
                              <p className="text-muted mt-1">
                                <small>{data?.reject_msg}</small>
                              </p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <PlaceDate
                    municipality={data?.municipality}
                    track={data?.track}
                    date={data?.start_time}
                    title=""
                  />
                  {/* {data?.optional_date1 && data?.optional_place1 ? (
                    <React.Fragment>
                      <hr />
                      <PlaceDate
                        municipality={data?.municipality}
                        track={data?.optional_place1}
                        date={data?.optional_date1}
                        title="Opción 1"
                      />
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                  {data?.optional_date2 && data?.optional_place2 ? (
                    <React.Fragment>
                      <hr />
                      <PlaceDate
                        municipality={data?.municipality}
                        track={data?.optional_place2}
                        date={data?.optional_date2}
                        title="Opción 2"
                      />
                    </React.Fragment>
                  ) : (
                    ""
                  )} */}
                </div>
                <hr />
                <div className="mx-md-25 text-center pl-3 pr-3">
                  <h6>Instructores ({data?.instructors.length})</h6>
                  {data?.instructors.length > 0 ? (
                    <Instructors
                      requestId={parseInt(requestId)}
                      instructors={(data: any) => setInstructors(data)}
                    />
                  ) : (
                    <span>Esta solicitud no tiene instructores</span>
                  )}
                </div>
                <hr />
                <div className="mx-md-25 text-center pl-3 pr-3">
                  <h6>Proveedores ({data?.providers.length})</h6>
                  {data?.providers.length > 0 ? (
                    <Providers
                      requestId={parseInt(requestId)}
                      providers={(data: any) => setProviders(data)}
                    />
                  ) : (
                    <span>Esta solicitud no tiene proveedores</span>
                  )}
                </div>
                <hr />
                <div className="mx-md-25 text-center pl-3 pr-3">
                  <h6>Participantes ({data?.drivers.length})</h6>
                  <Drivers
                    drivers={data?.drivers}
                    status={data?.status?.step}
                    requestId={requestId}
                  />
                </div>
                {data?.status?.step ? (
                  data?.status?.step > 3 ? (
                    <React.Fragment>
                      <hr />
                      <Documents
                        requestId={requestId}
                        documentsOk={(data) => setDocumentsOk(data)}
                      />
                    </React.Fragment>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-md-4 col-12"
            style={{
              position: "fixed",
              right: "1rem",
              maxWidth: "17rem",
            }}
          >
            <div className="mt-2 mb-3">{renderStatus()}</div>
            {userInfoContext.profile === 3 && (
              <React.Fragment>
                <div className="card invoice-action-wrapper shadow-none border">
                  <div className="card-body">
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        onClick={() => setShowModalPlace(true)}
                        disabled={
                          data?.status?.step
                            ? data?.status?.step >= 3
                              ? true
                              : false
                            : false
                        }
                      >
                        <span>Lugar / Fecha / Hora </span>
                        {data?.optional_date1 ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </Button>

                      {showModalPlace && (
                        <ModalPlaceDate
                          requestId={requestId}
                          handleClose={() => setShowModalPlace(false)}
                          propsTrack={data?.track}
                          propsDate={data?.start_time}
                          propsCity={data?.municipality}
                          propsOptDate1={data?.optional_date1}
                          propsOptPlace1={data?.optional_place1}
                          propsOptDate2={data?.optional_date2}
                          propsOptPlace2={data?.optional_place2}
                          operator={data?.operator}
                        />
                      )}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        onClick={() => setShowModalInstructors(true)}
                        disabled={
                          data?.status?.step
                            ? data?.status?.step >= 3
                              ? true
                              : false
                            : false
                        }
                      >
                        <span>Instructores </span>
                        {data?.instructors.length > 0 ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </Button>

                      {showModalInstructors && (
                        <ModalInstructors
                          requestId={requestId}
                          handleClose={() => setShowModalInstructors(false)}
                          onUpdate={() => fetchRequest(requestId)}
                          propsInstructors={instructors}
                        />
                      )}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        onClick={() => setShowModalProviders(true)}
                        disabled={
                          data?.status?.step
                            ? data?.status?.step >= 3
                              ? true
                              : false
                            : false
                        }
                      >
                        <span>Proveedores </span>
                        {data?.providers.length > 0 ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </Button>

                      {showModalProviders && (
                        <ModalProviders
                          requestId={requestId}
                          handleClose={() => setShowModalProviders(false)}
                          onUpdate={() => fetchRequest(requestId)}
                          propsProviders={providers}
                        />
                      )}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        className="btn-block btn-success"
                        disabled={checkDisabled()}
                        onClick={() => {
                          swal({
                            title: "¿Estas seguro?",
                            text:
                              "Une vez confirmes el servicio el cliente recibira una notificación y el servicio no podra ser modificado!",
                            icon: "warning",
                            buttons: ["No, volver", "Si, confirmar servicio"],
                            dangerMode: true,
                          }).then(async (willUpdate) => {
                            if (willUpdate) {
                              let payload = {
                                new_request: 0, // It wont be a new request anymore
                                operator: userInfoContext.id,
                                status: `${process.env.REACT_APP_STATUS_CONFIRMATION_CLIENT_PROCESS}`,
                              };

                              let res = await updateRequest(payload, requestId);
                              if (res.status === 200) {
                                // setDisabled(true);
                                swal("Solicitud actualizada!", {
                                  icon: "success",
                                });
                                // SEND EMAIL
                                const payload = {
                                  id: requestId,
                                  emailType: "requestOptions",
                                  subject: "Confirmar solicitud ⚠️",
                                  email: data?.customer?.email,
                                  name: data?.customer?.first_name,
                                  optional_place1: data?.optional_place1,
                                  optional_place2: data?.optional_place2,
                                  optional_date1: data?.optional_date1,
                                  optional_date2: data?.optional_date2,
                                  service: data?.service,
                                };
                                await sendEmail(payload); // SEND SERVICE OPTIONS EMAIL TO USER
                              } else {
                                swal(
                                  "Oops, no se pudo actualizar el servicio.",
                                  {
                                    icon: "error",
                                  }
                                );
                              }
                            }
                          });
                        }}
                      >
                        <span>
                          {data?.status?.step === 1
                            ? "Confirmar solicitud"
                            : data?.status?.step === 2
                            ? "Esperando cliente"
                            : data?.status?.step === 3
                            ? "Servicio confirmado"
                            : "Cancelado"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                {data?.status?.step
                  ? data?.status?.step > 2 && (
                      <ConfirmSection
                        instructors={instructors}
                        providers={providers}
                        track={data?.track}
                        fare_track={data?.fare_track}
                        fisrt_payment={data?.f_p_track}
                        requestId={requestId}
                        status={data?.status}
                      />
                    )
                  : ""}

                {data?.status?.step
                  ? data?.status?.step > 3 && (
                      <div className="card invoice-action-wrapper mt-2 shadow-none border">
                        <div className="card-body">
                          <div className="invoice-action-btn">
                            <Button
                              className="btn-block btn-success"
                              disabled={
                                documentsOk && data?.status?.step < 6
                                  ? false
                                  : true
                              }
                              onClick={() => setShowModalOC(true)}
                            >
                              <span>Enviar OC</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  : ""}

                {showModalOC && (
                  <ModalOC
                    handleClose={() => setShowModalOC(false)}
                    instructors={instructors}
                    providers={providers}
                    date={data?.start_time}
                    track={data?.track}
                    fare_track={data?.fare_track}
                    fisrt_payment={data?.f_p_track}
                    requestId={requestId}
                    status={data?.status}
                    service={data?.service}
                  />
                )}
              </React.Fragment>
            )}
            {userInfoContext.profile === 5 &&
            data?.status?.step &&
            data?.status?.step > 3 ? (
              <React.Fragment>
                <div className="card invoice-action-wrapper mt-2 shadow-none border">
                  <div className="card-body">
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        disabled={data?.status?.step > 4 ? true : false}
                        onClick={() => setShowModalUploadReports(true)}
                      >
                        <span>Generar Informes </span>
                      </Button>
                      {showModalUploadReports && (
                        <ModalUploadReports
                          drivers={data?.drivers}
                          handleClose={() => setShowModalUploadReports(false)}
                          requestId={requestId}
                        />
                      )}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        className="btn-block btn-success"
                        disabled={data?.status?.step > 4 ? true : false}
                        onClick={() => {
                          swal({
                            title: "¿Estas seguro?",
                            text:
                              "Une vez confirmes el servicio el cliente recibira una notificación y el servicio no podra ser modificado!",
                            icon: "warning",
                            buttons: ["No, volver", "Si, confirmar servicio"],
                            dangerMode: true,
                          }).then(async (willUpdate) => {
                            if (willUpdate) {
                              let payload = {
                                new_request: 0, // It wont be a new request anymore
                                operator: userInfoContext.id,
                                status: `${process.env.REACT_APP_STATUS_STEP_5}`,
                              };

                              let res = await updateRequest(payload, requestId);
                              if (res.status === 200) {
                                // setDisabled(true);
                                swal("Solicitud actualizada!", {
                                  icon: "success",
                                });
                                // SEND EMAIL
                                // const payload = {
                                //   id: requestId,
                                //   emailType: "requestOptions",
                                //   subject: "Ev solicitud ⚠️",
                                //   email: data?.customer?.email,
                                //   name: data?.customer?.first_name,
                                //   optional_place1: data?.optional_place1,
                                //   optional_place2: data?.optional_place2,
                                //   optional_date1: data?.optional_date1,
                                //   optional_date2: data?.optional_date2,
                                //   service: data?.service,
                                // };
                                // await sendEmail(payload); // SEND SERVICE OPTIONS EMAIL TO USER
                              }
                            }
                          });
                        }}
                      >
                        <span>Confirmar Finalizado</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </Row>
      </section>
    );
  }
};

export default SingleRequestAdmin;
