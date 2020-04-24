import React, { useContext, useState, useEffect } from "react";
import { getServices } from "../../../controllers/apiRequests";
import { AuthContext } from "../../../contexts/AuthContext";
import { Form, Col, Table, Badge } from "react-bootstrap";
import { AiFillDollarCircle } from "react-icons/ai";

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

  // ===============================CHECK CREDITS AND SET SERVICE ==================================================

  const handleClick = (e, service) => {
    const companyCreds = userInfoContext.company.credit;
    const serviceCreds = service.ride_value;
    if (companyCreds >= serviceCreds) {
      e.target.parentNode.parentNode.childNodes.forEach((e) =>
        e.classList.remove("active")
      );
      let row = document.getElementById(service.id);
      row.classList.add("active");
      props.setService(service);
    } else {
      alert("Creditos insuficientes");
    }
  };
  return (
    <Form className="setService">
      <Form.Row>
        <Form.Group as={Col}>
          <Table responsive size="sm" className="text-center">
            <thead>
              <tr className="test">
                <th>Servicio</th>
                <th>Tipo</th>
                <th>Descripcion</th>
                <th>Requerimientos</th>
                <th>Duracion</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                return (
                  <tr
                    onClick={(e) => handleClick(e, service)}
                    key={service.id}
                    id={service.id}
                  >
                    <td>{service.name}</td>
                    <td>{service.service_type}</td>
                    <td>{service.description}</td>
                    <td>{service.requirements}</td>
                    <td>{service.duration} min</td>
                    <td>
                      {/* {service.ride_value} */}
                      <Badge>
                        <AiFillDollarCircle />
                        <small>{service.ride_value}</small>
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {/* {errors.level && <small>Por favor seleccione una opcion</small>} */}
        </Form.Group>
      </Form.Row>
    </Form>
  );
};

export default SetService;
