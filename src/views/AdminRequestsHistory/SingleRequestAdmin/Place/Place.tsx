import React, { useState } from "react";
import { Tabs, Tab, Col } from "react-bootstrap";

interface PlaceProps {
  municipality: any;
  track: any;
}

const Place: React.FC<PlaceProps> = ({ municipality, track }) => {
  const [key, setKey] = useState("home");

  const renderPlace = () => (
    <React.Fragment>
      <div className="col-4 mt-1">
        <h6 className="invoice-to">Lugar</h6>
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
      <div className="col-4 mt-1">
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
            {track?.fare === 0 ? "Pista creada por el cliente" : track?.fare}
          </span>
        </div>
      </div>
    </React.Fragment>
  );
  return (
    <div className="row invoice-info">
      <div className="col-2 mt-1">
        <h6 className="invoice-from">Ciudad</h6>
        <div className="mb-1">
          <span>{municipality?.name}</span>
        </div>
        <div className="mb-1">
          <span>{municipality?.department?.name}</span>
        </div>
      </div>

      <Col md={8}>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="home" title="Home">
            {track ? (
              renderPlace()
            ) : (
              <div className="col-4 mt-1">
                <h6 className="invoice-from">Lugar</h6>
                <div className="mb-1">
                  <span>Pendiente</span>
                </div>
              </div>
            )}
          </Tab>
          <Tab eventKey="profile" title="Profile">
            asd
          </Tab>
          <Tab eventKey="contact" title="Contact" disabled>
            asd
          </Tab>
        </Tabs>
      </Col>
    </div>
  );
};
export default Place;
