import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./ServiceLine.scss";
import { Fade } from "react-awesome-reveal";
import { AiFillCar } from "react-icons/ai";
import {
  FaMotorcycle,
  FaTruckMoving,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";
import vehiclesImg from "../../../../assets/img/vehicles.png";

const ServiceLine = (props) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { name, description, short_description, image, id } = props.line;
  const [showServices, setShowServices] = useState(false);
  const [filteredServices, setFiltededServices] = useState([]);
  const { userInfoContext } = useContext(AuthContext);

  useEffect(() => {
    let filteredServices = props.services.filter((service) => {
      return service.line_service === id;
    });
    setFiltededServices(filteredServices);
  }, [props.services, id]);

  const handleClickService = (e, service) => {
    const companyCreds = userInfoContext.credit;
    const serviceCreds = service.ride_value;
    if (companyCreds >= serviceCreds) {
      let el = document.querySelectorAll(".list-group-item");
      el.forEach((e) => {
        e.classList.remove("card-service-active");
      });
      document.getElementById(service.id).classList.add("card-service-active");
      props.handleClick(service);
    } else {
      alert("Creditos insuficientes");
    }
  };

  const renderLineInfo = () => {
    return (
      <React.Fragment>
        <Fade>
          <div className="card-header">
            <h4>{name}</h4>
          </div>
          <div
            className="card-img-top"
            style={{
              background: `url(${image}) no-repeat center center`,
            }}
          ></div>
          <div className="card-body">
            <p className="card-text">
              {showFullDescription ? description : short_description}
              <span>
                <Button
                  variant="link"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Ver menos" : "Ver más"}
                </Button>
              </span>
            </p>
            <div
              className="card-img-bottom"
              style={{
                background: `url(${vehiclesImg})`,
              }}
            ></div>
            <button
              className="btn btn-primary"
              disabled={filteredServices.length > 0 ? false : true}
              onClick={() => setShowServices(!showServices)}
            >
              {showServices ? "Volver" : "Seleccionar"}
            </button>
          </div>
        </Fade>
      </React.Fragment>
    );
  };

  const renderServices = () => {
    return (
      <React.Fragment>
        <Fade>
          <div className="card-content">
            <div className="card-body">
              <h4 className="card-title">{name}</h4>
              <p>Por favor selecciona el tipo de vehiculo</p>
              <div className="list-group list-group-flush">
                {filteredServices.map((service) => {
                  return (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-${service.name}`}>
                          {service.description}
                          {/* Tooltip on <strong>asd</strong>. */}
                        </Tooltip>
                      }
                    >
                      <div
                        className="list-group-item border-0 d-flex"
                        onClick={(e) => handleClickService(e, service)}
                        id={service.id}
                      >
                        <div className="list-icon">
                          <Badge
                            variant="secondary"
                            className="badge-circle badge-circle-light-secondary bx bxl-instagram-alt mr-1 text-danger"
                          >
                            {service.name.toLowerCase().includes("auto") ? (
                              <AiFillCar />
                            ) : service.name.toLowerCase().includes("moto") ? (
                              <FaMotorcycle />
                            ) : (
                              <FaTruckMoving />
                            )}
                          </Badge>
                        </div>
                        <div className="list-content">
                          <h5>{service.name}</h5>
                          <div className="conventions">
                            <p>
                              <span>
                                <FaDollarSign />
                              </span>
                              {service.ride_value} x {service.service_type}
                            </p>
                            <p>
                              <span>
                                <FaClock />
                              </span>
                              {service.duration} min
                            </p>
                          </div>
                          {/* <p className="mb-0">{service.description}</p> */}
                        </div>
                      </div>
                    </OverlayTrigger>
                  );
                })}
                <button
                  className="btn btn-link"
                  onClick={() => setShowServices(!showServices)}
                >
                  {showServices ? "Volver" : "Seleccionar"}
                </button>
              </div>
            </div>
          </div>
        </Fade>
      </React.Fragment>
    );
  };

  return (
    <Card className="mb-4 box-shadow card-line-service">
      {showServices ? renderServices() : renderLineInfo()}
    </Card>
  );
};

export default ServiceLine;
