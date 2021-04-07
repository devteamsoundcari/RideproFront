import React, { useEffect, useState } from 'react';
import { getLineServices, getServices } from '../../../controllers/apiRequests';
import ServiceLine from './ServiceLine/ServiceLine';
import { Container, Row } from 'react-bootstrap';

const SetServiceLines = (props) => {
  const [lineServices, setLineServices] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchLineServices(url) {
      const responseLine = await getLineServices(url);
      setLineServices((oldArr) => oldArr.concat(responseLine.results));
      if (responseLine.next) {
        return await fetchLineServices(responseLine.next);
      }
    }
    fetchLineServices();
  }, []);

  const fetchServices = async (url) => {
    const responseServices = await getServices(url);
    responseServices.results.forEach((item) => {
      setServices((oldArr) => [...oldArr, item]);
    });
    if (responseServices.next) {
      return await fetchServices(responseServices.next);
    }
  };

  useEffect(() => {
    fetchServices();
    //eslint-disable-next-line
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
            <div className="col-xl-4 col-md-6 col-sm-12" key={idx}>
              <ServiceLine
                key={idx}
                line={line}
                services={services}
                handleClick={handleClick}
              />
            </div>
          );
        })}
      </Row>
    </Container>
  );
};

export default SetServiceLines;
