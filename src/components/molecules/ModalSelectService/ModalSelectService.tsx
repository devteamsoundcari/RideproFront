import React, { useEffect, useState, useContext } from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiFillCar } from 'react-icons/ai';
import {
  FaDollarSign,
  FaClock,
  FaMotorcycle,
  FaTruckLoading,
  FaTruckMoving,
  FaTruckPickup
} from 'react-icons/fa';
import swal from 'sweetalert';
import { IService, ILineService, AuthContext, ServiceContext } from '../../../contexts';
import { dateFromNow, useProfile } from '../../../utils';
import { CustomTable } from '../../organisms';
import './ModalSelectService.scss';

export interface IModalSelectServiceProps {
  services: IService[];
  lineService: ILineService;
  handleClose: () => void;
}

export function ModalSelectService({
  services,
  lineService,
  handleClose
}: IModalSelectServiceProps) {
  const { userInfo } = useContext(AuthContext) as any;
  const { selectedService, setSelectedService } = useContext(ServiceContext);
  const [profile] = useProfile();
  const [filteredServices, setFilteredServices] = useState<IService[]>([]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {lineService.description}
    </Tooltip>
  );

  // We should call the API to get the services

  useEffect(() => {
    let filteredServices = services.filter((service) => service.line_service === lineService.id);
    setFilteredServices(filteredServices);
  }, [services, lineService]);

  const getVehicleIcon = (vehicle: string) => {
    switch (true) {
      case vehicle.toLowerCase().includes('auto') || vehicle.toLowerCase().includes('carro'):
        return <AiFillCar />;
      case vehicle.toLowerCase().includes(' motocarro'):
        return <FaTruckPickup />;
      case vehicle.toLowerCase().includes(' montacarga'):
        return <FaTruckLoading />;
      case vehicle.toLowerCase().includes(' moto'):
        return <FaMotorcycle />;
      default:
        return <FaTruckMoving />;
    }
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Nombre',
      sort: false,
      classes: 'lg-column',
      headerClasses: 'lg-column',
      formatter: (row) => (
        <div className="name-formatter">
          <span>{getVehicleIcon(row)}</span>
          {row}
        </div>
      )
    },
    {
      dataField: 'ride_value',
      text: 'Valor',
      sort: false,
      classes: 'small-column',
      headerClasses: 'small-column',
      formatter: (cell, row) => (
        <span>
          <FaDollarSign />
          {cell} x {row.service_type}
        </span>
      )
    },
    {
      dataField: 'duration',
      text: 'Duración',
      sort: false,
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: (cell) => (
        <span>
          <FaClock /> {cell} min
        </span>
      )
    }
  ];

  const handleClick = (service: any) => {
    if (service.ride_value >= userInfo.credit) {
      swal('No tienes crédito suficiente', '', 'warning');
      return;
    } else {
      setSelectedService(service);
      handleClose();
      swal('Servicio seleccionado', `${service?.name} seleccionado`, 'success');
    }
  };

  return (
    <Modal show={true} onHide={handleClose} className="modal-new-track" size="lg">
      <Modal.Header closeButton className={`bg-${profile}`}>
        <OverlayTrigger placement="bottom" delay={{ show: 800, hide: 600 }} overlay={renderTooltip}>
          <Modal.Title className="text-white">{lineService.name}</Modal.Title>
        </OverlayTrigger>
      </Modal.Header>
      <Modal.Body>
        <CustomTable
          keyField="id"
          columns={columns}
          data={filteredServices}
          renderSearch={false}
          loading={false}
          showPagination={false}
          paginationSize={10}
          selectionMode="radio"
          onSelectRow={(row: any) => handleClick(row)}
          hideSelectColumn={false}
        />
        <small className="text-muted ">
          Actualizado{' '}
          {dateFromNow(selectedService ? selectedService.updated_at : lineService.updated_at)}
        </small>
      </Modal.Body>
    </Modal>
  );
}
