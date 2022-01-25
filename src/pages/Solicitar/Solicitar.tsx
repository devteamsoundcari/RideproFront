import React, { useState, useContext, useEffect } from 'react';
import { Col, Tab, Nav, Row } from 'react-bootstrap';
import { CustomCard } from '../../components/molecules';
import {
  TabSelectPlace,
  TabSelectService,
  TabSelectDate,
  TabAddParticipants
} from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { ServiceContext } from '../../contexts';
import swal from 'sweetalert';
import './Solicitar.scss';
import { dateWithTime } from '../../utils';

export interface ISolicitarProps {}

export function Solicitar(props: ISolicitarProps) {
  const { selectedService, selectedPlace, selectedDate } = useContext(ServiceContext);
  const [key, setKey] = useState('date');

  useEffect(() => {
    if (selectedService) {
      setKey('place');
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedPlace?.department && selectedPlace?.city && selectedPlace?.track) {
      swal(
        'Lugar seleccionado',
        `${selectedPlace?.track?.name}, ${selectedPlace?.city?.name}, ${selectedPlace.department?.name}`,
        'success'
      );
      setKey('date');
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (selectedDate) {
      swal('Fecha seleccionada', `${dateWithTime(selectedDate)}`, 'success');
      setKey('participants');
    }
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
  .nav-item:nth-child(5):before {
    content: "4";
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
                <Tab.Pane eventKey="place">
                  <TabSelectPlace />
                </Tab.Pane>
                <Tab.Pane eventKey="date">
                  <TabSelectDate />
                </Tab.Pane>
                <Tab.Pane eventKey="participants">
                  <TabAddParticipants />
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
                  <Nav.Link eventKey="place">
                    <strong>Lugar</strong>
                    <span className="text-white font-italic">
                      {selectedPlace?.department && selectedPlace?.city && selectedPlace?.track
                        ? `${selectedPlace?.track?.name}, ${selectedPlace?.city?.name}, ${selectedPlace.department?.name}`
                        : 'Selecciona un lugar'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="date">
                    <strong>Fecha</strong>
                    <span className="text-light font-italic">
                      {selectedDate ? dateWithTime(selectedDate) : 'Selecciona una fecha'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="participants">
                    <strong>Participantes</strong>
                    <span className="text-white font-italic">Añade participantes</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
        </Tab.Container>
        {/* ================================================== */}
        {/* <Tabs activeKey={key} onSelect={(k: any) => setKey(k)}>
          <Tab
            eventKey="paso1"
            title={
              <p>
                <span>1</span> Seleccionar servicio
              </p>
            }>
            <TabSelectService />
          </Tab>
          <Tab
            eventKey="paso2"
            title={
              <p>
                <span>2</span> Seleccionar lugar
              </p>
            }
            disabled={service ? false : true}>
     
          </Tab>
          <Tab
            eventKey="paso3"
            title={
              <p>
                <span>3</span> Seleccionar fecha
              </p>
            }
            disabled={date ? false : true}>
     
          </Tab>
          <Tab
            eventKey="paso4"
            title={
              <p>
                <span>4</span> Participantes
              </p>
            }
            disabled={place ? false : true}>

          </Tab>
        </Tabs> */}
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
