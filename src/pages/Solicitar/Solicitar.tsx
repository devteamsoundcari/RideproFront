import React, { useState } from 'react';
import { CardGroup, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { CustomCard, ServiceLineCard } from '../../components/molecules';
import { TabSelectService } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import mock from './mock.json';

export interface ISolicitarProps {}

export function Solicitar(props: ISolicitarProps) {
  const [key, setKey] = useState('paso1');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [place, setPlace] = useState('');
  const [rides, setRides] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <MainLayout>
      <CustomCard title="Solicitar servicios">
        <Tabs activeKey={key} onSelect={(k: any) => setKey(k)} className="nav-tabs-steps">
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
            {/* <SetPlace setPlace={handlePlace} /> */}
          </Tab>
          <Tab
            eventKey="paso3"
            title={
              <p>
                <span>3</span> Seleccionar fecha
              </p>
            }
            disabled={date ? false : true}>
            {/* {place && (
              <SetDate setDate={handleDate} afterSubmit={goToParticipantSelection} place={place} />
            )} */}
          </Tab>
          <Tab
            eventKey="paso4"
            title={
              <p>
                <span>4</span> Participantes
              </p>
            }
            disabled={place ? false : true}>
            {/* <SetParticipants setParticipants={handleParticipants} /> */}
          </Tab>
        </Tabs>
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
