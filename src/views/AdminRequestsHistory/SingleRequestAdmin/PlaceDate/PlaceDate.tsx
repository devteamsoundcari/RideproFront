import React from "react";
import { Row, Col } from "react-bootstrap";

interface PlaceProps {
  municipality: any;
  track: any;
  date: any;
  title: string;
}

const PlaceDate: React.FC<PlaceProps> = ({
  municipality,
  track,
  date,
  title,
}) => {
  const dateFormatter = (date: string) => {
    let d = new Date(date);
    const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(d);
    return `${month}/${day}/${year}`;
  };

  const formatAMPM = (startDate) => {
    let date = new Date(startDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minutes2 = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes2 + " " + ampm;
    return strTime;
  };

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
            <h6 className="invoice-to">Pista</h6>
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
                {track?.fare === 0
                  ? "Pista creada por el cliente"
                  : track?.fare}
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
              <span>{date ? dateFormatter(date) : ""}</span>
            </div>
          </div>
          <div className="col-6 mt-1">
            <h6 className="invoice-to">Hora</h6>
            <div className="mb-1">
              <span>{date ? formatAMPM(date) : ""}</span>
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
export default PlaceDate;
