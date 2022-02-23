import React from 'react';
import logo from '../../../assets/img/logo.png';
import { Row, Card, Form } from 'react-bootstrap';
import { dateDDMMYYYnTime } from '../../../utils';
import { COMPANY_NAME } from '../../../utils/constants';

export interface ITabCheckoutProps {
  createdAt?: Date;
  service?: any;
  place?: any;
  date?: any;
  participants?: any;
  credits?: any;
  userInfo?: any;
}

export function TabCheckout({
  createdAt,
  service,
  place,
  date,
  participants,
  credits,
  userInfo
}: ITabCheckoutProps) {
  return (
    <Card className="pl-5 pr-3">
      <div className="py-5 text-center">
        <img className="d-block mx-auto " src={logo} alt="logo" />
      </div>
      <Row>
        <div className="col-md-12 order-md-1">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Tu orden</span>
            <span className="badge badge-secondary badge-pill">
              ${participants.length * service?.ride_value}
            </span>
          </h4>
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Nombre del servicio</h6>
                <small className="text-muted">{service?.name}</small>
              </div>
              <span className="text-muted">--</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Lugar</h6>
                <small className="text-muted">
                  {place?.city?.name} - {place?.department?.name} - {place?.track?.name}
                </small>
              </div>
              <span className="text-muted">--</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Fecha y hora</h6>
                <small className="text-muted">{dateDDMMYYYnTime(date)}</small>
              </div>
              <span className="text-muted">--</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Participantes</h6>
                <small className="text-muted">{participants.length} participantes</small>
              </div>
              <span className="text-muted">x{participants.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between bg-light">
              <div className="text-success">
                <h6 className="my-0">Valor</h6>
                <small>Por {service?.service_type}</small>
              </div>
              <span className="text-success">${service?.ride_value}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Total (CREDITOS)</span>
              <strong>${participants.length * service?.ride_value}</strong>
            </li>
          </ul>

          <h4 className="mb-3 mt-4">
            <span className="text-muted">Forma de pago</span>
          </h4>

          <div className="d-block my-3">
            <div className="custom-control custom-radio">
              <input
                id="credit"
                name="paymentMethod"
                type="radio"
                className="custom-control-input"
                checked
                required
              />
              <label className="custom-control-label" htmlFor="credit">
                Creditos de {COMPANY_NAME}
              </label>
            </div>
          </div>

          <hr className="mb-4" />
          <h4 className="mb-3 ">
            <span className="text-muted">Comentarios adicionales</span>
          </h4>

          <form className="needs-validation" noValidate>
            <Form.Control
              as="textarea"
              rows={2}
              value={''}
              //  onChange={handleComment}
              className="mb-3"
            />

            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="same-address" />
              <label className="custom-control-label" htmlFor="same-address">
                Acepto los terminos y condiciones de cancelación
              </label>
            </div>

            <hr className="mb-4" />
            <button className="btn btn-primary btn-lg btn-block" type="submit">
              Finalizar
            </button>
          </form>
        </div>
      </Row>
    </Card>
  );
}
