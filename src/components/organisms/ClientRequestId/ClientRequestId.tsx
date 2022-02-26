import React, { useContext, useState } from 'react';
import { Row, Col, Button, OverlayTrigger, Tooltip, Nav, Tab, Table, Tabs } from 'react-bootstrap';
import { FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { MdPeople, MdHelpOutline, MdLocalPhone } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { SingleRequestContext, AuthContext } from '../../../contexts';
import { dateDDMMYYYnTime, dateDDMMYYY, dateAMPM, PERFIL_ADMIN } from '../../../utils';
import { TiCogOutline } from 'react-icons/ti';
import { HeaderSection } from './HeaderSection/HeaderSection';
import { SubHeaderSection } from './SubHeaderSection/SubHeaderSection';
import './ClientRequestId.scss';

export interface IClientRequestIdProps {}

export function ClientRequestId(props: IClientRequestIdProps) {
  const [defaultTab, setDefaultTab] = useState('participants');
  const { userInfo } = useContext(AuthContext);
  const { requestId } = useParams() as any;
  const { currentRequest } = useContext(SingleRequestContext);

  const renderPlaceDateOptions = (track) => {
    //     if (data.status.step === 2) {
    //       return (
    //         <Tab
    //           eventKey="place"
    //           title={
    //             <span className="text-danger">
    //               <MdWarning /> Lugar y Fecha
    //             </span>
    //           }>
    //           <div className="w-100 text-center">
    //             {data.optional_date1 && data.status.step < 3 ? (
    //               <div className="d-flex align-items-center justify-content-between">
    //                 <Table bordered hover size="sm" className="ml-4 mr-4">
    //                   <thead className="bg-primary text-white">
    //                     <tr>
    //                       <th>Ciudad</th>
    //                       <th>Lugar</th>
    //                       <th>Fecha</th>
    //                       <th>Hora</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr>
    //                       <td>
    //                         {track ? track.municipality.name : data.optional_place1.municipality.name}
    //                       </td>
    //                       <td>{track ? track.name : data.optional_place1.name}</td>
    //                       <td>{dateFormatter(new Date(data.optional_date1))}</td>
    //                       <td>{formatAMPM(new Date(data.optional_date1))}</td>
    //                       <td>
    //                         <Form.Check
    //                           type="radio"
    //                           label="Opción 1"
    //                           name="formHorizontalRadios"
    //                           id="formHorizontalRadios1"
    //                           onChange={() => setSelectedOption(1)}
    //                         />
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </Table>
    //               </div>
    //             ) : (
    //               ''
    //             )}
    // {/*
    //             {data.optional_date2 && data.status.step < 3 ? (
    //               <div className="d-flex align-items-center justify-content-between">
    //                 <Table bordered hover size="sm" className="ml-4 mr-4">
    //                   <thead className="bg-primary text-white">
    //                     <tr>
    //                       <th>Ciudad</th>
    //                       <th>Lugar</th>
    //                       <th>Fecha</th>
    //                       <th>Hora</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr>
    //                       <td>
    //                         {track ? track.municipality.name : data.optional_place2.municipality.name}
    //                       </td>
    //                       <td>{track ? track.name : data.optional_place2.name}</td>
    //                       <td>{dateFormatter(new Date(data.optional_date2))}</td>
    //                       <td>{formatAMPM(new Date(data.optional_date2))}</td>
    //                       <td>
    //                         <Form.Check
    //                           type="radio"
    //                           label="Opción 2"
    //                           name="formHorizontalRadios"
    //                           id="formHorizontalRadios2"
    //                           // style={{ width: "7rem" }}
    //                           onChange={() => setSelectedOption(2)}
    //                         />
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </Table>
    //               </div>
    //             ) : (
    //               ''
    //             )}
    // {/*  */}
    //             {data.track && data.status.step > 2 ? (
    //               <div className="d-flex align-items-center justify-content-between">
    //                 <Table bordered hover size="sm" className="ml-4 mr-4">
    //                   <thead className="bg-primary text-white">
    //                     <tr>
    //                       <th>Ciudad</th>
    //                       <th>Lugar</th>
    //                       <th>Fecha</th>
    //                       <th>Hora</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     <tr>
    //                       <td>{track.municipality.name}</td>
    //                       <td>{track.name}</td>
    //                       <td>{dateFormatter(new Date(data.start_time))}</td>
    //                       <td>{formatAMPM(new Date(data.start_time))}</td>
    //                     </tr>
    //                   </tbody>
    //                 </Table>
    //               </div>
    //             ) : (
    //               ''
    //             )}
    //           </div> */}
    //           {/* {userInfoContext.profile === 2 && (
    //             <div className="text-center w-100">
    //               <Button
    //                 variant="success"
    //                 size="sm"
    //                 disabled={selectedOption !== 0 ? false : true}
    //                 onClick={() => {
    //                   swal({
    //                     title: 'Confirmando programación',
    //                     text: `Tu solicitud se llevara acabo el ${
    //                       selectedOption === 1
    //                         ? dateFormatter(data.optional_date1)
    //                         : selectedOption === 2
    //                         ? dateFormatter(data.optional_date2)
    //                         : ''
    //                     } en ${
    //                       track
    //                         ? track.name
    //                         : selectedOption === 1
    //                         ? data.optional_place1.name
    //                         : selectedOption === 2
    //                         ? data.optional_place2.name
    //                         : ''
    //                     } - ${
    //                       track
    //                         ? track.municipality.name
    //                         : selectedOption === 1
    //                         ? data.optional_place1.municipality.name
    //                         : selectedOption === 2
    //                         ? data.optional_place2.municipality.name
    //                         : ''
    //                     } - ${
    //                       track
    //                         ? track.municipality.department.name
    //                         : selectedOption === 1
    //                         ? data.optional_place1.municipality.department.name
    //                         : selectedOption === 2
    //                         ? data.optional_place2.municipality.department.name
    //                         : ''
    //                     } a las ${
    //                       selectedOption === 1
    //                         ? formatAMPM(new Date(data.optional_date1))
    //                         : selectedOption === 2
    //                         ? formatAMPM(new Date(data.optional_date2))
    //                         : ''
    //                     }`,
    //                     icon: 'info',
    //                     buttons: ['No, volver', 'Si, confirmar servicio'],
    //                     dangerMode: true
    //                   }).then(async (willUpdate) => {
    //                     if (willUpdate) {
    //                       let payload1 = {
    //                         track:
    //                           track !== null
    //                             ? track.id
    //                             : data.optional_place1
    //                             ? data.optional_place1.id
    //                             : '',
    //                         start_time: data.optional_date1,
    //                         status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`
    //                       };
    //                       let payload2 = {
    //                         track:
    //                           track !== null
    //                             ? track.id
    //                             : data.optional_place2
    //                             ? data.optional_place2.id
    //                             : '',
    //                         start_time: data.optional_date2,
    //                         status: `${process.env.REACT_APP_STATUS_REQUEST_CONFIRMED}`
    //                       };
    //                       let res = await updateRequest(
    //                         selectedOption === 1 ? payload1 : payload2,
    //                         requestId
    //                       );
    //                       if (res.status === 200) {
    //                         updateRequests();
    //                         swal('Solicitud actualizada!', {
    //                           icon: 'success'
    //                         });
    //                         // SEND EMAIL
    //                         const payload = {
    //                           id: requestId,
    //                           emailType: 'requestConfirmed',
    //                           subject: 'Servicio programado ✅',
    //                           email: userInfoContext.email,
    //                           name: userInfoContext.name,
    //                           instructor: instructor,
    //                           date: selectedOption === 1 ? payload1.start_time : payload2.start_time,
    //                           track:
    //                             track !== null
    //                               ? track
    //                               : selectedOption === 1
    //                               ? data.optional_place1
    //                               : data.optional_place2,
    //                           service: data.service.name
    //                         };
    //                         await sendEmail(payload); // SEND SERVICE CONFIRMED EMAIL TO USER
    //                         const payloadDrivers = {
    //                           id: requestId,
    //                           emailType: 'requestConfirmedDrivers',
    //                           subject: 'Prueba programada ✅',
    //                           email: allDrivers.map((driver) => driver.email),
    //                           name: userInfoContext.name,
    //                           instructor: instructor,
    //                           date: selectedOption === 1 ? payload1.start_time : payload2.start_time,
    //                           track:
    //                             track !== null
    //                               ? track
    //                               : selectedOption === 1
    //                               ? data.optional_place1
    //                               : data.optional_place2,
    //                           service: data.service.name
    //                         };
    //                         await sendEmail(payloadDrivers); // SEND SERVICE CONFIRMED EMAIL TO PARTIVIPANTS
    //                       } else {
    //                         swal('Oops, no se pudo actualizar el servicio.', {
    //                           icon: 'error'
    //                         });
    //                       }
    //                     }
    //                   });
    //                 }}>
    //                 Aceptar programación
    //               </Button>
    //               <Button
    //                 variant="danger"
    //                 size="sm"
    //                 className="ml-2"
    //                 onClick={() => {
    //                   swal({
    //                     title: 'Rechazar programación',
    //                     text: `Estamos tristes de no poder cumplir con tus requerimientos. Si rechazas la programación la solicitud quedara cancelada. ¿Que deseas hacer?`,
    //                     icon: 'info',
    //                     buttons: ['Volver', 'Reachazar programación'],
    //                     dangerMode: true
    //                   }).then(async (willUpdate) => {
    //                     if (willUpdate) {
    //                       swal({
    //                         title: '¿Por qué cancelas?',
    //                         content: {
    //                           element: 'input',
    //                           attributes: {
    //                             placeholder: 'Escribe el motivo de la cancelación',
    //                             rows: '4',
    //                             cols: '50'
    //                           }
    //                         },
    //                         buttons: {
    //                           cancel: 'Volver',
    //                           confirm: 'Continuar'
    //                         }
    //                       }).then(async (msg) => {
    //                         if (msg !== null) {
    //                           // setLoading(true);
    //                           // let payload = {
    //                           //   id: requestId,
    //                           //   company: userInfoContext.company,
    //                           //   reject_msg: msg ? msg : "na",
    //                           //   refund_credits:
    //                           //     userInfoContext.credit + data.spent_credit,
    //                           // };
    //                           let payload = {
    //                             id: requestId,
    //                             user: userInfoContext,
    //                             companyId: userInfoContext.company.id,
    //                             reject_msg: msg
    //                               ? msg
    //                               : `Cancelado por el usuario ${
    //                                   penaltyRides ? `| Penalidad: $${penaltyRides} rides` : ''
    //                                 }`,
    //                             newCredit:
    //                               parseInt(userInfoContext.credit) + parseInt(data.spent_credit) // Removing penalty rides when rejecting a request
    //                           };
    //                           const res = await cancelRequestId(payload);
    //                           if (res.canceled.status === 200 && res.refund.status === 200) {
    //                             setUserInfoContext({
    //                               ...userInfoContext,
    //                               credit: res.refund.data.credit
    //                             });
    //                             swal('Listo! Esta solicitud ha sido cancelada', {
    //                               icon: 'success'
    //                             });
    //                             setLoading(false);
    //                             const payload = {
    //                               id: res.canceled.data.id,
    //                               emailType: 'canceledRequest',
    //                               subject: 'Solicitud cancelada ❌',
    //                               email: userInfoContext.email,
    //                               name: userInfoContext.name,
    //                               date: res.canceled.data.start_time,
    //                               refund_credits: res.canceled.data.spent_credit,
    //                               service: res.canceled.data.service.name,
    //                               municipality: {
    //                                 city: res.canceled.data.municipality.name,
    //                                 department: res.canceled.data.municipality.department.name
    //                               }
    //                             };
    //                             await sendEmail(payload); // SEND SERVICE CANCELED EMAIL TO USER
    //                           } else {
    //                             setLoading(false);
    //                             swal('Ooops! No pudimos cancelar la solicitud', {
    //                               icon: 'error'
    //                             });
    //                           }
    //                         } else {
    //                           swal('Tranqui, no paso nada!');
    //                         }
    //                       });
    //                     }
    //                   });
    //                 }}>
    //                 Rechazar
    //               </Button>
    //             </div>
    //           )} */}
    //         </Tab>
    //       );
    //     }
  };

  return (
    <section className="single-request-client mb-3">
      <Row>
        <div className="col-xl-9 col-md-8 col-12">
          <div className="card invoice-print-area">
            <div className="card-content">
              <div className="card-body pb-0 mx-25">
                <HeaderSection requestId={requestId} currentRequest={currentRequest} />
                <hr />
                <SubHeaderSection currentRequest={currentRequest} />
              </div>
              <hr />
              <div className="invoice-product-details table-responsive mx-md-25">
                {currentRequest && (
                  <Tabs
                    activeKey={defaultTab}
                    onSelect={(k) => setDefaultTab(k)}
                    id="uncontrolled-tab-request"
                    className="uncontrolled-tab-request">
                    {renderPlaceDateOptions(currentRequest.track)}
                    {/* 
                    <Tab
                      eventKey="participants"
                      title={
                        <span>
                          <MdPeople /> Participantes
                        </span>
                      }
                      style={{ overflow: 'auto' }}>
                      {currentRequest?.status?.step === 1 &&
                      userInfo.profile === 2 &&
                      allDrivers ? (
                        <React.Fragment>
                          <EditableTable
                            size="sm"
                            currentRequestSet={allDrivers}
                            fields={fields}
                            onValidate={handleNewDriversValidation}
                            onUpdate={handleAllDrivers}
                            readOnly={true}
                            readOnlyIf={isParticipantAlreadyRegistered}
                            recordsForReplacing={driversForReplacing}
                          />
                          {currentRequest?.status.step === 1 && (
                            <Button
                              variant="dark"
                              onClick={saveDrivers}
                              style={{ margin: 'auto' }}
                              {...(!canSaveDrivers ? { disabled: 'true' } : {})}>
                              Guardar
                            </Button>
                          )}
                        </React.Fragment>
                      ) : allDrivers && allDrivers.length > 0 ? (
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
                            {allDrivers.length &&
                              allDrivers.map((driver, idx) => {
                                return (
                                  <SingleDriver
                                    currentRequest={driver}
                                    key={idx}
                                    requestId={requestId}
                                    status={currentRequest.status.step}
                                  />
                                );
                              })}
                          </tbody>
                        </Table>
                      ) : (
                        ''
                      )}
                    </Tab> */}

                    <Tab eventKey="options" title={<TiCogOutline />}>
                      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row className="mt-2">
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              <Nav.Item>
                                <Nav.Link eventKey="first">
                                  <TiCogOutline /> General
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="second">
                                  <MdHelpOutline /> Ayuda
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <Tab.Pane eventKey="first">
                                <Row>
                                  <Col md={12}>
                                    {/* <p>
                                      Recuerda que puedes cancelar sin penalidad{' '}
                                      <strong>
                                        hasta{' '}
                                        {cancelationPriority(
                                          currentRequest.municipality.service_priority
                                        )}{' '}
                                        horas antes
                                      </strong>{' '}
                                      del evento. Ten en cuenta que estos valores pueden cambiar
                                      dependiendo del lugar de la solicitud.
                                      <br />
                                      <br />
                                      Luego de este plazo se te cargaran{' '}
                                      <strong>
                                        {currentRequest.service.penalty_rides} rides de penalidad
                                      </strong>{' '}
                                      por este servicio.
                                      <br />
                                    </p> */}
                                    {/* {canBeCanceled(currentRequest.start_time) &&
                                    userInfo.profile === 2 ? (
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        // disabled={
                                        //   currentRequest.status.step !== 1 ? true : false
                                        // }
                                        onClick={() => handleCancelEvent(penaltyRides)}>
                                        Cancelar solicitud
                                      </Button>
                                    ) : (
                                      ''
                                    )} */}
                                  </Col>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                <Row className="mt-2">
                                  <Col md={12}>
                                    <div className="row">
                                      <div className="col-12 text-center">
                                        <p className="p-2 text-muted">
                                          Si tienes unca solicitud, o no encuentras la respuesta a
                                          tus dudas, ponte en contacto con nosotos!
                                        </p>
                                      </div>
                                      <div className="fucki">
                                        <div className="help-icon border">
                                          <span className="text-muted ">
                                            <MdLocalPhone />
                                          </span>
                                          <h5>+ (319) 242 1712</h5>
                                          <p className="text-muted font-medium-1">
                                            {' '}
                                            Disponibles 24*7. Estaremos felices de ayudar
                                          </p>
                                        </div>
                                        <div className="help-icon border">
                                          <span className="text-muted">
                                            <FaEnvelope />
                                          </span>
                                          <h5>
                                            <a href="sdelrio@ridepro.co">sdelrio@ridepro.co</a>
                                          </h5>
                                          <p className="text-muted font-medium-1">
                                            La manera mas rapida de respuesta.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Tab>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <ControlsSection /> */}
      </Row>
    </section>
  );
}
