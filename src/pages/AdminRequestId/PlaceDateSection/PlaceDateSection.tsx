import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { AuthContext } from '../../../contexts/AuthContext';
import { GOOGLE_MAPS_SEARCH } from '../../../utils';
import { dateAMPM, dateDDMMYYY } from '../../../utils';

interface PlaceProps {
  municipality: any;
  track: any;
  date: any;
  title: string;
}

const PlaceDateSection: React.FC<PlaceProps> = ({
  municipality,
  track,
  date,
  title
}) => {
  const { userInfo } = useContext(AuthContext);

  const renderPlace = () => (
    <Row>
      <div className="col-2 mt-1">
        <h6 className="invoice-from">Ciudad</h6>
        <div className="mb-1">
          <span>{municipality?.name}</span>
        </div>
        <div className="mb-1">
          <span>{municipality?.department?.name}</span>
        </div>
      </div>
      {track ? (
        <React.Fragment>
          <div className="col-3 mt-1">
            {track?.latitude &&
            track?.latitude !== 'na' &&
            track?.longitude &&
            track.longitude !== 'na' ? (
              <a
                target="n_blank"
                className="m-0 p-0 track-link"
                href={`${GOOGLE_MAPS_SEARCH}${track?.latitude},${track?.longitude}`}>
                Pista <FaExternalLinkAlt />
              </a>
            ) : (
              <h6 className="invoice-to">Pista</h6>
            )}
            <div className="mb-1">
              <span>{track?.name}</span>
            </div>
            <div className="mb-1">
              <span>{track?.address}</span>
            </div>
            <div className="mb-1">
              <span>{track?.description}</span>
            </div>
          </div>
          <div className="col-3 mt-1">
            <h6 className="invoice-to">Contacto</h6>
            <div className="mb-1">
              <span>{track?.contact_name}</span>
            </div>
            <div className="mb-1">
              <span>{track?.contact_email}</span>
            </div>
            <div className="mb-1">
              <span>{track?.cellphone}</span>
            </div>
            <div className="mb-1">
              <span>
                {track?.company.id !== userInfo.company.id ? (
                  <small className="text-danger">
                    (Pista creada por el cliente)
                  </small>
                ) : (
                  <small>
                    <strong>Tarifa: </strong>${track?.fare}
                  </small>
                )}
              </span>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <Col md={6} className="mt-1 text-center">
          <h6 className="invoice-from">Lugar</h6>
          <div className="mb-1">
            <span>Esta solicitud no tiene lugar</span>
          </div>
        </Col>
      )}
      <Col md={4} className="mt-1">
        <Row>
          <div className="col-6 mt-1">
            <h6 className="invoice-to">Fecha</h6>
            <div className="mb-1">
              <span>{date && dateDDMMYYY(date)}</span>
            </div>
          </div>
          <div className="col-6 mt-1">
            <h6 className="invoice-to">Hora</h6>
            <div className="mb-1">
              <span>{date && dateAMPM(date)}</span>
            </div>
          </div>
        </Row>
      </Col>
    </Row>
  );
  return (
    <div className="row invoice-info">
      <Col md={12} className="mt-1">
        <h6 className="invoice-from text-center">Lugar / Fecha / Hora</h6>
        {title !== undefined && <h1>{title}</h1>}
        {renderPlace()}
      </Col>
    </div>
  );
};
export default PlaceDateSection;
