import React, { useContext, useEffect, useState } from 'react';
import {
  getLineServices,
  getServices,
  getCompanyPortfolio
} from '../../../controllers/apiRequests';
import { AuthContext } from '../../../contexts/AuthContext';
import ServiceLine from './ServiceLine/ServiceLine';
import { Container, Row } from 'react-bootstrap';

const SetServiceLines = (props) => {
  const [lineServices, setLineServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const { userInfoContext } = useContext(AuthContext);
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

  useEffect(() => {
    async function fetchCompanyPortfolio(url) {
      const responsePortfolio = await getCompanyPortfolio(
        url,
        userInfoContext.company.id
      );
      const services = responsePortfolio.results.map(
        ({ line_service }) => line_service
      );
      setPortfolio((oldArr) => oldArr.concat(services));
      if (responsePortfolio.next) {
        return await fetchCompanyPortfolio(responsePortfolio.next);
      }
    }
    fetchCompanyPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchServices = async (url) => {
      const responseServices = await getServices(url);
      responseServices.results.forEach((item) => {
        setServices((oldArr) => [...oldArr, item]);
      });
      if (responseServices.next) {
        return await fetchServices(responseServices.next);
      }
    };
    fetchServices();
  }, []);

  // =============================== SET SERVICE ==================================================
  const handleClick = (service) => {
    props.setService(service);
  };

  return (
    <Container className="mt-5 text-center setService">
      <Row>
        {portfolio.length > 0
          ? portfolio.map((line, idx) => {
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
            })
          : lineServices.map((line, idx) => {
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
