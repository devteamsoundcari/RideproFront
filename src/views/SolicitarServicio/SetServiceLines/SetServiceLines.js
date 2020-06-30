import React, { useEffect, useState } from "react";
import { getLineServices, getServices } from "../../../controllers/apiRequests";
import ServiceLine from "./ServiceLine/ServiceLine";
import { Container, Row } from "react-bootstrap";

const SetServiceLines = (props) => {
  //   const { userInfoContext } = useContext(AuthContext);
  const [lineServices, setLineServices] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchLineServices() {
      const responseLine = await getLineServices();
      setLineServices(responseLine);
    }
    fetchLineServices();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      const responseServices = await getServices();
      setServices(responseServices);
    }
    fetchServices();
  }, []);

  // =============================== SET SERVICE ==================================================
  const handleClick = (service) => {
    props.setService(service);
  };

  return (
    <Container className="mt-5 text-center setService">
      <Row>
        {lineServices.map((line, idx) => {
          return (
            <div className="col-xl-4 col-md-6 col-sm-12">
              <ServiceLine
                key={idx}
                line={line}
                services={services}
                handleClick={handleClick}
              />
              ;
            </div>
          );
        })}
      </Row>
    </Container>
  );
};

export default SetServiceLines;
