import React from "react";
import { FaCheckCircle } from "react-icons/fa";

import { ProgressBar } from "react-bootstrap";

function TecnicoStatus({ step }) {
  switch (step) {
    case 0:
      return (
        <div className="text-center">
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
        <div className="text-center">
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
        <div className="text-center">
          <small>Esperando confirmación cliente</small>
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
        <div className="text-center">
          <small>Programación aceptada</small>
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
        <div className="text-center">
          <small>Confirmar recepción de documentos</small>
          <ProgressBar
            variant="event-confirmed"
            now={40}
            label={`${60}%`}
            srOnly
          />
        </div>
      );
    case 5:
      return (
        <div className="text-center">
          <small>Generar Informes</small>
          <ProgressBar
            variant="upload-reports"
            now={80}
            label={`${80}%`}
            srOnly
          />
        </div>
      );
    case 6:
      return (
        <div className="text-center">
          <small>
            Evento Finalizado <FaCheckCircle className="text-success" />
          </small>
          <ProgressBar
            variant="event-finished"
            now={100}
            label={`${100}%`}
            srOnly
          />
        </div>
      );
    default:
      return <p>Undefined</p>;
  }
}

export default TecnicoStatus;
