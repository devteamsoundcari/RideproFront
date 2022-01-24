import React, { useState, useContext, useEffect } from 'react';
import { CardGroup, Col, Card, Tabs, Tab, Nav, Row, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CustomCard, ServiceLineCard } from '../../components/molecules';
import { TabSelectPlace, TabSelectService } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { ServiceContext, TracksContext } from '../../contexts';
import { useDropdown } from '../../utils';
import swal from 'sweetalert';
import './Solicitar.scss';

export interface ISolicitarProps {}

export function Solicitar(props: ISolicitarProps) {
  // const { userInfo } = useContext(AuthContext);
  const { selectedService, selectedPlace } = useContext(ServiceContext);

  const [key, setKey] = useState('service');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [place, setPlace] = useState('');
  const [rides, setRides] = useState(0);
  const [showModal, setShowModal] = useState(false);

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

  const styleStep = (stepNumber: number, condition: any) => {
    if (condition) {
      return "content: '\u2713'; background-color: #fff; color: var(--success); border: 3px solid var(--success);";
    }
    return `content: '${stepNumber}';`;
  };

  const css = `
  .steps-nav .nav-item:nth-child(2):before {
    ${styleStep(1, selectedService)}
  }
  .nav-item:nth-child(3):before {
    ${styleStep(2, selectedPlace?.department && selectedPlace?.city && selectedPlace?.track)}
  }
  .nav-item:nth-child(4):before {
    content: "3";
  }
  .nav-item:nth-child(5):before {
    content: "4";
  }
`;

  return (
    <MainLayout>
      <style>{css}</style>
      <CustomCard title="Solicitar servicios" hideHeader>
        <Tab.Container
          id="solicitar-steps"
          defaultActiveKey={key}
          activeKey={key}
          onSelect={(k: any) => setKey(k)}>
          <Row>
            <Col sm={9} className="">
              <Tab.Content>
                <Tab.Pane eventKey="service">
                  <TabSelectService />
                </Tab.Pane>
                <Tab.Pane eventKey="place">
                  <TabSelectPlace />
                </Tab.Pane>
                <Tab.Pane eventKey="date">date</Tab.Pane>
              </Tab.Content>
            </Col>
            <Col sm={3} className="d-flex align-items-center pl-1">
              <Nav variant="pills" className="steps-nav">
                <div className="mb-3 text-center">
                  <h2>Solicitar Servicio</h2>
                </div>
                <Nav.Item>
                  <Nav.Link eventKey="service">
                    <strong>Servicio</strong>
                    <span className="text-muted font-italic">
                      {selectedService ? selectedService.name : 'Selecciona un servicio'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="place">
                    <strong>Lugar</strong>
                    <span className="text-muted font-italic ">
                      {selectedPlace?.department && selectedPlace?.city && selectedPlace?.track
                        ? `${selectedPlace?.track?.name}, ${selectedPlace?.city?.name}, ${selectedPlace.department?.name}`
                        : 'Selecciona un lugar'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="date">
                    <strong>Fecha</strong>
                    <span className="text-muted font-italic ">Selecciona una fecha</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="participants">
                    <strong>Participantes</strong>
                    <span className="text-muted font-italic ">Añade participantes</span>
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
