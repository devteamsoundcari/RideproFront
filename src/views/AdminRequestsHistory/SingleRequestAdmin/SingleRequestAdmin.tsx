import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Row, ProgressBar, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import swal from "sweetalert";
import { getRequest, updateRequest } from "../../../controllers/apiRequests";
import "./SingleRequestAdmin.scss";
import Drivers from "./Drivers/Drivers";
import Instructors from "./Instructors/Instructors";
import Providers from "./Providers/Providers";
import ModalInstructors from "./ModalInstructors/ModalInstructors";
import ModalProviders from "./ModalProviders/ModalProviders";
import ModalPlaceDate from "./ModalPlaceDate/ModalPlaceDate";
import PlaceDate from "./PlaceDate/PlaceDate";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestsContext } from "../../../contexts/RequestsContext";

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
  const { updateRequestsContext } = useContext(RequestsContext);

  useEffect(() => {
    async function fetchRequest(id: string) {
      setLoading(true);
      const responseRequest = await getRequest(id);
      setLoading(false);
      setData(responseRequest);
      console.log(responseRequest);
    }
    fetchRequest(requestId);
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
    switch (data?.status?.step) {
      case 0:
        return (
          <div className="text-center">
            <small>Evento cancelado</small>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <small>Esperando confirmación</small>
            <ProgressBar
              variant={"event-requested" as any}
              now={20}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <small>Esperando confirmación cliente</small>
            <ProgressBar
              variant={"confirm-event" as any}
              now={40}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <small>Programación aceptada</small>
            <ProgressBar
              variant={"event-confirmed" as any}
              now={40}
              label={`${60}%`}
              srOnly
            />
          </div>
        );
      default:
        return <p>Undefined</p>;
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
      <section className="single-request-admin">
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
                    <div className="col-6 mt-1">
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
                    <div className="col-6 mt-1">
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
                <div className="mx-md-25 text-center">
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
                <div className="mx-md-25 text-center">
                  <h6>Proveedores ({data?.providers.length})</h6>
                  {data?.providers.length > 0 ? (
                    <Providers
                      requestId={parseInt(requestId)}
                      providers={(data: any) => setProviders(data)}
                    />
                  ) : (
                    <span>Esta solicitud no tiene Proveedores</span>
                  )}
                </div>
                <hr />
                <div className="mx-md-25 text-center">
                  <h6>Participantes ({data?.drivers.length})</h6>
                  <Drivers drivers={data?.drivers} />
                </div>
                <hr />
                <div className="card-body pt-0 mx-25">
                  <Row>
                    <div className="col-4 col-sm-6 mt-75">
                      <p>Thanks for your business.</p>
                    </div>
                    <div className="col-8 col-sm-6 d-flex justify-content-end mt-75">
                      <div className="invoice-subtotal">
                        <div className="invoice-calc d-flex justify-content-between">
                          <span className="invoice-title">Subtotal</span>
                          <span className="invoice-value">$ 76.00</span>
                        </div>
                        <div className="invoice-calc d-flex justify-content-between">
                          <span className="invoice-title">Discount</span>
                          <span className="invoice-value">- $ 09.60</span>
                        </div>
                        <div className="invoice-calc d-flex justify-content-between">
                          <span className="invoice-title">Tax</span>
                          <span className="invoice-value">21%</span>
                        </div>
                        <hr />
                        <div className="invoice-calc d-flex justify-content-between">
                          <span className="invoice-title">Invoice Total</span>
                          <span className="invoice-value">$ 66.40</span>
                        </div>
                        <div className="invoice-calc d-flex justify-content-between">
                          <span className="invoice-title">Paid to date</span>
                          <span className="invoice-value">- $ 00.00</span>
                        </div>
                        <div className="invoice-calc d-flex justify-content-between">
                          <span className="invoice-title">Balance (USD)</span>
                          <span className="invoice-value">$ 10,953</span>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>
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
            <div className="card invoice-action-wrapper shadow-none border">
              <div className="card-body">
                <div className="invoice-action-btn">
                  <Button
                    variant="light"
                    className="btn-block"
                    onClick={() => setShowModalPlace(true)}
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
                      propsInstructors={instructors}
                    />
                  )}
                </div>
                <div className="invoice-action-btn">
                  <Button
                    variant="light"
                    className="btn-block"
                    onClick={() => setShowModalProviders(true)}
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
                            updateRequestsContext();
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
          </div>
        </Row>
      </section>
    );
  }
};

export default SingleRequestAdmin;
