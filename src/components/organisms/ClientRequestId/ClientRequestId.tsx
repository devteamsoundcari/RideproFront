import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Nav, Tab, Tabs, Button } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import { MdHelpOutline, MdLocalPhone, MdPeople, MdWarning } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { SingleRequestContext, AuthContext } from '../../../contexts';
import { PERFIL_CLIENTE } from '../../../utils';
import { TiCogOutline } from 'react-icons/ti';
import { HeaderSection } from './HeaderSection/HeaderSection';
import { SubHeaderSection } from './SubHeaderSection/SubHeaderSection';
import './ClientRequestId.scss';
import { PlaceTab } from './PlaceTab/PlaceTab';
import { ParticipantsTab } from './ParticipantsTab/ParticipantsTab';
import { COMPANY_EMAIL, COMPANY_PHONE_NUMBER } from '../../../utils/constants';
import ControlsSection from '../AdminRequestId/ControlsSection/ControlsSection';
import swal from 'sweetalert';

export interface IClientRequestIdProps {}

export function ClientRequestId(props: IClientRequestIdProps) {
  const [defaultTab, setDefaultTab] = useState('participants');
  const { userInfo } = useContext(AuthContext);
  const { requestId } = useParams() as any;
  const [penaltyCredits, setPenaltyCredits] = useState(0);
  const { currentRequest, getRequestInstructors, getRequestDrivers } =
    useContext(SingleRequestContext);

  const getInstructorsAndDrivers = async () => {
    await getRequestInstructors(currentRequest.id);
    await getRequestDrivers(currentRequest.drivers);
  };

  // ================ Set penalty credits ==================
  useEffect(() => {
    if (currentRequest) {
      const eventDate: any = new Date(currentRequest.start_time);
      const now: any = new Date();
      const diffHours = Math.floor(Math.abs(eventDate - now) / 36e5);
      const hoursPriority = cancellationPriorityHours(currentRequest.service.priority);
      if (diffHours <= hoursPriority) setPenaltyCredits(currentRequest.service.penalty_rides);
      else setPenaltyCredits(0);
    }
  }, [currentRequest]);

  useEffect(() => {
    if (currentRequest) {
      getInstructorsAndDrivers();
      if (
        // Set defaulTKey tab depending on status
        currentRequest.status.step === PERFIL_CLIENTE.steps.STATUS_CONFIRMAR_PROGRAMACION.step[0]
      )
        setDefaultTab('place');
      else setDefaultTab('participants');
    }
    //eslint-disable-next-line
  }, [currentRequest]);

  const cancellationPriorityHours = (priority) => {
    switch (priority) {
      case 0:
        return 5;
      case 1:
        return 7;
      default:
        return 9;
    }
  };

  const canBeCancel = (date) => {
    let eventTime = new Date(date);
    let now = new Date();
    return now >= eventTime || currentRequest.status.step === 0 ? false : true;
  };

  const cancelMessage = () => {
    if (penaltyCredits > 0)
      return `Cancelar este servicio te costara ${currentRequest.service.penalty_rides} creditos`;
    else return 'Cancelar este servicio no genera costo alguno.';
  };

  const handleCancelRequest = async () => {
    swal({
      title: 'Un momento!',
      text: `${cancelMessage()} ¿Estas seguro que deseas cancelar esta solicitud?`,
      icon: 'warning',
      buttons: ['No, volver', 'Si, estoy seguro'],
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        // setLoading(true);
        // let payload = {
        //   id: requestId,
        //   user: userInfoContext,
        //   companyId: userInfoContext.company.id,
        //   reject_msg: `Cancelado por el usuario ${
        //     penaltyRides ? `| Penalidad: $${penaltyRides} rides` : ''
        //   }`,
        //   newCredit:
        //     parseInt(userInfoContext.credit) + parseInt(data.spent_credit) - parseInt(penaltyRides)
        // };
        // const res = await cancelRequestId(payload);
        // if (res.canceled.status === 200 && res.refund.status === 200) {
        //   setUserInfoContext({
        //     ...userInfoContext,
        //     credit: res.refund.data.credit
        //   });
        //   swal('Listo! Esta solicitud ha sido cancelada', {
        //     icon: 'success'
        //   });
        //   setLoading(false);
        //   const payload = {
        //     id: res.canceled.data.id,
        //     template: 'canceled_request',
        //     subject: 'Solicitud cancelada ❌',
        //     to: userInfoContext.email,
        //     name: userInfoContext.name,
        //     date: res.canceled.data.start_time,
        //     refund_credits: res.canceled.data.spent_credit,
        //     service: res.canceled.data.service.name,
        //     municipality: {
        //       city: res.canceled.data.municipality.name,
        //       department: res.canceled.data.municipality.department.name
        //     }
        //   };
        //   await sendEmailMG(payload); // SEND SERVICE CANCELED EMAIL TO USER
        // } else {
        //   setLoading(false);
        //   swal('Ooops! No pudimos cancelar la solicitud', {
        //     icon: 'error'
        //   });
        // }
      }
    });
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

                    <Tab
                      eventKey="participants"
                      title={
                        <span>
                          <MdPeople /> Participantes
                        </span>
                      }
                      style={{ overflow: 'auto' }}>
                      <ParticipantsTab currentRequest={currentRequest} />
                    </Tab>

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
                                    <p>
                                      Recuerda que puedes cancelar sin penalidad{' '}
                                      <strong>
                                        hasta{' '}
                                        {cancellationPriorityHours(
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
                                        {currentRequest.service.penalty_rides} creditos de penalidad
                                      </strong>{' '}
                                      por este servicio.
                                      <br />
                                    </p>
                                    {canBeCancel(currentRequest.start_time) &&
                                    userInfo.profile === PERFIL_CLIENTE.profile ? (
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        disabled={currentRequest.status.step !== 1 ? true : false}
                                        onClick={() => handleCancelRequest()}>
                                        Cancelar solicitud
                                      </Button>
                                    ) : (
                                      ''
                                    )}
                                  </Col>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="second">
                                <Row className="mt-2">
                                  <Col md={12}>
                                    <div className="row">
                                      <div className="col-12 text-center">
                                        <p className="p-2 text-muted">
                                          Si tienes una solicitud, o no encuentras la respuesta a
                                          tus dudas, ponte en contacto con nosotros!
                                        </p>
                                      </div>
                                      <div className="fucki">
                                        <div className="help-icon border">
                                          <span className="text-muted ">
                                            <MdLocalPhone />
                                          </span>
                                          <h5>{COMPANY_PHONE_NUMBER}</h5>
                                          <p className="text-muted font-medium-1">
                                            {' '}
                                            Disponibles 24/7. Estaremos felices de ayudar
                                          </p>
                                        </div>
                                        <div className="help-icon border">
                                          <span className="text-muted">
                                            <FaEnvelope />
                                          </span>
                                          <h5>
                                            <a href="sdelrio@ridepro.co">{COMPANY_EMAIL}</a>
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
        <ControlsSection />
      </Row>
    </section>
  );
}
