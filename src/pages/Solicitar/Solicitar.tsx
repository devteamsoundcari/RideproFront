import React, { useState, useContext, useEffect } from 'react';
import { Col, Tab, Nav, Row, Badge } from 'react-bootstrap';
import { CustomCard } from '../../components/molecules';
import {
  TabSelectPlace,
  TabSelectService,
  TabSelectDate,
  TabAddParticipants,
  TabCheckout
} from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { ServiceContext, AuthContext } from '../../contexts';
import './Solicitar.scss';
import { dateWithTime } from '../../utils';

export interface ISolicitarProps {}

export function Solicitar(props: ISolicitarProps) {
  const { userInfo } = useContext(AuthContext);
  const { selectedService, selectedPlace, selectedDate, serviceParticipants } =
    useContext(ServiceContext);
  const [key, setKey] = useState('service');

  useEffect(() => {
    if (selectedService) {
      setKey('place');
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedPlace?.department && selectedPlace?.city && selectedPlace?.track) {
      setKey('date');
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (selectedDate) setKey('participants');
  }, [selectedDate]);

  const styleStep = (stepNumber: number, condition: any) => {
    if (condition) {
      return "content: '\u2713'; background-color: var(--success); color: #fff; border: 3px solid #fff";
    }
    return `content: '${stepNumber}';`;
  };

  const css = `
  .steps-nav .nav-item:nth-child(2):before {
    ${styleStep(1, selectedService)}
  }
  .steps-nav .nav-item:nth-child(3):before {
    ${styleStep(2, selectedPlace?.department && selectedPlace?.city && selectedPlace?.track)}
  }
  .steps-nav .nav-item:nth-child(4):before {
    ${styleStep(3, selectedDate)}
  }
  .steps-nav .nav-item:nth-child(5):before {
    ${styleStep(4, serviceParticipants.length > 0)}
  }
  .steps-nav .nav-item:nth-child(6):before {
    ${styleStep(5, false)}
  }
`;

  return (
    <MainLayout>
      <style>{css}</style>
      <CustomCard title="Solicitar servicios" hideHeader bodyPadding="0">
        <Tab.Container
          id="solicitar-steps"
          defaultActiveKey={key}
          activeKey={key}
          onSelect={(k: any) => setKey(k)}>
          <Row>
            <Col md={8} sm={12} className="p-0">
              <Tab.Content>
                <Tab.Pane eventKey="service">
                  <TabSelectService />
                </Tab.Pane>
                <Tab.Pane eventKey="place">{selectedService && <TabSelectPlace />}</Tab.Pane>
                <Tab.Pane eventKey="date">
                  {selectedPlace?.department && selectedPlace?.city && selectedPlace?.track && (
                    <TabSelectDate />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="participants">
                  <TabAddParticipants />
                </Tab.Pane>
                <Tab.Pane eventKey="checkout">
                  <TabCheckout
                    createdAt={new Date()}
                    service={selectedService}
                    place={selectedPlace}
                    userInfo={userInfo}
                    participants={serviceParticipants}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
            <Col
              md={4}
              sm={12}
              className="d-flex align-items-center justify-content-center steps-container">
              <Nav variant="pills" className="steps-nav">
                <div className="mb-3 text-center">
                  <h2>Solicitar Servicio</h2>
                </div>
                <Nav.Item>
                  <Nav.Link eventKey="service">
                    <strong>Servicio</strong>
                    <span className="text-white font-italic">
                      {selectedService ? selectedService.name : 'Selecciona un servicio'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="place" disabled={!selectedService}>
                    <strong>Lugar</strong>
                    <span className="text-white font-italic">
                      {selectedPlace?.department && selectedPlace?.city && selectedPlace?.track
                        ? `${selectedPlace?.track?.name}, ${selectedPlace?.city?.name}, ${selectedPlace.department?.name}`
                        : 'Selecciona un lugar'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="date"
                    disabled={
                      !selectedPlace?.department || !selectedPlace?.city || !selectedPlace?.track
                    }>
                    <strong>Fecha</strong>
                    <span className="text-light font-italic">
                      {selectedDate ? dateWithTime(selectedDate) : 'Selecciona una fecha'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="participants" disabled={!selectedDate}>
                    <strong>Participantes</strong>
                    <span className="text-white font-italic">
                      {serviceParticipants.length > 0
                        ? `${serviceParticipants.length} participantes`
                        : 'Agrega participantes'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="checkout" disabled={!serviceParticipants.length}>
                    <strong>
                      Checkout{' '}
                      {serviceParticipants.length > 0 && (
                        <Badge variant="warning">{'\u2713'}</Badge>
                      )}
                    </strong>
                    <span className="text-white font-italic">Completar el servicio</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
        </Tab.Container>
      </CustomCard>
      {/* {showModal && (
        <ServiceConfirmationModal
          show={true}
          setShow={(e) => setShowModal(e)}
          service={service}
          date={date}
          place={place}
          rides={rides}
        />
      )} */}
    </MainLayout>
  );
}
