import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { currencyCOP, useProfile } from '../../../../../utils';
import swal from 'sweetalert';
import { SingleRequestContext } from '../../../../../contexts';

export interface IModalEquipoProps {
  onHide: () => void;
  requestId: string;
}
interface ITrackInfo {
  fare: string;
  firstPayment: string;
}

export function ModalEquipo({ onHide, requestId }: IModalEquipoProps) {
  const {
    requestInstructors,
    requestProviders,
    currentRequest,
    updateRequestInstructorFares,
    updateRequestProvidersFares,
    getSingleRequest,
    updateRequestId
  } = useContext(SingleRequestContext);
  const [instructorsFares, setInstructorsFares] = useState({});
  const [providersFares, setProvidersFares] = useState({});
  const [trackInfo, setTrackInfo] = useState<ITrackInfo>({ fare: '', firstPayment: '' });
  const [profile] = useProfile();

  useEffect(() => {
    const tempIns = { ...instructorsFares };
    requestInstructors.forEach((item: any) => (tempIns[item.instructors.id] = item.first_payment));
    setInstructorsFares(tempIns);

    const tempProv = { ...providersFares };
    requestProviders.forEach((item) => (tempProv[item.providers.id] = item.first_payment));
    setProvidersFares(tempProv);

    setTrackInfo({
      fare: currentRequest?.fare_track,
      firstPayment: currentRequest?.f_p_track
    });

    // eslint-disable-next-line
  }, [requestInstructors, requestProviders, currentRequest]);

  const handleUpdateInstructorFare = async (instructor) => {
    let res = await updateRequestInstructorFares(
      {
        first_payment: instructorsFares[instructor.instructors.id]
      },
      instructor.id
    );
    if (res.status === 200) {
      await getSingleRequest(requestId);
      swal(
        'Pago registado!',
        `El pago de ${instructor.instructors.first_name} por ${currencyCOP.format(
          instructorsFares[instructor.instructors.id]
        )} fue registrado 👍`,
        'success'
      );
    } else {
      swal('Algo pasa!', 'No pudimos actualizar el pago 😢', 'error');
    }
  };

  const handleUpdateProviderFare = async (provider) => {
    let res = await updateRequestProvidersFares(
      {
        first_payment: providersFares[provider.providers.id]
      },
      provider.id
    );
    if (res.status === 200) {
      await getSingleRequest(requestId);
      swal(
        'Pago registado!',
        `El pago de ${provider.providers.name} por ${currencyCOP.format(
          providersFares[provider.providers.id]
        )} fue registrado 👍`,
        'success'
      );
    } else {
      swal('Algo pasa!', 'No pudimos actualizar el pago 😢', 'error');
    }
  };

  const handleUpdateTrackFares = async () => {
    let res = await updateRequestId(requestId, {
      f_p_track: trackInfo.firstPayment,
      fare_track: trackInfo.fare
    });
    if (res.status === 200) {
      swal(
        'Pago registado!',
        `El pago de ${currentRequest?.track.contact_name} por ${currencyCOP.format(
          trackInfo.firstPayment as any
        )} fue registrado 👍`,
        'success'
      );
    } else {
      swal('Algo pasa!', 'No pudimos actualizar el pago 😢', 'error');
    }
  };

  return (
    <Modal show size="lg" onHide={onHide}>
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Confirmar equipo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped responsive bordered hover size="sm">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th style={{ width: '50%' }}>Tarifa</th>
              <th style={{ width: '50%' }}>Primer pago</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {requestInstructors.map((instructor: any, idx) => {
              return (
                <tr key={idx}>
                  <td className="align-middle">
                    <strong>Instructor</strong>
                  </td>
                  <td className="align-middle">
                    {instructor.instructors.first_name} {instructor.instructors.last_name}
                  </td>
                  <td className="align-middle">{instructor.instructors.cellphone}</td>
                  <td className="align-middle">{instructor.instructors.email}</td>
                  <td className="align-middle">${Number(instructor.fare).toLocaleString('es')}</td>
                  <td className="align-middle">
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
                  <td className="align-middle">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleUpdateInstructorFare(instructor)}>
                      <FaSave />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {requestProviders.map((provider: any, idx) => {
              return (
                <tr key={idx}>
                  <td className="align-middle">
                    <strong>Proveedor</strong>
                  </td>
                  <td className="align-middle">{provider.providers.name}</td>
                  <td className="align-middle">{provider.providers.cellphone}</td>
                  <td className="align-middle">{provider.providers.email}</td>
                  <td className="align-middle">${provider.fare}</td>
                  <td className="align-middle">
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
                  <td className="align-middle">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleUpdateProviderFare(provider)}>
                      <FaSave />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {currentRequest?.track.company && currentRequest?.track.company.name === 'Ridepro' && (
              <tr>
                <td className="align-middle">
                  <strong>Pista</strong>
                </td>
                <td className="align-middle">{currentRequest?.track.contact_name}</td>
                <td className="align-middle">{currentRequest?.track.cellphone}</td>
                <td className="align-middle">{currentRequest?.track.contact_email}</td>
                <td className="align-middle">
                  <Form.Control
                    size="sm"
                    type="number"
                    placeholder="$0"
                    value={trackInfo?.fare}
                    min={0}
                    onChange={(x) => {
                      setTrackInfo({ ...trackInfo, fare: x.target.value });
                    }}
                  />
                </td>
                <td className="align-middle">
                  <Form.Control
                    size="sm"
                    type="number"
                    placeholder="$0"
                    value={trackInfo?.firstPayment}
                    min={0}
                    onChange={(x) => {
                      setTrackInfo({ ...trackInfo, firstPayment: x.target.value });
                    }}
                  />
                </td>
                <td className="align-middle">
                  <Button variant="link" size="sm" onClick={() => handleUpdateTrackFares()}>
                    <FaSave />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
