import React, { useState, useEffect, useContext } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { Button, Spinner } from 'react-bootstrap';
import { AuthContext, SingleRequestContext } from '../../../../../contexts';
import ModalDocuments from './ModalDocuments/ModalDocuments';
import { ModalEquipo } from './ModalEquipo/ModalEquipo';
import {
  dateWithTime,
  hashCode,
  PERFIL_OPERACIONES,
  COMPANY_EMAIL,
  COMPANY_NAME
} from '../../../../../utils';
import swal from 'sweetalert';

type ConfirmSectionProps = any;

const ConfirmSection: React.FC<ConfirmSectionProps> = ({ requestId }) => {
  const {
    requestInstructors,
    requestProviders,
    currentRequest,
    updateRequestId,
    loadingDrivers,
    requestDrivers,
    requestDocuments,
    loadingDocuments
  } = useContext(SingleRequestContext);
  const { userInfo, sendEmail } = useContext(AuthContext);
  const [showModalProviders, setShowModalProviders] = useState(false);
  const [showModalDocuments, setShowModalDocuments] = useState(false);
  const [instructorsFares, setInstructorsFares] = useState<any>({});
  const [providersFares, setProvidersFares] = useState<any>({});
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempIns = { ...instructorsFares };
    requestInstructors.forEach((item: any) => {
      tempIns[item.instructors.id] = item.first_payment;
      item.hash = hashCode(item.id, requestId); // adding hash to instructors
    });
    setInstructorsFares(tempIns);

    const tempProv = { ...providersFares };
    requestProviders.forEach((item) => {
      tempProv[item.providers.id] = item.first_payment;
      item.hash = hashCode(item.id, requestId); // adding hash to providers
    });
    setProvidersFares(tempProv);

    setTrackInfo({
      ...currentRequest.track,
      fare: currentRequest?.fare_track,
      firstPayment: currentRequest?.f_p_track,
      hash: hashCode(currentRequest.track.id, requestId) // Adding hash code to track
    });
    // eslint-disable-next-line
  }, [requestInstructors, requestProviders, currentRequest]);

  const handleConfirmService = async () => {
    swal({
      title: '¿Estas segur@?',
      text: 'Confirmo que he llamado a cada proveedor para confirmar el evento. Tambien selecioné los documentos necesarios, compré tiquete, hoteles o demás gastos necesarios',
      icon: 'warning',
      buttons: ['No, dejame revisar', 'Si, confirmar'],
      dangerMode: true
    }).then(async (willUpdate) => {
      if (willUpdate) {
        setLoading(true);
        let payloadStatus = {
          new_request: 0, // It wont be a new request anymore
          operator: userInfo.id, // JUST IN CASE
          status: PERFIL_OPERACIONES.steps.STATUS_CONFIRMAR_DOCUMENTOS.id
        };
        let resStatus = await updateRequestId(requestId, payloadStatus);
        if (resStatus.status === 200) {
          // Send track email if track is part of the company
          if (trackInfo?.company?.name.toLowerCase() === COMPANY_NAME) {
            let trackPayload = {
              id: requestId,
              template: 'request_confirmed_track',
              subject: 'Evento confirmado ✔️',
              to: trackInfo.contact_email,
              name: trackInfo.contact_name,
              instructor: requestInstructors[0].instructors,
              hash: trackInfo.hash,
              firstPayment: trackInfo.firstPayment,
              date: dateWithTime(currentRequest.start_time)
            };
            await sendEmail(trackPayload);
          }

          // Send providers email
          const providersPayloads = requestProviders.map((prov) => {
            return {
              id: requestId,
              template: 'request_confirmed_provider',
              subject: 'Evento confirmado ✔️',
              to: prov.providers.email,
              name: prov.providers.name,
              instructor: requestInstructors[0].instructors,
              hash: prov.hash,
              firstPayment: prov.first_payment,
              date: dateWithTime(currentRequest.start_time),
              track: trackInfo
            };
          });

          await Promise.all(providersPayloads.map(sendEmail));

          // // Send instructors email
          const instructorsPayloads = requestInstructors.map((ins) => {
            return {
              id: requestId,
              template: 'request_confirmed_instructor',
              subject: 'Evento confirmado ✔️',
              to: ins.instructors.email,
              name: ins.instructors.first_name,
              hash: ins.hash,
              firstPayment: ins.first_payment,
              date: dateWithTime(currentRequest.start_time),
              track: trackInfo,
              participantes: requestDrivers,
              documents: requestDocuments.map((doc) => doc.document),
              service: currentRequest.service
            };
          });

          await Promise.all(instructorsPayloads.map(sendEmail));

          // // Send admin email
          let adminPayload = {
            id: requestId,
            template: 'request_confirmed_admin',
            subject: 'Proveedores confirmados ✔️',
            to: COMPANY_EMAIL,
            date: dateWithTime(currentRequest.start_time),
            track: trackInfo,
            trackFirstPayment: trackInfo.firstPayment,
            providers: requestProviders,
            instructors: requestInstructors
          };
          await sendEmail(adminPayload);

          // Send email to client
          let clientPayload = {
            id: requestId,
            template: 'request_confirmed',
            subject: 'Servicio confirmado ✔️',
            to: currentRequest?.customer?.email,
            date: dateWithTime(currentRequest.start_time),
            name: currentRequest?.customer?.first_name,
            service: currentRequest?.service?.name,
            track: trackInfo,
            providers: requestProviders,
            instructors: requestInstructors
          };
          await sendEmail(clientPayload);

          setLoading(false);
          swal('Solicitud actualizada!', {
            icon: 'success'
          });
        } else {
          swal('Oops, no se pudo actualizar el servicio.', {
            icon: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="card invoice-action-wrapper mt-2 shadow-none border">
      <div className="card-body">
        <div className="invoice-action-btn">
          <Button
            variant="light"
            className="btn-block"
            disabled={
              loadingDrivers ||
              loadingDocuments ||
              currentRequest.status.step >
                PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step
            }
            onClick={() => setShowModalProviders(true)}>
            <span>Confirmar equipo</span> <FaCheckCircle className="text-success" />
          </Button>
          {showModalProviders && (
            <ModalEquipo onHide={() => setShowModalProviders(false)} requestId={requestId} />
          )}
        </div>
        <div className="invoice-action-btn">
          <Button
            variant="light"
            className="btn-block"
            disabled={
              loadingDrivers ||
              loadingDocuments ||
              currentRequest.status.step >
                PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step
            }
            onClick={() => setShowModalDocuments(true)}>
            <span>Confirmar docs </span>
            {currentRequest.documents.length ||
            currentRequest.status.step >
              PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step ? (
              <FaCheckCircle className="text-success" />
            ) : (
              <FaTimes className="text-danger" />
            )}
          </Button>

          {showModalDocuments && (
            <ModalDocuments
              handleClose={() => setShowModalDocuments(false)}
              requestId={requestId}
            />
          )}
        </div>

        <div className="invoice-action-btn">
          <Button
            className="btn-block btn-success"
            disabled={
              !currentRequest.documents.length ||
              currentRequest.status.step >
                PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step ||
              loadingDrivers ||
              loadingDocuments
            }
            onClick={() => handleConfirmService()}>
            Confirmar {loading && <Spinner animation="border" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmSection;
