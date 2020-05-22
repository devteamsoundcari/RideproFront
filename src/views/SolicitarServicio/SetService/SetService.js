import React, { useContext, useState, useEffect } from "react";
import { getServices } from "../../../controllers/apiRequests";
import { AuthContext } from "../../../contexts/AuthContext";
import { Container } from "react-bootstrap";
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
    <Container className="mt-5">
      <div class="card-deck mb-3 text-center">
        {services.map((service) => {
          return (
            <Service
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
