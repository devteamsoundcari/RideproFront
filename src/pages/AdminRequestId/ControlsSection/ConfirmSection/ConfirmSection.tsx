import React, { useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { Button, Spinner } from 'react-bootstrap';
import { AuthContext, SingleRequestContext } from '../../../../contexts';
import {
  updateRequest,
  updateRequestDocuments,
  sendEmail
} from '../../../../controllers/apiRequests';
import swal from 'sweetalert';
// import ModalDocuments from './ModalDocuments/ModalDocuments';
import { ModalEquipo } from './ModalEquipo/ModalEquipo';
import { PERFIL_OPERACIONES } from '../../../../utils/constants';

type ConfirmSectionProps = any;

const ConfirmSection: React.FC<ConfirmSectionProps> = ({
  track,
  requestId,
  fare_track,
  fisrt_payment,
  status,
  date,
  participants,
  service
}) => {
  const { requestInstructors, requestProviders, currentRequest } = useContext(SingleRequestContext);
  const [showModalProviders, setShowModalProviders] = useState(false);
  const [showModalDocuments, setShowModalDocuments] = useState(false);
  const { userInfoContext } = useContext(AuthContext);
  const [instFares, setInstFares] = useState({});
  const [provsFares, setProvsFares] = useState({});
  const [trackFP, setTrackFP] = useState<any>(0);
  const [trackFare, setTrackFare] = useState<any>(0);
  const [selectedDocuments, setSelectedDocuments] = useState<any>([]);
  const [wasReviewed, setWasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestInstructors.forEach((item) =>
      setInstFares({
        ...instFares,
        [item.instructors.id]: item.first_payment
      })
    );

    requestProviders.forEach((item) =>
      setProvsFares({
        ...provsFares,
        [item.providers.id]: item.first_payment
      })
    );

    setTrackFP(fisrt_payment);
    setTrackFare(fare_track);

    // eslint-disable-next-line
  }, [requestInstructors, requestProviders, track, fisrt_payment, fare_track]);

  const hashCode = (id, requestId) => {
    return CryptoJS.AES.encrypt(String(id + requestId), 'fuckyoucode')
      .toString()
      .substr(-7);
  };

  const handleConfirmService = () => {
    swal({
      title: '¿Estas seguro?',
      text: 'Confirmo que he llamado a cada proveedor para confirmar el evento. Tambien selecioné los documentos necesarios, compré tiquete, hoteles o demás gasto necesario',
      icon: 'warning',
      buttons: ['No, dejame revisar', 'Si, confirmar con proveedores'],
      dangerMode: true
    }).then(async (willUpdate) => {
      if (willUpdate) {
        let docsIds: any = [];
        setLoading(true);
        selectedDocuments.forEach((doc: any) => {
          docsIds.push(doc.id);
        });
        let payloadDocs = {
          request: requestId,
          documents: docsIds
        };
        let payloadStatus = {
          new_request: 0, // It wont be a new request anymore
          operator: userInfoContext.id, // JUST IN CASE
          status: `${process.env.REACT_APP_STATUS_STEP_4}`
        };
        let resDocs = await updateRequestDocuments(payloadDocs);
        let resStatus = await updateRequest(payloadStatus, requestId);
        if (resStatus.status === 200 && resDocs.status === 201) {
          // Hash for every provider and isntructor
          track.hash = hashCode(track.id, requestId);
          requestProviders.forEach((item) => (item.hash = hashCode(item.id, requestId)));
          requestInstructors.forEach((item) => (item.hash = hashCode(item.id, requestId)));

          // Send track email if track is part of ridepro
          if (currentRequest?.track.company && currentRequest?.track.company.name === 'Ridepro') {
            let trackPayload = {
              id: requestId,
              emailType: 'requestConfirmedTrack',
              subject: 'Evento confirmado ✔️',
              email: track.contact_email,
              name: track.contact_name,
              instructor: requestInstructors[0].instructors,
              hash: track.hash,
              firstPayment: trackFP,
              date: date
            };
            await sendEmail(trackPayload);
          }

          // Send providers email
          requestProviders.forEach(async (prov) => {
            let providerPayload = {
              id: requestId,
              emailType: 'requestConfirmedProvider',
              subject: 'Evento confirmado ✔️',
              email: prov.providers.email,
              name: prov.providers.name,
              instructor: requestInstructors[0].instructors,
              hash: prov.hash,
              firstPayment: prov.first_payment,
              date: date,
              track: track
            };
            await sendEmail(providerPayload);
          });

          // Send instructors email
          requestInstructors.forEach(async (ins) => {
            let instructorPayload = {
              id: requestId,
              emailType: 'requestConfirmedInstructor',
              subject: 'Evento confirmado ✔️',
              email: ins.instructors.email,
              name: ins.instructors.first_name,
              hash: ins.hash,
              firstPayment: ins.first_payment,
              date: date,
              track: track,
              participantes: participants,
              documents: selectedDocuments,
              service: service
            };
            await sendEmail(instructorPayload);
          });

          // Send admin email
          let adminPayload = {
            id: requestId,
            emailType: 'requestConfirmedAdmin',
            subject: 'Proveedores confirmados ✔️',
            email: 'soportealiados@ridepro.co',
            date: date,
            track: track,
            trackFirstPayment: trackFP,
            providers: requestProviders,
            instructors: requestInstructors
          };
          await sendEmail(adminPayload);

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
            disabled={status.step > PERFIL_OPERACIONES.steps.STATUS_PROGRAMACION_ACEPTADA.step}
            onClick={() => setShowModalProviders(true)}>
            <span>Confirmar equipo *</span>
          </Button>
          {showModalProviders && (
            <ModalEquipo onHide={() => setShowModalProviders(false)} requestId={requestId} />
          )}
        </div>
        <div className="invoice-action-btn">
          <Button
            variant="light"
            className="btn-block"
            disabled={status.step > 3 ? true : false}
            onClick={() => setShowModalDocuments(true)}>
            <span>Confirmar documentos </span>
            {wasReviewed || status.step > 3 ? (
              <FaCheckCircle className="text-success" />
            ) : (
              <FaTimes className="text-danger" />
            )}
          </Button>

          {/* {showModalDocuments && (
            <ModalDocuments
              x={selectedDocuments}
              handleClose={() => setShowModalDocuments(false)}
              requestId={requestId}
              handleSave={(data) => {
                setSelectedDocuments(data);
                setShowModalDocuments(false);
                setWasReviewed(true);
                // updateRequestsContext();
              }}
            />
          )} */}
        </div>

        <div className="invoice-action-btn">
          <Button
            className="btn-block btn-success"
            disabled={!wasReviewed || status.step > 3 ? true : false}
            onClick={() => handleConfirmService()}>
            Confirmar {loading && <Spinner animation="border" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmSection;
