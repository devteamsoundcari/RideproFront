import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ListGroup } from 'react-bootstrap';
import { FaDotCircle } from 'react-icons/fa';

type CalendarConventionsProps = any;

const CalendarConventions: React.FC<CalendarConventionsProps> = () => {
  const { userInfo } = useContext(AuthContext);
  return (
    <React.Fragment>
      {userInfo.profile === 2 || userInfo.profile === 7 ? ( // Cliente y supercliente
        <React.Fragment>
          <ListGroup.Item>
            <FaDotCircle className="text-event-requested" />{' '}
            <small>SERVICIOS SOLICITADOS</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-confirm-event" />{' '}
            <small>CONFIRMAR PROGRAMACIÓN</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-confirmed" />{' '}
            <small>SERVICIO PROGRAMADO</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-finished" />{' '}
            <small>SERVICIO TERMINADO</small>
          </ListGroup.Item>
        </React.Fragment>
      ) : userInfo.profile === 5 ? ( // Tecnico
        <React.Fragment>
          <ListGroup.Item>
            <FaDotCircle className="text-event-requested" />{' '}
            <small>ESPERANDO CONFIRMACIÓN</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-confirm-event" />{' '}
            <small>ESPERANDO AL CLIENTE</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-confirmed" />{' '}
            <small>PROGRAMACIÓN ACEPATADA</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-upload-reports" />{' '}
            <small>GENERAR INFORMES</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-finished" />{' '}
            <small>FINALIZADO</small>
          </ListGroup.Item>
        </React.Fragment>
      ) : userInfo.profile === 1 ? ( // Admin
        <React.Fragment>
          <ListGroup.Item>
            <FaDotCircle className="text-event-requested" />{' '}
            <small>ESPERANDO CONFIRMACIÓN</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-confirm-event" />{' '}
            <small>ESPERANDO AL CLIENTE</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-confirmed" />{' '}
            <small>PROGRAMACIÓN ACEPATADA</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-confirm-docs" />{' '}
            <small>ESPERANDO RECEPCIÓN DE DOCUMENTOS</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-upload-reports" />{' '}
            <small>ADJUNTAR FACTURA</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-finished" />{' '}
            <small>FINALIZADO</small>
          </ListGroup.Item>
        </React.Fragment>
      ) : (
        // Operaciones y admin
        <React.Fragment>
          <ListGroup.Item>
            <FaDotCircle className="text-event-requested" />{' '}
            <small>ESPERANDO CONFIRMACIÓN</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-confirm-event" />{' '}
            <small>ESPERANDO AL CLIENTE</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-confirmed" />{' '}
            <small>PROGRAMACIÓN ACEPATADA</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-confirm-docs" />{' '}
            <small>CONFIRMAR DOCUMENTOS</small>
          </ListGroup.Item>
          <ListGroup.Item>
            <FaDotCircle className="text-event-finished" />{' '}
            <small>FINALIZADO</small>
          </ListGroup.Item>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default CalendarConventions;
