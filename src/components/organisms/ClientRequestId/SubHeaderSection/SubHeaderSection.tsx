import React from 'react';
import { Row, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { dateDDMMYYY, dateAMPM, COMPANY_NAME } from '../../../../utils';
import { PERFIL_CLIENTE } from '../../../../utils/constants';

export interface ISubHeaderSectionProps {
  currentRequest: any;
}

export function SubHeaderSection({ currentRequest }: ISubHeaderSectionProps) {
  const renderTooltipTrack = (track) => {
    return (
      <Tooltip id={`button-${track.name}`}>
        {track.name}
        <br />
        {track.address}
        <br />
        {track.municipality.name}
        <br />
        {track.municipality.department.name}
      </Tooltip>
    );
  };

  return (
    <Row className="invoice-info">
      <div className="col-6 mt-1">
        <h6 className="invoice-from">Detalle</h6>
        <div className="mb-1">
          <span>
            Fecha: {currentRequest?.start_time ? dateDDMMYYY(currentRequest.start_time) : ''}{' '}
            {currentRequest?.status.step <
            PERFIL_CLIENTE.steps.STATUS_SERVICIO_PROGRAMADO.step[0] ? (
              <small>(Pendiente por confirmar)</small>
            ) : (
              ''
            )}
          </span>
        </div>
        <div className="mb-1">
          <span>
            Hora: {currentRequest?.start_time ? dateAMPM(currentRequest.start_time) : ''}{' '}
            {currentRequest?.status.step <
            PERFIL_CLIENTE.steps.STATUS_SERVICIO_PROGRAMADO.step[0] ? (
              <small>(Pendiente por confirmar)</small>
            ) : (
              ''
            )}
          </span>
        </div>
        <div className="mb-1">
          <span>Lugar: </span>
          {currentRequest ? (
            currentRequest.track ? (
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipTrack(currentRequest.track)}>
                {currentRequest.track.latitude &&
                currentRequest.track.latitude !== 'na' &&
                currentRequest.track.longitude &&
                currentRequest.track.longitude !== 'na' ? (
                  <a
                    className="m-0 p-0 track-link"
                    target="n_blank"
                    href={`https://www.google.com/maps/search/?api=1&query=${currentRequest.track.latitude},${currentRequest.track.longitude}`}>
                    {currentRequest.track.name} <FaExternalLinkAlt />
                  </a>
                ) : (
                  <Button variant="link" className="m-0 p-0">
                    {currentRequest.track.name}
                  </Button>
                )}
              </OverlayTrigger>
            ) : (
              <small>Definido por {COMPANY_NAME} (Pendiente)</small>
            )
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="col-6 mt-1">
        <div className="comments">
          <p>Observaciones:</p>
          <div className="user-message">
            <div className="avatar">
              <img
                src={currentRequest ? currentRequest.customer.picture : ''}
                alt={currentRequest ? currentRequest.customer.first_name : 'customer-picture'}
                width="32"
                height="32"
              />
            </div>
            <div className="d-inline-block mt-25">
              <h6 className="mb-0 text-bold-500">
                {currentRequest ? currentRequest.customer.first_name : ''}{' '}
                {currentRequest ? currentRequest.customer.last_name : ''}
              </h6>
              <p className="text-muted mt-1">
                <small>{currentRequest ? currentRequest.accept_msg : ''}</small>
              </p>
            </div>
          </div>
          {currentRequest &&
          currentRequest.status.step === PERFIL_CLIENTE.steps.STATUS_CANCELADO.step[0] ? (
            <div className="user-message">
              <div className="avatar">
                <img
                  src={currentRequest ? currentRequest.customer.picture : ''}
                  alt={currentRequest ? currentRequest.customer.first_name : 'customer-picture'}
                  width="32"
                  height="32"
                />
              </div>
              <div className="d-inline-block mt-25">
                <h6 className="mb-0 text-bold-500">
                  {currentRequest ? currentRequest.customer.first_name : ''}{' '}
                  {currentRequest ? currentRequest.customer.last_name : ''}
                </h6>
                <p className="text-muted mt-1">
                  <small>{currentRequest ? currentRequest.reject_msg : ''}</small>
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Row>
  );
}
