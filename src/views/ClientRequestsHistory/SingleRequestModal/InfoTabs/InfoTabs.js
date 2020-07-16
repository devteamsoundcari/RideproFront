import React from "react";
import { Button, Tab, Tabs, Nav, Row, Col } from "react-bootstrap";

function InfoTabs() {
  return (
    <Tabs
      defaultActiveKey="participants"
      id="uncontrolled-tab-request"
      className="uncontrolled-tab-request"
    >
      <Tab eventKey="participants" title="Participantes">
        <EditableTable
          size="sm"
          dataSet={allDrivers}
          fields={fields}
          onValidate={handleNewDriversValidation}
          onUpdate={handleAllDrivers}
          readOnly={true}
          readOnlyIf={isParticipantAlreadyRegistered}
          recordsForReplacing={driversForReplacing}
        />
      </Tab>
      <Tab eventKey="place" title="Lugar" disabled>
        sdfd
      </Tab>
      <Tab eventKey="options" title={<TiCogOutline />}>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="mt-2">
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">
                    <TiCogOutline /> General
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">
                    <MdHelpOutline /> Ayuda
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Row>
                    <Col md={12}>
                      <p>
                        Tus solicitudes podran ser canceladas sin costo siempre
                        y cuando la misma no haya sido confirmada.
                        <br />
                        <br />
                        Si tu solicitud ha sido procesada por el equipo de
                        RidePro, el costo de la cancelación estara basado en las
                        horas restantes para el dia del evento.
                      </p>
                      {status.step !== 0 && (
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={status.step !== 1 ? true : false}
                          onClick={handleCancelEvent}
                        >
                          Cancelar solicitud
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Row className="mt-2">
                    <Col md={12}>
                      <div class="row">
                        <div class="col-12 text-center">
                          <p class="p-2 text-muted">
                            Si tienes unca solicitud, o no encuentras la
                            respuesta a tus dudas, ponte en contacto con
                            nosotos!
                          </p>
                        </div>
                      </div>
                      <div class="row d-flex justify-content-center">
                        <div class="col-sm-12 col-md-4 text-center border rounded p-2 mr-md-2 m-1 help-icon">
                          <span className="text-muted ">
                            <MdLocalPhone />
                          </span>
                          <h5>+ (810) 2548 2568</h5>
                          <p class="text-muted font-medium-1">
                            {" "}
                            Disponibles 24*7. Estaremos felices de ayudar
                          </p>
                        </div>
                        <div class="col-sm-12 col-md-4 text-center border rounded p-2 m-1  help-icon">
                          <span className="text-muted">
                            <FaEnvelope />
                          </span>
                          <h5>
                            <a href="contacto@ridepro.co">
                              contacto@ridepro.co
                            </a>
                          </h5>
                          <p class="text-muted font-medium-1">
                            La manera mas rapida de respuesta.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Tab>
    </Tabs>
  );
}

export default InfoTabs;
