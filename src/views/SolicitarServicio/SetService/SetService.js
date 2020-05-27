import React, { useContext, useState, useEffect } from "react";
import { getServices } from "../../../controllers/apiRequests";
import { AuthContext } from "../../../contexts/AuthContext";
import { Container, Spinner } from "react-bootstrap";
// import { AiFillDollarCircle } from "react-icons/ai";
import Service from "./Service/Service";
import "./SetService.scss";

const SetService = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetcServices() {
      const response = await getServices();
      setServices(response);
    }
    fetcServices();
  }, []);

  // =============================== SET SERVICE ==================================================
  const handleClick = (service) => {
    props.setService(service);
  };

  return (
    <Container className="mt-5 text-center">
      {services.length === 0 && (
        <Spinner animation="border" role="status" className="mt-5">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      <div className="card-deck mb-3 text-center">
        {services.map((service, idx) => {
          return (
            <Service
              key={idx}
              service={service}
              handleClick={handleClick}
              userInfoContext={userInfoContext}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default SetService;
