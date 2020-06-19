import React, { useEffect, useState } from "react";
import RegisterNewProvider from "./Registration/RegisterNewProvider";
import { Row, Col } from "react-bootstrap";
import "./Providers.scss";
import AllProviders from "./Listing/AllProviders";
import { getProviders } from "../../controllers/apiRequests";


const ProvidersView = () => {
  const [providers, setProviders] = useState([]);

  const fetchProviders = async (url) => {
    let obtainedProviders = [];
    const response = await getProviders(url);
    response.results.forEach(async (item) => {
      obtainedProviders.push(item);
    });
    setProviders(obtainedProviders);
    if (response.next) {
      return await setProviders(response.next);
    }
  };

  useEffect(() => {
    fetchProviders(`${process.env.REACT_APP_API_URL}/api/v1/providers/`);
  }, []);

  return (
    <Row>
      <Col>
        <RegisterNewProvider />
        <AllProviders providers={providers} />
      </Col>
    </Row>
  );
};

export default ProvidersView;
