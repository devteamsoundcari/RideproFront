import React, { useEffect, useState, useContext } from 'react';
import swal from 'sweetalert';
import { AuthContext, RequestsContext } from '../../contexts';
import { useParams } from 'react-router-dom';
import { Row, Button, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { updateRequest, sendEmail } from '../../controllers/apiRequests';
import DriversSection from './DriversSection/DriversSection';
import InstructorsSection from './InstructorsSection/InstructorsSection';
import ProvidersSection from './ProvidersSection/ProvidersSection';
// import ModalInstructors from './ModalInstructors/ModalInstructors';
// import ModalProviders from './ModalProviders/ModalProviders';
// import ModalPlaceDate from './ModalPlaceDate/ModalPlaceDate';
import PlaceDateSection from './PlaceDateSection/PlaceDateSection';
// import ConfirmSection from './ConfirmSection/ConfirmSection';
import DocumentsSection from './DocumentsSection/DocumentsSection';
// import ModalOC from './ModalOC/ModalOC';
// import ModalUploadReports from './ModalUploadReports/ModalUploadReports';
// import ModalInvoice from './ModalInvoice/ModalInvoice';
// import Invoice from './Invoice/Invoice';
import { allStatus } from '../../allStatus';
import { StatusRenderer } from '../../components/atoms';
import {
  dateAMPM,
  dateDDMMYYY,
  PERFIL_ADMIN,
  PERFIL_OPERACIONES,
  PERFIL_TECNICO
} from '../../utils';
import './AdminRequestId.scss';

export const AdminRequestId = () => {
  const { requestId } = useParams() as any;
  const { getSingleRequest, currentRequest, isLoadingRequests } =
    useContext(RequestsContext);
  const [loading, setLoading] = useState<Boolean>(false);
  const [showModalInstructors, setShowModalInstructors] = useState(false);
  const [showModalProviders, setShowModalProviders] = useState(false);
  const [showModalPlace, setShowModalPlace] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [documentsOk, setDocumentsOk] = useState(false);
  const [showModalOC, setShowModalOC] = useState(false);
  const [showModalUploadReports, setShowModalUploadReports] = useState(false);
  const [participantsInfo, setParticipantsInfo] = useState([]);
  const [allReportsOk, setAllReportsOk] = useState(false);
  const [showModalInvoice, setShowModalInvoice] = useState(false);

  const fetchRequest = async (id: string) => {
    try {
      await getSingleRequest(id);
    } catch (error) {
      throw new Error('Error getting the request');
    }
  };

  useEffect(() => {
    fetchRequest(requestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  // STATUS FORMATTER
  const statusFormatter = (statusStep) => {
    const foundProfile = allStatus.find(
      (user) => user.profile.profile === userInfo.profile
    );
    const foundStep = foundProfile?.steps.find(
      ({ step }) => step === statusStep
    );
    return <StatusRenderer step={foundStep} />;
  };

  // ============ Listening Socket==================
  useEffect(() => {
    let token = localStorage.getItem('token');
    let requestsSocket = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
    );
    requestsSocket.addEventListener('open', () => {
      let payload = {
        action: 'subscribe_to_requests',
        request_id: userInfo.id
      };
      requestsSocket.send(JSON.stringify(payload));
    });
    requestsSocket.onmessage = async function (event) {
      let data = JSON.parse(event.data);
      if (data?.data?.id === parseInt(requestId)) {
        fetchRequest(data.data.id);
      }
    };
    // eslint-disable-next-line
  }, []);

  const checkDisabled = () => {
    if (
      currentRequest?.instructors.length > 0 &&
      currentRequest?.providers.length > 0 &&
      currentRequest?.optional_date1
    ) {
      if (currentRequest?.status?.step === 1) {
        return false;
      } else return true;
    } else return true;
  };

  if (isLoadingRequests) {
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
                      <span className="invoice-number mr-50">Solicitud #</span>
                      <span>{requestId}</span>
                    </div>
                    <div className="col-xl-8 col-md-12">
                      <div className="d-flex align-items-center justify-content-xl-end flex-wrap">
                        <div className="mr-3">
                          <small className="text-muted">
                            Fecha de creación:{' '}
                          </small>
                          <span>
                            {currentRequest?.created_at &&
                              dateDDMMYYY(currentRequest?.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <div className="row my-3">
                    <div className="col-6">
                      <h4 className="text-primary">Solicitud</h4>
                      <span>{currentRequest?.service?.name}</span>
                      <br />
                      <span>
                        {currentRequest?.start_time &&
                          dateDDMMYYY(currentRequest?.start_time)}
                      </span>
                      <br />
                      <span>
                        {currentRequest?.start_time &&
                          dateAMPM(currentRequest?.start_time)}
                      </span>
                      <br />
                      <span>
                        {currentRequest?.municipality?.name}{' '}
                        {currentRequest?.municipality?.department?.name}
                      </span>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                      <img
                        src={currentRequest?.customer?.company?.logo}
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
                          {currentRequest?.customer?.first_name}{' '}
                          {currentRequest?.customer?.last_name}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span>{currentRequest?.customer?.email}</span>
                      </div>
                      <div className="mb-1">
                        <span>{currentRequest?.customer?.charge}</span>
                      </div>
                      <div className="mb-1">
                        <span>601-678-8022</span>
                      </div>
                    </div>
                    <div className="col-4 mt-1">
                      <h6 className="invoice-to">Empresa</h6>
                      <div className="mb-1">
                        <span>{currentRequest?.customer?.company?.name}</span>
                      </div>
                      <div className="mb-1">
                        <span>{currentRequest?.customer?.company?.nit}</span>
                      </div>
                      <div className="mb-1">
                        <span>{currentRequest?.customer?.company?.arl}</span>
                      </div>
                      <div className="mb-1">
                        <span>
                          {currentRequest?.customer?.company?.address}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span>{currentRequest?.customer?.company?.phone}</span>
                      </div>
                    </div>
                    <div className="col-4 mt-1">
                      <h6 className="invoice-to">Observaciones</h6>
                      <div className="comments">
                        <div className="user-message">
                          <div className="avatar">
                            <img
                              src={currentRequest?.customer?.picture}
                              alt={currentRequest?.customer?.first_name}
                              width="32"
                              height="32"
                            />
                          </div>
                          <div className="d-inline-block mt-25">
                            <h6 className="mb-0 text-bold-500">
                              {currentRequest?.customer?.first_name}{' '}
                              {currentRequest?.customer?.last_name}
                            </h6>
                            <p className="text-muted mt-1">
                              <small>{currentRequest?.accept_msg}</small>
                            </p>
                          </div>
                        </div>
                        {currentRequest?.status?.step === 0 && (
                          <div className="user-message">
                            <div className="avatar">
                              <img
                                src={currentRequest?.customer?.picture}
                                alt={currentRequest?.customer?.first_name}
                                width="32"
                                height="32"
                              />
                            </div>
                            <div className="d-inline-block mt-25">
                              <h6 className="mb-0 text-bold-500">
                                {currentRequest?.customer?.first_name}{' '}
                                {currentRequest?.customer?.last_name}
                              </h6>
                              <p className="text-muted mt-1">
                                <small>{currentRequest?.reject_msg}</small>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <PlaceDateSection
                    municipality={currentRequest?.municipality}
                    track={currentRequest?.track}
                    date={currentRequest?.start_time}
                    title=""
                  />
                </div>
                <hr />
                <div className="mx-md-25 text-center pl-3 pr-3 overflow-auto">
                  <h6>Instructores ({currentRequest?.instructors.length})</h6>
                  {currentRequest?.instructors.length > 0 ? (
                    <InstructorsSection requestId={parseInt(requestId)} />
                  ) : (
                    <span>Esta solicitud no tiene instructores</span>
                  )}
                </div>
                <hr />
                <div className="mx-md-25 text-center pl-3 pr-3 overflow-auto">
                  <h6>Proveedores ({currentRequest?.providers.length})</h6>
                  {currentRequest?.providers.length > 0 ? (
                    <ProvidersSection requestId={parseInt(requestId)} />
                  ) : (
                    <span>Esta solicitud no tiene proveedores</span>
                  )}
                </div>
                <hr />
                <div className="mx-md-25 text-center pl-3 pr-3 overflow-auto">
                  <h6>Participantes ({currentRequest?.drivers.length})</h6>
                  <DriversSection
                    drivers={currentRequest?.drivers}
                    status={currentRequest?.status?.step}
                    requestId={requestId}
                    onUpdate={(data) => setParticipantsInfo(data)}
                  />
                </div>
                {currentRequest?.status.step && currentRequest.status.step > 3 && (
                  <>
                    <hr />
                    <DocumentsSection
                      requestId={requestId}
                      setDocumentsOk={(data) => setDocumentsOk(data)}
                    />
                  </>
                )}

                {userInfo.profile === PERFIL_ADMIN.profile &&
                  currentRequest?.status?.step &&
                  currentRequest?.status?.step > 6 && (
                    <React.Fragment>
                      <hr />
                      {/* <Invoice data={data} /> */}
                    </React.Fragment>
                  )}
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-md-4 col-12"
            style={{
              position: 'fixed',
              right: '1rem',
              maxWidth: '17rem'
            }}>
            <div className="mt-2 mb-3">
              {statusFormatter(currentRequest?.status?.step)}
            </div>
            {userInfo.profile === PERFIL_OPERACIONES.profile && (
              <React.Fragment>
                <div className="card invoice-action-wrapper shadow-none border">
                  <div className="card-body">
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        onClick={() => setShowModalPlace(true)}
                        disabled={
                          currentRequest?.status?.step
                            ? currentRequest?.status?.step >= 3
                              ? true
                              : false
                            : false
                        }>
                        <span>Lugar / Fecha / Hora </span>
                        {currentRequest?.optional_date1 ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </Button>

                      {/* {showModalPlace && (
                        <ModalPlaceDate
                          requestId={requestId}
                          handleClose={() => setShowModalPlace(false)}
                          propsTrack={currentRequest?.track}
                          propsDate={currentRequest?.start_time}
                          propsCity={currentRequest?.municipality}
                          propsOptDate1={currentRequest?.optional_date1}
                          propsOptPlace1={currentRequest?.optional_place1}
                          propsOptDate2={currentRequest?.optional_date2}
                          propsOptPlace2={currentRequest?.optional_place2}
                          operator={currentRequest?.operator}
                        />
                      )} */}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        onClick={() => setShowModalInstructors(true)}
                        disabled={
                          currentRequest?.status?.step
                            ? currentRequest?.status?.step >= 3
                              ? true
                              : false
                            : false
                        }>
                        <span>Instructores </span>
                        {currentRequest?.instructors.length > 0 ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </Button>

                      {/* {showModalInstructors && (
                        <ModalInstructors
                          requestId={requestId}
                          handleClose={() => setShowModalInstructors(false)}
                          onUpdate={() => fetchRequest(requestId)}
                          propsInstructors={instructors}
                        />
                      )} */}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        onClick={() => setShowModalProviders(true)}
                        disabled={
                          currentRequest?.status?.step
                            ? currentRequest?.status?.step >= 3
                              ? true
                              : false
                            : false
                        }>
                        <span>Proveedores </span>
                        {currentRequest?.providers.length > 0 ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </Button>

                      {/* {showModalProviders && (
                        <ModalProviders
                          requestId={requestId}
                          handleClose={() => setShowModalProviders(false)}
                          onUpdate={() => fetchRequest(requestId)}
                          propsProviders={providers}
                        />
                      )} */}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        className="btn-block btn-success"
                        disabled={checkDisabled()}
                        onClick={() => {
                          swal({
                            title: '¿Estas seguro?',
                            text: 'Une vez confirmes el servicio el cliente recibira una notificación y el servicio no podra ser modificado!',
                            icon: 'warning',
                            buttons: ['No, volver', 'Si, confirmar servicio'],
                            dangerMode: true
                          }).then(async (willUpdate) => {
                            if (willUpdate) {
                              let payload = {
                                new_request: 0, // It wont be a new request anymore
                                operator: userInfo.id,
                                status: `${process.env.REACT_APP_STATUS_CONFIRMATION_CLIENT_PROCESS}`
                              };

                              let res = await updateRequest(payload, requestId);
                              if (res.status === 200) {
                                // setDisabled(true);
                                swal('Solicitud actualizada!', {
                                  icon: 'success'
                                });
                                // SEND EMAIL
                                const payload = {
                                  id: requestId,
                                  emailType: 'requestOptions',
                                  subject: 'Confirmar solicitud ⚠️',
                                  email: currentRequest?.customer?.email,
                                  name: currentRequest?.customer?.first_name,
                                  optional_place1:
                                    currentRequest?.optional_place1,
                                  optional_place2:
                                    currentRequest?.optional_place2,
                                  optional_date1:
                                    currentRequest?.optional_date1,
                                  optional_date2:
                                    currentRequest?.optional_date2,
                                  service: currentRequest?.service
                                };
                                await sendEmail(payload); // SEND SERVICE OPTIONS EMAIL TO USER
                              } else {
                                swal(
                                  'Oops, no se pudo actualizar el servicio.',
                                  {
                                    icon: 'error'
                                  }
                                );
                              }
                            }
                          });
                        }}>
                        <span>
                          {currentRequest?.status?.step === 1
                            ? 'Confirmar solicitud'
                            : currentRequest?.status?.step === 2
                            ? 'Esperando cliente'
                            : currentRequest?.status?.step === 3
                            ? 'Servicio confirmado'
                            : 'Cancelado'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                {/* {currentRequest?.status?.step
                  ? currentRequest?.status?.step > 2 && (
                      <ConfirmSection
                        instructors={instructors}
                        providers={providers}
                        track={currentRequest?.track}
                        fare_track={currentRequest?.fare_track}
                        fisrt_payment={currentRequest?.f_p_track}
                        requestId={requestId}
                        status={currentRequest?.status}
                        date={currentRequest?.start_time}
                        participants={participantsInfo}
                        service={currentRequest?.service}
                      />
                    )
                  : ''} */}

                {currentRequest?.status?.step
                  ? currentRequest?.status?.step > 3 && (
                      <div className="card invoice-action-wrapper mt-2 shadow-none border">
                        <div className="card-body">
                          <div className="invoice-action-btn">
                            <Button
                              className="btn-block btn-success"
                              disabled={
                                documentsOk &&
                                currentRequest?.status?.step < 6 &&
                                allReportsOk
                                  ? false
                                  : true
                              }
                              onClick={() => setShowModalOC(true)}>
                              <span>Enviar OC</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  : ''}

                {/* {showModalOC && (
                  <ModalOC
                    handleClose={() => setShowModalOC(false)}
                    instructors={instructors}
                    providers={providers}
                    date={currentRequest?.start_time}
                    track={currentRequest?.track}
                    fare_track={currentRequest?.fare_track}
                    fisrt_payment={currentRequest?.f_p_track}
                    requestId={requestId}
                    status={currentRequest?.status}
                    service={currentRequest?.service}
                  />
                )} */}
              </React.Fragment>
            )}
            {userInfo.profile === PERFIL_TECNICO.profile &&
            currentRequest?.status?.step &&
            currentRequest?.status?.step > 3 ? (
              <React.Fragment>
                <div className="card invoice-action-wrapper mt-2 shadow-none border">
                  <div className="card-body">
                    <div className="invoice-action-btn">
                      <Button
                        variant="light"
                        className="btn-block"
                        disabled={
                          currentRequest?.status?.step < 4 ? true : false
                        }
                        onClick={() => setShowModalUploadReports(true)}>
                        <span>Generar Informes </span>
                      </Button>
                      {/* {showModalUploadReports && (
                        <ModalUploadReports
                          drivers={currentRequest?.drivers}
                          handleClose={() => setShowModalUploadReports(false)}
                          requestId={requestId}
                          onUpdate={() => fetchRequest(requestId)}
                        />
                      )} */}
                    </div>
                    <div className="invoice-action-btn">
                      <Button
                        className="btn-block btn-success"
                        disabled={
                          currentRequest?.status?.step > 4 ? true : false
                        }
                        onClick={() => {
                          swal({
                            title: '¿Estas seguro?',
                            text: 'Une vez confirmes el servicio el cliente recibira una notificación y el servicio no podra ser modificado!',
                            icon: 'warning',
                            buttons: ['No, volver', 'Si, confirmar servicio'],
                            dangerMode: true
                          }).then(async (willUpdate) => {
                            if (willUpdate) {
                              let payload = {
                                new_request: 0, // It wont be a new request anymore
                                operator: userInfo.id,
                                status: `${process.env.REACT_APP_STATUS_STEP_5}`
                              };

                              let res = await updateRequest(payload, requestId);
                              if (res.status === 200) {
                                // setDisabled(true);
                                swal('Solicitud actualizada!', {
                                  icon: 'success'
                                });
                                // SEND EMAIL TO CLIENT
                                const payload = {
                                  id: requestId,
                                  emailType: 'requestFinished',
                                  subject: 'Servicio Finalizado ✔️',
                                  email: currentRequest?.customer?.email,
                                  name: currentRequest?.customer?.first_name
                                };
                                await sendEmail(payload); // SEND SERVICE OPTIONS EMAIL TO USER
                              }
                            }
                          });
                        }}>
                        <span>Confirmar Finalizado</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              ''
            )}
            {userInfo.profile === 1 && currentRequest?.status?.step
              ? currentRequest?.status?.step > 5 && (
                  <div className="card invoice-action-wrapper mt-2 shadow-none border">
                    <div className="card-body">
                      <div className="invoice-action-btn">
                        <Button
                          className="btn-block btn-success"
                          disabled={currentRequest?.status?.step > 6}
                          onClick={() => setShowModalInvoice(true)}>
                          <span>Adjuntar factura</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              : ''}
            {/* {showModalInvoice && (
              <ModalInvoice
                handleClose={() => setShowModalInvoice(false)}
                requestInfo={data}
                onUpdate={() => fetchRequest(requestId)}
              />
            )} */}
          </div>
        </Row>
      </section>
    );
  }
};
