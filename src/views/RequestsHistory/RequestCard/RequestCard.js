import React, { useState, useContext } from "react";
import {
  Card,
  Accordion,
  Col,
  Row,
  ProgressBar,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import { RequestContext } from "../../../contexts/RequestContext";
import RequestInfoTable from "./RequestInfoTable/RequestInfoTable";
import RequestParticipantsTable from "./RequestParticipantsTable/RequestParticipantsTable";

const RequestCard = (props) => {
  const today = new Date();

  const newCreatedAtDate = new Date(
    props.request.created_at
  ).toLocaleDateString();
  const newCreatedAtTime = new Date(
    props.request.created_at
  ).toLocaleTimeString();
  const newStartDate = new Date(props.request.start_time).toLocaleDateString();
  const newStartTime = new Date(props.request.start_time).toLocaleTimeString();

  const requestStyle = {
    backgroundColor: props.request.status.step === 0 ? "#ddd" : "",
    color: props.request.status.step === 0 ? "#818182" : "",
    textDecoration: props.request.status.step === 0 ? "line-through" : "",
  };

  return (
    <Card style={requestStyle} className="text-center">
      <Accordion.Toggle as={Card.Header} eventKey={props.index}>
        <Row style={{ alignItems: "center" }}>
          <Col md={1}>
            <IoIosArrowForward className="arrow" />
            <IoIosArrowForward className="arrow" />
          </Col>
          <Col md={1}>
            <strong>Cod: </strong>
            {props.request.id}
          </Col>
          <Col className="text-center">
            <strong>Fecha de Creación: </strong>
            {newCreatedAtDate}
          </Col>
          <Col>
            <strong>Producto: </strong>
            {props.request.service.name}
          </Col>

          <Col className="text-center">
            <small>{props.request.status.name}</small>
            {props.request.status.step !== 0 && (
              <ProgressBar variant="success" now={20} />
            )}
          </Col>
        </Row>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={props.index}>
        <Card.Body>
          <RequestInfoTable request={props.request} />
          <RequestParticipantsTable
            drivers={props.request.drivers}
            status={props.request.status}
            requestId={props.request.id}
          />
          {props.request.status.step !== 0 && today < props.request.cancelDate && (
            <footer>
              <Button
                variant="danger"
                size="sm"
                // onClick={() => handleCancelRequest(request)}
              >
                Cancelar Solicitud
              </Button>
            </footer>
          )}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default RequestCard;
