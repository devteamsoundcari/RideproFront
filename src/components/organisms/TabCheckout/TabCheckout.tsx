import React, { useContext } from 'react';
import { Row, Card, Form } from 'react-bootstrap';
import { dateDDMMYYYnTime } from '../../../utils';
import { COMPANY_NAME, PERFIL_CLIENTE } from '../../../utils/constants';
import { useForm } from 'react-hook-form';
import { checkoutSchema } from '../../../schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { ServiceContext, AuthContext } from '../../../contexts';

export interface ITabCheckoutProps {}

export function TabCheckout(props: ITabCheckoutProps) {
  const { userInfo } = useContext(AuthContext);

  const { selectedService, selectedPlace, selectedDate, serviceParticipants, createRequest } =
    useContext(ServiceContext);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(checkoutSchema)
  });

  const onSubmit = async ({ comments }) => {
    const payload = {
      service: selectedService.id,
      customer: userInfo.id,
      customerCredit: userInfo.credit,
      municipality: selectedPlace.city.id,
      selectedPlace: 'na',
      place: 'na',
      track: selectedPlace.track.id,
      start_time: selectedDate,
      finish_time: selectedDate,
      company: userInfo.company.id,
      spent_credit: serviceParticipants.length * selectedService?.ride_value,
      drivers: serviceParticipants.map((participant) => participant.id),
      accept_msg: comments === '' ? 'na' : comments,
      new_request: 1,
      fare_track: 0.0,
      operator: null,
      instructor: 'na',
      status: PERFIL_CLIENTE.steps.STATUS_ESPERANDO_CONFIRMACION.id,
      reject_msg: 'na'
    };
    try {
      const res = await createRequest(payload);
      console.log(res);
    } catch (err) {
      const error: any = err;
      swal('Error', error?.message, 'error');
    }
  };

  return (
    <Card className="pl-5 pr-3 pt-5">
      <Row>
        <div className="col-md-12 order-md-1">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Resumen de tu orden</span>
            <span className="badge badge-secondary badge-pill">
              ${serviceParticipants.length * selectedService?.ride_value}
            </span>
          </h4>
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Nombre del servicio</h6>
                <small className="text-muted">{selectedService?.name}</small>
              </div>
              <span className="text-muted">--</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Lugar</h6>
                <small className="text-muted">
                  {selectedPlace?.city?.name} - {selectedPlace?.department?.name} -{' '}
                  {selectedPlace?.track?.name}
                </small>
              </div>
              <span className="text-muted">--</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Fecha y hora</h6>
                <small className="text-muted">{dateDDMMYYYnTime(selectedDate)}</small>
              </div>
              <span className="text-muted">--</span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">Participantes</h6>
                <small className="text-muted">{serviceParticipants.length} participantes</small>
              </div>
              <span className="text-muted">x{serviceParticipants.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between bg-light">
              <div className="text-success">
                <h6 className="my-0">Valor</h6>
                <small>Por {selectedService?.service_type}</small>
              </div>
              <span className="text-success">${selectedService?.ride_value}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Total (CREDITOS)</span>
              <strong>${serviceParticipants.length * selectedService?.ride_value}</strong>
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
                defaultChecked
                required
              />
              <label className="custom-control-label pt-1" htmlFor="credit">
                Creditos de {COMPANY_NAME}
              </label>
            </div>
          </div>

          <hr className="mb-4" />
          <h4 className="mb-3 ">
            <span className="text-muted">Comentarios adicionales</span>
          </h4>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Control
              as="textarea"
              rows={2}
              name="comments"
              onChange={(e) => console.log(e.target.value)}
              className="mb-3"
              ref={register({
                required: false
              })}
            />
            {errors.comments && <small className="text-danger">{errors.comments.message}</small>}

            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="acceptTerms"
                name="acceptTerms"
                ref={register({
                  required: true
                })}
              />
              <label className="custom-control-label pt-1" htmlFor="acceptTerms">
                Acepto los terminos y condiciones de cancelación{' '}
              </label>
            </div>
            {errors.acceptTerms && (
              <small className="text-danger"> {errors.acceptTerms.message}</small>
            )}
            <hr className="mb-4" />
            <button className="btn btn-primary btn-lg btn-block" type="submit">
              Finalizar
            </button>
          </Form>
        </div>
      </Row>
    </Card>
  );
}
