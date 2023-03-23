import React, { useContext, useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { AuthContext, ServiceContext, SingleRequestContext } from '../../../../contexts';
import { filterByReference } from '../../../../utils';
import SingleDriver from '../../AdminRequestId/DriversSection/SingleDriver/SingleDriver';
import { TabAddParticipants } from '../../TabAddParticipants/TabAddParticipants';
import swal from 'sweetalert';

export interface IParticipantsTabProps {
  currentRequest: any;
}

export function ParticipantsTab({ currentRequest }: IParticipantsTabProps) {
  const { userInfo, getUserData, setUserInfo } = useContext(AuthContext) as any;
  const { requestDrivers, updateRequestId, getSingleRequest } = useContext(SingleRequestContext);
  const { serviceParticipants, updateUserCredit } = useContext(ServiceContext);
  const [usedCredits, setUsedCredits] = useState(currentRequest.service.ride_value);

  useEffect(() => {
    if (currentRequest.service.service_type === 'Persona') {
      const numOfNewParticipants = serviceParticipants.length - requestDrivers.length;
      setUsedCredits(numOfNewParticipants);
    } else setUsedCredits(currentRequest.service.ride_value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceParticipants]);

  const canSaveDrivers = () => {
    const newDrivers = filterByReference(serviceParticipants, requestDrivers);
    return (
      newDrivers.length > 0 ||
      (serviceParticipants.length !== requestDrivers.length && serviceParticipants.length > 0)
    );
  };

  const updateRequestParticipants = () => {
    const listHtmlOfParticipants = filterByReference(serviceParticipants, requestDrivers).map(
      (participant) =>
        `<tr key=${participant.id}>
            <td>${participant?.first_name}</td>
            <td>${participant?.last_name}</td>
            <td>${participant?.email}</td>
          </tr>`
    );
    const table = `<table class='w-100 alert-table'><thead><tr><th>Nombre</th><th>Apellido</th><th>Email</th></tr></thead><tbody>${listHtmlOfParticipants.join(
      ''
    )}</tbody></table>`;
    const content = document.createElement('div');
    content.innerHTML = `<div><p><strong>Creditos ${
      usedCredits < 0 ? 'a reembolsar' : 'a cargar'
    }:</strong> $${Math.abs(usedCredits)}</p>${listHtmlOfParticipants.length ? table : ''}</div>`;

    swal({
      className: 'large-alert',
      title: 'Confirmar modificación del servicio:',
      content: content as any,
      icon: 'warning',
      buttons: ['Volver', 'Continuar']
    })
      .then(async (willUpdate) => {
        if (willUpdate) {
          const payload = {
            prev_credits: currentRequest.spent_credit,
            spent_credit:
              currentRequest.service.service_type === 'Persona'
                ? serviceParticipants.length * currentRequest.service.ride_value
                : currentRequest.service.ride_value,
            drivers: serviceParticipants.map((participant) => participant.id)
          };
          const response = await updateRequestId(currentRequest.id, payload);
          const creditsPayload = {
            newCredit:
              usedCredits < 0
                ? response.data.customer.credit + Math.abs(usedCredits)
                : response.data.customer.credit - Math.abs(usedCredits),
            companyId: response.data.customer.company.id
          };
          const creditDecrease = await updateUserCredit(creditsPayload); // Calling decrease credit
          await getUserData();
          setUserInfo({
            ...userInfo,
            credit: creditDecrease?.credit
          });
          await getSingleRequest(currentRequest.id);
          swal('Perfecto!', 'Servicio actualizado correctamente', 'success');
        }
      })
      .catch(() => {
        swal('Oops!', 'No se pudo actualizar el servicio', 'error');
        throw new Error('Error updating service');
      });
  };

  return (
    <div>
      {currentRequest?.status?.step === 1 && userInfo.profile === 2 && requestDrivers ? (
        <>
          <TabAddParticipants preloadedParticipants={requestDrivers} classNames="p-0 pb-2" />
          {currentRequest?.status.step === 1 && canSaveDrivers() && (
            <Button
              className="float-right"
              variant="dark"
              onClick={() => updateRequestParticipants()}
              style={{ margin: 'auto' }}>
              Actualizar servicio
            </Button>
          )}
        </>
      ) : requestDrivers && requestDrivers.length > 0 ? (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              {currentRequest.status.step > 4 && (
                <React.Fragment>
                  <th className="text-white">Resultado</th>
                  <th className="text-white">Link</th>
                  <th className="text-white">Reporte</th>
                </React.Fragment>
              )}
            </tr>
          </thead>
          <tbody>
            {requestDrivers.length &&
              requestDrivers.map((driver, idx) => (
                <SingleDriver driver={driver} key={idx} requestId={currentRequest.id} />
              ))}
          </tbody>
        </Table>
      ) : (
        ''
      )}
    </div>
  );
}
