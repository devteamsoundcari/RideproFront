import React, { useContext, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { dateDDMMYYY, dateAMPM, PERFIL_CLIENTE, dateWithTime } from '../../../../utils';
import { AuthContext, SingleRequestContext } from '../../../../contexts';
import swal from 'sweetalert';

export interface IPlaceTabProps {
  currentRequest: any;
}

export function PlaceTab({ currentRequest }: IPlaceTabProps) {
  const { userInfo, sendEmail } = useContext(AuthContext);
  const { updateRequestId, requestInstructors, requestDrivers } = useContext(SingleRequestContext);
  const [selectedOption, setSelectedOption] = useState(0);

  const formatContent = () =>
    `Tu solicitud se llevara acabo el ${
      selectedOption === 1
        ? dateDDMMYYY(currentRequest.optional_date1)
        : selectedOption === 2
        ? dateDDMMYYY(currentRequest.optional_date2)
        : ''
    } en ${
      currentRequest.track
        ? currentRequest.track.name
        : selectedOption === 1
        ? currentRequest.optional_place1.name
        : selectedOption === 2
        ? currentRequest.optional_place2.name
        : ''
    } - ${
      currentRequest.track
        ? currentRequest.track.municipality.name
        : selectedOption === 1
        ? currentRequest.optional_place1.municipality.name
        : selectedOption === 2
        ? currentRequest.optional_place2.municipality.name
        : ''
    } - ${
      currentRequest.track
        ? currentRequest.track.municipality.department.name
        : selectedOption === 1
        ? currentRequest.optional_place1.municipality.department.name
        : selectedOption === 2
        ? currentRequest.optional_place2.municipality.department.name
        : ''
    } a las ${
      selectedOption === 1
        ? dateAMPM(new Date(currentRequest.optional_date1))
        : selectedOption === 2
        ? dateAMPM(new Date(currentRequest.optional_date2))
        : ''
    }`;

  const handleUpdateRequest = async () => {
    let payloadOption1 = {
      track:
        currentRequest.track !== null
          ? currentRequest.track.id
          : currentRequest.optional_place1
          ? currentRequest.optional_place1.id
          : '',
      start_time: currentRequest.optional_date1,
      status: PERFIL_CLIENTE.steps.STATUS_PROGRAMACION_ACEPTADA.id
    };
    let payloadOption2 = {
      track:
        currentRequest.track !== null
          ? currentRequest.track.id
          : currentRequest.optional_place2
          ? currentRequest.optional_place2.id
          : '',
      start_time: currentRequest.optional_date2,
      status: PERFIL_CLIENTE.steps.STATUS_PROGRAMACION_ACEPTADA.id
    };
    let res = await updateRequestId(
      currentRequest.id,
      selectedOption === 1 ? payloadOption1 : payloadOption2
    );
    if (res.status === 200) {
      const payloadEmailUser = {
        id: res.data.id,
        template: 'request_confirmed',
        subject: 'Servicio programado ✅',
        to: res.data.customer.email,
        name: res.data.customer.first_name,
        instructors: requestInstructors,
        date: dateWithTime(res.data.start_time),
        track: res.data.track,
        service: res.data.service.name
      };
      const payloadEmailDrivers = {
        id: res.data.id,
        template: 'request_confirmed_drivers',
        subject: 'Prueba programada ✅',
        to: requestDrivers.map((driver) => driver.email),
        name: res.data.customer.first_name,
        instructors: requestInstructors,
        date: dateWithTime(res.data.start_time),
        track: res.data.track,
        service: res.data.service.name
      };

      Promise.all([sendEmail(payloadEmailUser), sendEmail(payloadEmailDrivers)])
        .then(() => {
          swal('¡Listo!', 'Tu solicitud se ha programado correctamente', 'success');
          // updateRequests();
        })
        .catch((err) => {
          console.log(err);
          swal('¡Error!', 'No se pudo programar notificar a los implicados', 'error');
        });
    }
  };

  const handleAccept = () => {
    swal({
      title: 'Confirmando programación',
      text: formatContent(),
      icon: 'info',
      buttons: ['No, volver', 'Si, confirmar servicio'],
      dangerMode: true
    }).then(async (willUpdate) => {
      if (willUpdate) await handleUpdateRequest();
      else {
        swal('Oops, no se pudo actualizar el servicio.', {
          icon: 'error'
        });
      }
    });
  };

  const handleReject = () => {
    swal({
      title: 'Rechazar programación',
      text: 'Estamos tristes de no poder cumplir con tus requerimientos. Si rechazas la programación la solicitud quedara cancelada. ¿Que deseas hacer?',
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
              placeholder: 'Motivo de la cancelación',
              rows: '4',
              cols: '50'
            }
          },
          buttons: ['Volver', 'Cancelar solicitud']
        }).then(async (msg) => {
          if (msg !== null) {
            // let payload = {
            //   id: currentRequest.id,
            //   user: userInfo,
            //   companyId: userInfo.company.id,
            //   reject_msg: msg
            //     ? msg
            //     : `Cancelado por el usuario ${
            //         penaltyRides ? `| Penalidad: $${penaltyRides} rides` : ''
            //       }`,
            //   newCredit: parseInt(userInfo.credit) + parseInt(currentRequest.spent_credit) // Removing penalty rides when rejecting a request
            // };
            // const res = await cancelRequestId(payload);
            // if (res.canceled.status === 200 && res.refund.status === 200) {
            //   setUserInfoContext({
            //     ...userInfoContext,
            //     credit: res.refund.currentRequest.credit
            //   });
            //   swal('Listo! Esta solicitud ha sido cancelada', {
            //     icon: 'success'
            //   });
            //   setLoading(false);
            //   const payload = {
            //     id: res.canceled.currentRequest.id,
            //     emailType: 'canceledRequest',
            //     subject: 'Solicitud cancelada ❌',
            //     email: userInfoContext.email,
            //     name: userInfoContext.name,
            //     date: res.canceled.currentRequest.start_time,
            //     refund_credits: res.canceled.currentRequest.spent_credit,
            //     service: res.canceled.currentRequest.service.name,
            //     municipality: {
            //       city: res.canceled.currentRequest.municipality.name,
            //       department: res.canceled.currentRequest.municipality.department.name
            //     }
            //   };
            //   await sendEmail(payload); // SEND SERVICE CANCELED EMAIL TO USER
            // } else {
            //   setLoading(false);
            //   swal('Ooops! No pudimos cancelar la solicitud', {
            //     icon: 'error'
            //   });
            // }
          } else {
            swal('Tranqui, no paso nada!');
          }
        });
      }
    });
  };

  const renderPlaceDateOptions = (
    optionalDate: string,
    optionalPlace: any,
    optionNumber: number
  ) => (
    <tr>
      <td className="text-capitalize">
        {currentRequest.track
          ? currentRequest.track.municipality.name
          : optionalPlace.municipality.name}
      </td>
      <td>{currentRequest.track ? currentRequest.track.name : optionalPlace.name}</td>
      <td>{dateDDMMYYY(new Date(optionalDate))}</td>
      <td>{dateAMPM(new Date(optionalDate))}</td>
      <td>
        <Form.Check
          type="radio"
          label={`Opción ${optionNumber}`}
          name="formHorizontalRadios"
          id="formHorizontalRadios1"
          onChange={() => setSelectedOption(optionNumber)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-100 text-center">
        {currentRequest.optional_date1 &&
          currentRequest.status.step <
            PERFIL_CLIENTE.steps.STATUS_PROGRAMACION_ACEPTADA.step[0] && (
            <div className="d-flex align-items-center justify-content-between">
              <Table bordered hover size="sm" className="ml-4 mr-4">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Ciudad</th>
                    <th>Lugar</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {renderPlaceDateOptions(
                    currentRequest.optional_date1,
                    currentRequest.optional_place1,
                    1
                  )}
                  {currentRequest.optional_date2 &&
                    currentRequest.optional_place2 &&
                    renderPlaceDateOptions(
                      currentRequest.optional_date2,
                      currentRequest.optional_place2,
                      2
                    )}
                </tbody>
              </Table>
            </div>
          )}
      </div>
      {userInfo.profile === PERFIL_CLIENTE.profile && (
        <div className="text-center w-100">
          <Button
            variant="success"
            size="sm"
            disabled={selectedOption !== 0 ? false : true}
            onClick={() => handleAccept()}>
            Aceptar programación
          </Button>
          <Button variant="danger" size="sm" className="ml-2" onClick={() => handleReject()}>
            Rechazar
          </Button>
        </div>
      )}
    </>
  );
}
