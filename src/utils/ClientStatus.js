import React from "react";

import { ProgressBar } from "react-bootstrap";

function ClientStatus({ step, width = "100%" }) {
  switch (step) {
    case 0:
      return (
        <div className="text-center" style={{ width: width }}>
          <small>Solicitud cancelada</small>
          <ProgressBar
            variant="event-canceled"
            now={100}
            label={`${100}%`}
            srOnly
          />
        </div>
      );
    case 1:
      return (
        <div className="text-center" style={{ width: width }}>
          <small>Esperando confirmación</small>
          <ProgressBar
            variant="event-requested"
            now={20}
            label={`${60}%`}
            srOnly
          />
        </div>
      );
    case 2:
      return (
        <div className="text-center" style={{ width: width }}>
          <small>Confirmar programación</small>
          <ProgressBar
            variant="confirm-event"
            now={40}
            label={`${60}%`}
            srOnly
          />
        </div>
      );
    case 3:
      return (
        <div className="text-center" style={{ width: width }}>
          <small>Servicio programado</small>
          <ProgressBar
            variant="event-confirmed"
            now={50}
            label={`${60}%`}
            srOnly
          />
        </div>
      );
    case 4:
      return (
        <div className="text-center" style={{ width: width }}>
          <small>Servicio programado</small>
          <ProgressBar
            variant="event-confirmed"
            now={50}
            label={`${60}%`}
            srOnly
          />
        </div>
      );

    default:
      return (
        <div className="text-center" style={{ width: width }}>
          <small>Servicio Finalizado</small>
          <ProgressBar
            variant="event-finished"
            now={100}
            label={`${100}%`}
            srOnly
          />
        </div>
      );
  }
}

export default ClientStatus;
