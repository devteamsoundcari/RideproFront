import swal from 'sweetalert';
import React, { useEffect, useContext, useState } from 'react';
import { CardGroup, Col } from 'react-bootstrap';
import { ILineService, ServiceContext } from '../../../contexts';
import { ServiceLineCard, ModalSelectService } from '../../molecules';
import './TabSelectService.scss';

export interface ITabSelectServiceProps {}

export function TabSelectService(props: ITabSelectServiceProps) {
  const [selectedLineService, setSelectedLineService] = useState<ILineService | null>(null);
  const { getLineServices, lineServices, getServices, services } = useContext(ServiceContext);

  const fetchLineServices = async () => {
    try {
      await getLineServices();
    } catch (error) {
      swal('Error', 'No se pudo cargar los servicios', 'error');
    }
  };

  const fetchServices = async () => {
    try {
      await getServices();
    } catch (error) {
      swal('Error', 'No se pudo cargar los servicios', 'error');
    }
  };

  useEffect(() => {
    fetchLineServices();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardGroup className="select-service">
      {lineServices.map((line) => (
        <Col md={4} key={line.id}>
          <ServiceLineCard data={line} setSelected={(line) => setSelectedLineService(line)} />
        </Col>
      ))}
      {selectedLineService && (
        <ModalSelectService
          services={services}
          lineService={selectedLineService}
          handleClose={() => setSelectedLineService(null)}
        />
      )}
    </CardGroup>
  );
}
