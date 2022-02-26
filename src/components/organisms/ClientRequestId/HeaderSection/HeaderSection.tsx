import React from 'react';
import { Row } from 'react-bootstrap';
import { dateDDMMYYYnTime } from '../../../../utils';
import { PERFIL_CLIENTE } from '../../../../utils/constants';

export interface IHeaderSectionProps {
  currentRequest: any;
  requestId: string;
}

export function HeaderSection({ currentRequest, requestId }: IHeaderSectionProps) {
  return (
    <>
      <Row>
        <div className="col-xl-4 col-md-12">
          <span className="invoice-number mr-50">Solicitud #</span>
          <span>{requestId}</span>
        </div>
        <div className="col-xl-8 col-md-12">
          <div className="d-flex align-items-center justify-content-xl-end flex-wrap">
            <div className="mr-3">
              <small className="text-muted">Fecha de creación: </small>
              <span>
                {currentRequest?.created_at && dateDDMMYYYnTime(currentRequest?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </Row>
      <Row className="my-3">
        <div className="col-6">
          <h4 className="text-primary">Solicitud</h4>
          <span>{currentRequest?.service?.name}</span>
          <br />
          <span className="text-capitalize">
            {currentRequest?.municipality?.name}
            {' - '}
            {currentRequest?.municipality?.department?.name}
          </span>
        </div>
        <div className="col-6 text-right pr-4 mt-4">
          <span>
            <strong>
              Creditos{' '}
              {PERFIL_CLIENTE.steps.STATUS_CANCELADO.step.includes(currentRequest?.status.step)
                ? 'reembolsados'
                : 'usados'}
              :
            </strong>{' '}
            ${currentRequest?.spent_credit}
          </span>
          <br />
          {currentRequest &&
          currentRequest.status.step >
            PERFIL_CLIENTE.steps.STATUS_CONFIRMAR_PROGRAMACION.step[0] ? (
            <span>
              <strong>Encargado:</strong>{' '}
              <span>{`${currentRequest.operator.first_name} ${currentRequest.operator.last_name}`}</span>
            </span>
          ) : (
            ''
          )}
        </div>
      </Row>
    </>
  );
}
