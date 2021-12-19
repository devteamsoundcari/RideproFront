import React, { useState, useEffect, useContext } from 'react';
import { FaSave } from 'react-icons/fa';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { AuthContext, SingleRequestContext, RequestsContext } from '../../../../contexts';
import swal from 'sweetalert';
import { useProfile } from '../../../../utils/useProfile';
import {
  currencyCOP,
  hashCode,
  COMPANY_NAME,
  dateWithTime,
  COMPANY_EMAIL
} from '../../../../utils';

type ModalOCProps = any;

const ModalOC: React.FC<ModalOCProps> = ({ requestId, handleClose }) => {
  const {
    requestInstructors,
    requestProviders,
    currentRequest,
    updateRequestInstructorFares,
    updateRequestProvidersFares,
    getSingleRequest,
    updateRequestId
  } = useContext(SingleRequestContext);
  const { userInfo, sendEmail } = useContext(AuthContext);
  const [profile] = useProfile();
  const { updateRequests } = useContext(RequestsContext);
  const [instructorsFares, setInstructorsFares] = useState<any>({});
  const [providersFares, setProvidersFares] = useState<any>({});
  const [trackInfo, setTrackInfo] = useState<any>(null);

  useEffect(() => {
    const tempIns = { ...instructorsFares };
    requestInstructors.forEach((item: any) => {
      tempIns[item.instructors.id] = item.fare;
      item.hash = hashCode(item.id, requestId); // adding hash to instructors
    });
    setInstructorsFares(tempIns);

    const tempProv = { ...providersFares };
    requestProviders.forEach((item) => {
      tempProv[item.providers.id] = item.fare;
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

  // SWAL ALERT AND ACTION
  const alertAndUpdate = (name: string, value: number, payload: any, id: any, callback: any) => {
    swal({
      title: '¿Estas segur@?',
      text: `${name} recibirá un email con pago inmediato por ${currencyCOP.format(value)}
          Una vez envies las orden de compra no habra paso atras!`,
      icon: 'warning',
      buttons: ['No, dejame revisar', 'Si, actualizar tarifa'],
      dangerMode: false
    }).then(async (willDelete) => {
      if (willDelete) {
        let res = await callback(payload, id);
        if (res.status === 200) {
          getSingleRequest(requestId);
          swal(
            'Tarifa Actualizada!',
            `la tarifa de ${name} por ${currencyCOP.format(value)} fue actualizada 👍`,
            'success'
          );
        } else {
          swal('Algo pasa!', 'No pudimos actualizar la tarifa 😢', 'error');
        }
      }
    });
  };

  const handleUpdateInstructorFare = (instructor) => {
    alertAndUpdate(
      instructor.instructors.first_name,
      instructorsFares[instructor.instructors.id] - instructor.first_payment,
      {
        fare: instructorsFares[instructor.instructors.id]
      },
      instructor.id,
      updateRequestInstructorFares
    );
  };

  const handleUpdateProviderFare = (provider) => {
    alertAndUpdate(
      provider.providers.name,
      providersFares[provider.providers.id] - provider.first_payment,
      {
        fare: providersFares[provider.providers.id]
      },
      provider.id,
      updateRequestProvidersFares
    );
  };

  const handleUpdateTrackFare = (trackInfo) => {
    alertAndUpdate(
      trackInfo?.contact_name,
      trackInfo?.fare - trackInfo?.firstPayment,
      requestId,
      {
        fare_track: trackInfo?.fare
      },
      updateRequestId
    );
  };

  const handleClickConfirmOC = () => {
    swal({
      title: '¿Estas segur@?',
      text: 'Cada proveedor recibira un email con el código de confirmación del pago y no habrá vuelta atrás!',
      icon: 'warning',
      buttons: ['No, dejame revisar', 'Si, estoy segur@'],
      dangerMode: true
    }).then(async (willUpdate) => {
      if (willUpdate) {
        let payload = {
          new_request: 0, // It wont be a new request anymore
          operator: userInfo.id,
          status: `${process.env.REACT_APP_STATUS_STEP_6}`
        };
        let res = await updateRequestId(requestId, payload);
        if (res.status === 200) {
          swal('Actualizando. . .', {
            buttons: {},
            closeOnClickOutside: false
          });

          // Send track email if track is part of ridepro
          if (trackInfo.company.name === COMPANY_NAME) {
            let trackPayload = {
              id: requestId,
              emailType: 'requestFinishedAll',
              subject: 'Gracias por tus servicios ✔️',
              email: trackInfo.contact_email,
              name: trackInfo.contact_name,
              date: dateWithTime(currentRequest.start_time),
              fare: trackInfo.fare,
              firstPayment: trackInfo.firstPayment,
              hash: trackInfo.hash
            };
            await sendEmail(trackPayload);
          }

          // Send email to each instructor
          requestInstructors.forEach(async (ins) => {
            let instructosPayload = {
              id: requestId,
              emailType: 'requestFinishedAll',
              subject: 'Gracias por tus servicios ✔️',
              email: ins.instructors.email,
              name: ins.instructors.first_name,
              date: dateWithTime(currentRequest.start_time),
              fare: ins.fare,
              firstPayment: ins.first_payment,
              hash: ins.hash
            };
            await sendEmail(instructosPayload);
          });

          // Send email to each provider
          requestProviders.forEach(async (prov) => {
            let providersPayload = {
              id: requestId,
              emailType: 'requestFinishedAll',
              subject: 'Gracias por tus servicios ✔️',
              email: prov.providers.email,
              name: prov.providers.name,
              date: dateWithTime(currentRequest.start_time),

              fare: prov.fare,
              firstPayment: prov.first_payment,
              hash: prov.hash
            };
            await sendEmail(providersPayload);
          });

          //Email to admins
          let adminPayload = {
            id: requestId,
            emailType: 'ocAdmin',
            subject: `OC Servicio#${requestId} 📑`,
            email: [COMPANY_EMAIL],
            date: dateWithTime(currentRequest.start_time),
            track: trackInfo,
            providers: requestProviders,
            instructors: requestInstructors,
            service: currentRequest.service
          };
          await sendEmail(adminPayload);

          swal(
            'Felicitaciones!',
            `Haz culminado tus labores con la solicitud #${requestId} 👍`,
            'success'
          );
          updateRequests();
          handleClose();
        } else {
          swal('Algo pasa!', 'No pudimos actualizar la solicitud 😢', 'error');
        }
      }
    });
  };

  return (
    <Modal show onHide={handleClose} size="xl">
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Enviar OC</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped responsive bordered hover size="sm">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th style={{ width: '8rem' }}>Tarifa</th>
              <th>Primer pago</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {requestInstructors.map((instructor: any, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <strong>Instructor</strong>
                  </td>
                  <td className="text-capitalize">
                    {instructor.instructors.first_name} {instructor.instructors.last_name}
                  </td>
                  <td>{instructor.instructors.cellphone}</td>
                  <td>
                    <small>{instructor.instructors.email}</small>
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      type="number"
                      placeholder="$0"
                      value={instructorsFares[instructor.instructors.id]}
                      min={0}
                      onChange={(x) => {
                        setInstructorsFares({
                          ...instructorsFares,
                          [instructor.instructors.id]: x.target.value
                        });
                      }}
                    />
                  </td>
                  <td>{currencyCOP.format(instructor.first_payment)}</td>
                  <td>
                    {currencyCOP.format(
                      instructorsFares[instructor.instructors.id] - instructor.first_payment
                    )}
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleUpdateInstructorFare(instructor)}>
                      <FaSave />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {requestProviders.map((provider: any, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <strong>Proveedor</strong>
                  </td>
                  <td>{provider.providers.name}</td>
                  <td>{provider.providers.cellphone}</td>
                  <td>
                    <small>{provider.providers.email}</small>
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      type="number"
                      placeholder="$0"
                      value={providersFares[provider.providers.id]}
                      min={0}
                      onChange={(x) => {
                        setProvidersFares({
                          ...providersFares,
                          [provider.providers.id]: x.target.value
                        });
                      }}
                    />
                  </td>
                  <td>{currencyCOP.format(provider.first_payment)}</td>
                  <td>
                    {currencyCOP.format(
                      providersFares[provider.providers.id] - provider.first_payment
                    )}
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleUpdateProviderFare(provider)}>
                      <FaSave />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {trackInfo?.company?.name === COMPANY_NAME && (
              <tr>
                <td>
                  <strong>Pista</strong>
                </td>
                <td>{trackInfo?.contact_name}</td>
                <td>{trackInfo?.cellphone}</td>
                <td>
                  <small>{trackInfo?.contact_email}</small>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    type="number"
                    placeholder="$0"
                    value={trackInfo.fare}
                    min={100}
                    onChange={(x) => {
                      setTrackInfo({ ...trackInfo, fare: x.target.value });
                    }}
                  />
                </td>
                <td>{currencyCOP.format(trackInfo?.firstPayment)}</td>
                <td>{currencyCOP.format(trackInfo?.fare - trackInfo?.firstPayment)}</td>
                <td>
                  <Button variant="link" onClick={() => handleUpdateTrackFare(trackInfo)}>
                    <FaSave />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => handleClickConfirmOC()}>
          Confirmar OC's
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalOC;
