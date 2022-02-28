import React, { useContext, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { dateDDMMYYY, dateAMPM, PERFIL_CLIENTE } from '../../../../utils';
import { AuthContext } from '../../../../contexts';
import swal from 'sweetalert';

export interface IPlaceTabProps {
  currentRequest: any;
}

export function PlaceTab({ currentRequest }: IPlaceTabProps) {
  const { userInfo } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState(0);

  const handleAccept = () => {
    swal({
      title: 'Confirmando programación',
      text: `Tu solicitud se llevara acabo el ${
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
      }`,
      icon: 'info',
      buttons: ['No, volver', 'Si, confirmar servicio'],
      dangerMode: true
    });
    //   .then(async (willUpdate) => {
    // if (willUpdate) {
    //   let payload1 = {
    //     track:
    //       track !== null
    //         ? track.id
    //         : currentRequest.optional_place1
    //         ? currentRequest.optional_place1.id
    //         : '',
    //     start_time: currentRequest.optional_date1,
    //     status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`
    //   };
    //   let payload2 = {
    //     track:
    //       track !== null
    //         ? track.id
    //         : currentRequest.optional_place2
    //         ? currentRequest.optional_place2.id
    //         : '',
    //     start_time: currentRequest.optional_date2,
    //     status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`
    //   };
    //   let res = await updateRequest(
    //     selectedOption === 1 ? payload1 : payload2,
    //     requestId
    //   );
    //   if (res.status === 200) {
    //     updateRequests();
    //     swal('Solicitud actualizada!', {
    //       icon: 'success'
    //     });
    //     // SEND EMAIL
    //     const payload = {
    //       id: requestId,
    //       emailType: 'requestConfirmed',
    //       subject: 'Servicio programado ✅',
    //       email: userInfoContext.email,
    //       name: userInfoContext.name,
    //       instructor: instructor,
    //       date: selectedOption === 1 ? payload1.start_time : payload2.start_time,
    //       track:
    //         track !== null
    //           ? track
    //           : selectedOption === 1
    //           ? currentRequest.optional_place1
    //           : currentRequest.optional_place2,
    //       service: currentRequest.service.name
    //     };
    //     await sendEmail(payload); // SEND SERVICE CONFIRMED EMAIL TO USER
    //     const payloadDrivers = {
    //       id: requestId,
    //       emailType: 'requestConfirmedDrivers',
    //       subject: 'Prueba programada ✅',
    //       email: allDrivers.map((driver) => driver.email),
    //       name: userInfoContext.name,
    //       instructor: instructor,
    //       date: selectedOption === 1 ? payload1.start_time : payload2.start_time,
    //       track:
    //         track !== null
    //           ? track
    //           : selectedOption === 1
    //           ? currentRequest.optional_place1
    //           : currentRequest.optional_place2,
    //       service: currentRequest.service.name
    //     };
    //     await sendEmail(payloadDrivers); // SEND SERVICE CONFIRMED EMAIL TO PARTIVIPANTS
    //   } else {
    //     swal('Oops, no se pudo actualizar el servicio.', {
    //       icon: 'error'
    //     });
    //   }
    // }
    //   });
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
          currentRequest.status.step < PERFIL_CLIENTE.steps.STATUS_SERVICIO_PROGRAMADO.step[0] && (
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
          <Button
            variant="danger"
            size="sm"
            className="ml-2"
            onClick={() => {
              //   swal({
              //     title: 'Rechazar programación',
              //     text: `Estamos tristes de no poder cumplir con tus requerimientos. Si rechazas la programación la solicitud quedara cancelada. ¿Que deseas hacer?`,
              //     icon: 'info',
              //     buttons: ['Volver', 'Reachazar programación'],
              //     dangerMode: true
              //   }).then(async (willUpdate) => {
              //     if (willUpdate) {
              //       swal({
              //         title: '¿Por qué cancelas?',
              //         content: {
              //           element: 'input',
              //           attributes: {
              //             placeholder: 'Escribe el motivo de la cancelación',
              //             rows: '4',
              //             cols: '50'
              //           }
              //         },
              //         buttons: {
              //           cancel: 'Volver',
              //           confirm: 'Continuar'
              //         }
              //       }).then(async (msg) => {
              //         if (msg !== null) {
              //           // setLoading(true);
              //           // let payload = {
              //           //   id: requestId,
              //           //   company: userInfoContext.company,
              //           //   reject_msg: msg ? msg : "na",
              //           //   refund_credits:
              //           //     userInfoContext.credit + currentRequest.spent_credit,
              //           // };
              //           let payload = {
              //             id: requestId,
              //             user: userInfoContext,
              //             companyId: userInfoContext.company.id,
              //             reject_msg: msg
              //               ? msg
              //               : `Cancelado por el usuario ${
              //                   penaltyRides ? `| Penalidad: $${penaltyRides} rides` : ''
              //                 }`,
              //             newCredit:
              //               parseInt(userInfoContext.credit) + parseInt(currentRequest.spent_credit) // Removing penalty rides when rejecting a request
              //           };
              //           const res = await cancelRequestId(payload);
              //           if (res.canceled.status === 200 && res.refund.status === 200) {
              //             setUserInfoContext({
              //               ...userInfoContext,
              //               credit: res.refund.currentRequest.credit
              //             });
              //             swal('Listo! Esta solicitud ha sido cancelada', {
              //               icon: 'success'
              //             });
              //             setLoading(false);
              //             const payload = {
              //               id: res.canceled.currentRequest.id,
              //               emailType: 'canceledRequest',
              //               subject: 'Solicitud cancelada ❌',
              //               email: userInfoContext.email,
              //               name: userInfoContext.name,
              //               date: res.canceled.currentRequest.start_time,
              //               refund_credits: res.canceled.currentRequest.spent_credit,
              //               service: res.canceled.currentRequest.service.name,
              //               municipality: {
              //                 city: res.canceled.currentRequest.municipality.name,
              //                 department: res.canceled.currentRequest.municipality.department.name
              //               }
              //             };
              //             await sendEmail(payload); // SEND SERVICE CANCELED EMAIL TO USER
              //           } else {
              //             setLoading(false);
              //             swal('Ooops! No pudimos cancelar la solicitud', {
              //               icon: 'error'
              //             });
              //           }
              //         } else {
              //           swal('Tranqui, no paso nada!');
              //         }
              //       });
              //     }
              //   });
            }}>
            Rechazar
          </Button>
        </div>
      )}
    </>
  );
}
