import React, { useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import "./Service.scss";

interface Props {
  service: any;
  handleClick: (service: any) => any;
  userInfoContext: any;
}

const Service: React.FC<Props> = ({
  service,
  handleClick,
  userInfoContext,
}) => {
  const { id, name, ride_value, service_type, description } = service;
  const [showAll, setShowAll] = useState(false);

  const handleClickService = (e: any, service: any) => {
    const companyCreds = userInfoContext.company.credit;
    const serviceCreds = service.ride_value;
    if (companyCreds >= serviceCreds) {
      e.target.parentNode.parentNode.parentNode.childNodes.forEach((e: any) =>
        e.classList.remove("card-service-active")
      );
      document.getElementById(service.id)?.classList.add("card-service-active");
      handleClick(service);
    } else {
      alert("Creditos insuficientes");
    }
  };

  return (
    <Card className="mb-4 box-shadow card-service" key={id} id={id}>
      <div className="card-header">
        <h5 className="my-0 font-weight-normal">{name}</h5>
      </div>
      <div className="card-body d-flex justify-content-center flex-column">
        <h3 className="card-title pricing-card-title">
          ${ride_value} <small className="text-muted">/ {service_type}</small>
        </h3>
        {description.length > 100 && !showAll ? (
          <p>
            {`${description.substring(0, 100)}... `}
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => setShowAll(!showAll)}
            >
              ver más
            </strong>
          </p>
        ) : description.length < 100 ? (
          <p>{description}</p>
        ) : (
          <p>
            {description}
            <br />
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => setShowAll(!showAll)}
            >
              ver menos
            </strong>
          </p>
        )}
      </div>
      <Card.Footer className="text-muted">
        <button
          type="button"
          className="btn btn-lg btn-block btn-primary mb-2"
          onClick={(e) => handleClickService(e, service)}
        >
          Seleccionar
        </button>
        <Accordion>
          <Accordion.Toggle as={Button} variant="link" eventKey="1">
            <small>Ver condiciones</small>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <small className="text-muted">{service.requirements}</small>
          </Accordion.Collapse>
        </Accordion>
      </Card.Footer>
    </Card>
  );
};

export default Service;
