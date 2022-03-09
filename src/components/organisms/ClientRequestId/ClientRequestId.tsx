import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Nav, Tab, Tabs } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import { MdHelpOutline, MdLocalPhone, MdWarning } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { SingleRequestContext } from '../../../contexts';
import { PERFIL_CLIENTE } from '../../../utils';
import { TiCogOutline } from 'react-icons/ti';
import { HeaderSection } from './HeaderSection/HeaderSection';
import { SubHeaderSection } from './SubHeaderSection/SubHeaderSection';
import './ClientRequestId.scss';
import { PlaceTab } from './PlaceTab/PlaceTab';

export interface IClientRequestIdProps {}

export function ClientRequestId(props: IClientRequestIdProps) {
  const [defaultTab, setDefaultTab] = useState('participants');
  const { requestId } = useParams() as any;
  const { currentRequest, getRequestInstructors, getRequestDrivers } =
    useContext(SingleRequestContext);

  const getInstructorsAndDrivers = async () => {
    await getRequestInstructors(currentRequest.id);
    await getRequestDrivers(currentRequest.drivers);
  };

  useEffect(() => {
    if (currentRequest) getInstructorsAndDrivers();
    //eslint-disable-next-line
  }, [currentRequest]);

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
                    {currentRequest.status.step ===
                      PERFIL_CLIENTE.steps.STATUS_CONFIRMAR_PROGRAMACION.step[0] && (
                      <Tab
                        eventKey="place"
                        title={
                          <span className="text-danger">
                            <MdWarning /> Lugar y Fecha
                          </span>
                        }>
                        <PlaceTab currentRequest={currentRequest} />
                      </Tab>
                    )}

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
