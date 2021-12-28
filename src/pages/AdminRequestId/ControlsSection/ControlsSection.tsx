import React, { useContext, useState, useEffect } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { allStatus } from '../../../allStatus';
import { StatusRenderer } from '../../../components/atoms';
import { SingleRequestContext, AuthContext, TracksContext } from '../../../contexts';
import { PERFIL_OPERACIONES, PERFIL_TECNICO, PERFIL_ADMIN } from '../../../utils';
import ModalPlaceDate from './ModalPlaceDate/ModalPlaceDate';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import ModalOC from './ModalOC/ModalOC';
import ModalInstructors from './ModalInstructors/ModalInstructors';
import ModalProviders from './ModalProviders/ModalProviders';
import ConfirmSection from './ConfirmSection/ConfirmSection';
import ModalUploadReports from './ModalUploadReports/ModalUploadReports';

export interface IRightSectionProps {}

export default function RightSection(props: any) {
  const { requestId } = useParams() as any;
  const { userInfo, sendEmail } = useContext(AuthContext);
  const {
    currentRequest,
    requestDocuments,
    requestDrivers,
    requestDriversReports,
    updateRequestId
  } = useContext(SingleRequestContext);
  const { setTracks } = useContext(TracksContext);
  const [showModalPlace, setShowModalPlace] = useState(false);
  const [showModalInstructors, setShowModalInstructors] = useState(false);
  const [showModalProviders, setShowModalProviders] = useState(false);
  const [showModalOC, setShowModalOC] = useState(false);
  const [showModalUploadReports, setShowModalUploadReports] = useState(false);
  const [showModalInvoice, setShowModalInvoice] = useState(false);
  const [documentsOk, setDocumentsOk] = useState(false);
  const [reportsOk, setReportsOk] = useState(false);

  useEffect(() => {
    setDocumentsOk(requestDocuments.filter((item) => item?.file === null).length ? false : true);
    setReportsOk(
      requestDriversReports.filter((item) => item?.file !== null).length === requestDrivers.length
    );
  }, [requestDocuments, requestDrivers, requestDriversReports]);

  const checkDisabled = () => {
    if (
      currentRequest?.instructors.length > 0 &&
      currentRequest?.providers.length > 0 &&
      currentRequest?.optional_date1
    ) {
      if (
        currentRequest?.status?.step === PERFIL_OPERACIONES.steps.STATUS_ESPERANDO_CONFIRMACION.step
      ) {
        return false;
      } else return true;
    } else return true;
  };

  // STATUS FORMATTER
  const statusFormatter = (statusStep) => {
    const foundProfile = allStatus.find((user) => user.profile.profile === userInfo.profile);
    const foundStep = foundProfile?.steps.find(({ step }) => step === statusStep);
    return <StatusRenderer step={foundStep} />;
  };

  const handleChangeRequestStatus = (
    status: string,
    emailTemplate: string,
    emailSubject: string
  ) => {
    swal({
      title: '¿Estas segur@?',
      text: 'Une vez confirmes el servicio el cliente recibira una notificación y el servicio no podra ser modificado!',
      icon: 'warning',
      buttons: ['No, volver', 'Si, confirmar servicio'],
      dangerMode: true
    }).then(async (willUpdate) => {
      if (willUpdate) {
        let payload = {
          new_request: 0, // It wont be a new request anymore
          operator: userInfo.id,
          status
        };
        let res = await updateRequestId(requestId, payload);
        if (res.status === 200) {
          //   // SEND EMAIL
          const payload = {
            id: requestId,
            template: emailTemplate,
            subject: emailSubject,
            to: currentRequest?.customer?.email,
            name: currentRequest?.customer?.first_name
          };
          try {
            await sendEmail(payload); // SEND SERVICE OPTIONS EMAIL TO USER
            swal('Solicitud actualizada!', {
              icon: 'success'
            });
          } catch (error) {
            swal('Actualizado. Pero no pudimos notificar al cliente!', {
              icon: 'error'
            });
          }
        } else {
          swal('No pudimos actualizar la solicitud!', {
            icon: 'error'
          });
        }
      }
    });
  };

  return (
    <div
      className="col-xl-3 col-md-4 col-12"
      style={{
        position: 'fixed',
        right: '1rem',
        maxWidth: '17rem'
      }}>
      <div className="mt-2 mb-3">{statusFormatter(currentRequest?.status?.step)}</div>
      {userInfo.profile === PERFIL_OPERACIONES.profile &&
        currentRequest?.status?.step !== PERFIL_OPERACIONES.steps.STATUS_CANCELADO.step && (
          <React.Fragment>
            <div className="card invoice-action-wrapper shadow-none border">
              <div className="card-body">
                <div className="invoice-action-btn">
                  <Button
                    variant="light"
                    className="btn-block"
                    onClick={() => setShowModalPlace(true)}
                    disabled={
                      currentRequest?.status?.step >=
                      PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step
                    }>
                    <span>Lugar / Fecha / Hora </span>
                    {currentRequest?.optional_date1 ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </Button>
                  {showModalPlace && currentRequest && (
                    <ModalPlaceDate
                      requestId={requestId}
                      handleClose={() => {
                        setTracks([]);
                        setShowModalPlace(false);
                      }}
                    />
                  )}
                </div>
                <div className="invoice-action-btn">
                  <Button
                    variant="light"
                    className="btn-block"
                    onClick={() => setShowModalInstructors(true)}
                    disabled={
                      currentRequest?.status?.step >=
                      PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step
                    }>
                    <span>Instructores </span>
                    {currentRequest?.instructors.length > 0 ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </Button>
                  {showModalInstructors && (
                    <ModalInstructors
                      requestId={requestId}
                      handleClose={() => setShowModalInstructors(false)}
                    />
                  )}
                </div>
                <div className="invoice-action-btn">
                  <Button
                    variant="light"
                    className="btn-block"
                    onClick={() => setShowModalProviders(true)}
                    disabled={
                      currentRequest?.status?.step >=
                      PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step
                    }>
                    <span>Proveedores </span>
                    {currentRequest?.providers.length > 0 ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </Button>
                  {showModalProviders && (
                    <ModalProviders
                      requestId={requestId}
                      handleClose={() => setShowModalProviders(false)}
                    />
                  )}
                </div>
                <div className="invoice-action-btn">
                  <Button
                    className="btn-block btn-success"
                    disabled={checkDisabled()}
                    onClick={() => {
                      handleChangeRequestStatus(
                        PERFIL_OPERACIONES.steps.STATUS_ESPERANDO_AL_CLIENTE.id,
                        'request_options',
                        'Confirmar solicitud ⚠️'
                      );
                    }}>
                    <span>
                      {currentRequest?.status?.step ===
                      PERFIL_OPERACIONES.steps.STATUS_ESPERANDO_CONFIRMACION.step
                        ? 'Confirmar solicitud'
                        : currentRequest?.status?.step ===
                          PERFIL_OPERACIONES.steps.STATUS_ESPERANDO_AL_CLIENTE.step
                        ? 'Esperando cliente'
                        : currentRequest?.status?.step ===
                          PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step
                        ? 'Servicio confirmado'
                        : 'Cancelado'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            {currentRequest?.status?.step >=
              PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step && (
              <ConfirmSection requestId={requestId} />
            )}

            {currentRequest?.status?.step >
              PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step && (
              <div className="card invoice-action-wrapper mt-2 shadow-none border">
                <div className="card-body">
                  <ListGroup className="text-center">
                    <ListGroup.Item className="py-1 text-sm">
                      <small>Reportes</small>{' '}
                      {reportsOk ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimes className="text-danger" />
                      )}
                    </ListGroup.Item>
                    <ListGroup.Item className="py-1">
                      <small>Documentos</small>{' '}
                      {documentsOk ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimes className="text-danger" />
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                  <div className="invoice-action-btn">
                    <Button
                      className="btn-block btn-success"
                      disabled={
                        !documentsOk ||
                        !reportsOk ||
                        currentRequest?.status.step >=
                          PERFIL_OPERACIONES.steps.STATUS_SERVICIO_FINALIZADO.step
                      }
                      onClick={() => setShowModalOC(true)}>
                      <span>Enviar OC</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showModalOC && (
              <ModalOC handleClose={() => setShowModalOC(false)} requestId={requestId} />
            )}
          </React.Fragment>
        )}
      {userInfo.profile === PERFIL_TECNICO.profile &&
      currentRequest?.status?.step > PERFIL_TECNICO.steps.STATUS_PROGRAMACION_ACEPTADA.step ? (
        <React.Fragment>
          <div className="card invoice-action-wrapper mt-2 shadow-none border">
            <div className="card-body">
              <div className="invoice-action-btn">
                <Button
                  variant="light"
                  className="btn-block"
                  disabled={
                    currentRequest?.status?.step < PERFIL_TECNICO.steps.STATUS_GENERAR_INFORMES.step
                  }
                  onClick={() => setShowModalUploadReports(true)}>
                  <span>Generar reportes</span>
                </Button>
                {showModalUploadReports && (
                  <ModalUploadReports handleClose={() => setShowModalUploadReports(false)} />
                )}
              </div>
              <div className="invoice-action-btn">
                <Button
                  className="btn-block btn-success"
                  disabled={currentRequest?.status?.step > 4 ? true : false}
                  onClick={() => {
                    handleChangeRequestStatus(
                      PERFIL_TECNICO.steps.STATUS_SERVICIO_FINALIZADO.id,
                      'request_finished',
                      'Servicio Finalizado ✔️'
                    );
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
      {userInfo.profile === PERFIL_ADMIN.profile && currentRequest?.status?.step
        ? currentRequest?.status?.step >
            PERFIL_ADMIN.steps.STATUS_ESPERANDO_RECEPCION_DOCUMENTOS.step && (
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
  );
}
