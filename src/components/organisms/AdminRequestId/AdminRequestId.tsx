import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import { AuthContext, SingleRequestContext } from '../../../contexts';
import { useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import DriversSection from './DriversSection/DriversSection';
import InstructorsSection from './InstructorsSection/InstructorsSection';
import ProvidersSection from './ProvidersSection/ProvidersSection';
import PlaceDateSection from './PlaceDateSection/PlaceDateSection';
import DocumentsSection from './DocumentsSection/DocumentsSection';
import ControlsSection from './ControlsSection/ControlsSection';
import InvoiceSection from './InvoiceSection/InvoiceSection';
import { dateAMPM, dateDDMMYYY, dateDDMMYYYnTime, PERFIL_ADMIN } from '../../../utils';
import './AdminRequestId.scss';

export const AdminRequestId = () => {
  const { requestId } = useParams() as any;
  const { currentRequest } = useContext(SingleRequestContext);
  const { userInfo } = useContext(AuthContext) as any;

  return (
    <section className="single-request-admin mb-3">
      <Row>
        <div className="col-xl-9 col-md-8 col-12">
          <div className="card invoice-print-area">
            <div className="card-content">
              <div className="card-body pb-0 mx-25">
                <Row>
                  <div className="col-xl-4 col-md-12">
                    <span className="invoice-number mr-50">Solicitud #</span>
                    <span>{requestId}</span>
                  </div>
                  <div className="col-xl-8 col-md-12">
                    <div className="d-flex align-items-center justify-content-xl-end flex-wrap">
                      <div className="mr-3">
                        <small className="text-muted">Fecha de creación: </small>
                        <span>
                          {currentRequest?.created_at &&
                            dateDDMMYYYnTime(currentRequest?.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="row my-3">
                  <div className="col-6">
                    <h4 className="text-primary">Solicitud</h4>
                    <span>{currentRequest?.service?.name}</span>
                    <br />
                    <span>
                      {currentRequest?.start_time && dateDDMMYYY(currentRequest?.start_time)}
                    </span>
                    <br />
                    <span>
                      {currentRequest?.start_time && dateAMPM(currentRequest?.start_time)}
                    </span>
                    <br />
                    <span>
                      {currentRequest?.municipality?.name}{' '}
                      {currentRequest?.municipality?.department?.name}
                    </span>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                    <img
                      src={currentRequest?.customer?.company?.logo}
                      alt="logo"
                      height="80"
                      width="80"
                    />
                  </div>
                </div>
                <hr />
                <div className="row invoice-info">
                  <div className="col-6 mt-1">
                    <h6 className="invoice-from">Solicitado por</h6>
                    <div className="mb-1">
                      <small>Nombre:</small>
                      <br />
                      <span>
                        {currentRequest?.customer?.first_name} {currentRequest?.customer?.last_name}
                      </span>
                    </div>
                    <div className="mb-1">
                      <small>Cargo:</small>
                      <br />
                      <span>{currentRequest?.customer?.charge}</span>
                    </div>
                    <div className="mb-1">
                      <small>Email:</small>
                      <br />
                      <span>{currentRequest?.customer?.email}</span>
                    </div>
                  </div>
                  <div className="col-6 mt-1">
                    <h6 className="invoice-to">Empresa</h6>
                    <Row>
                      <Col>
                        <div className="mb-1">
                          <small>Nombre:</small>
                          <br />
                          <span>{currentRequest?.customer?.company?.name}</span>
                        </div>
                        <div className="mb-1">
                          <small>Nit:</small>
                          <br />
                          <span>{currentRequest?.customer?.company?.nit}</span>
                        </div>
                        <div className="mb-1">
                          <small>Arl:</small>
                          <br />
                          <span>{currentRequest?.customer?.company?.arl}</span>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-1">
                          <small>Dirección:</small>
                          <br />
                          <span>{currentRequest?.customer?.company?.address}</span>
                        </div>
                        <div className="mb-1">
                          <small>Tel:</small>
                          <br />
                          <span>{currentRequest?.customer?.company?.phone}</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <hr />
                <div className="row invoice-info mt-3">
                  <div className="col-12 mt-1">
                    <h6 className="invoice-to">Observaciones</h6>
                    <div className="comments">
                      <div className="user-message">
                        <div className="avatar">
                          <img
                            src={currentRequest?.customer?.picture}
                            alt={currentRequest?.customer?.first_name}
                            width="32"
                            height="32"
                          />
                        </div>
                        <div className="d-inline-block mt-25">
                          <h6 className="mb-0 text-bold-500">
                            {currentRequest?.customer?.first_name}{' '}
                            {currentRequest?.customer?.last_name}
                          </h6>
                          <p className="text-muted mt-1">
                            <small>{currentRequest?.accept_msg}</small>
                          </p>
                        </div>
                      </div>
                      {currentRequest?.status?.step === 0 && (
                        <div className="user-message">
                          <div className="avatar">
                            <img
                              src={currentRequest?.customer?.picture}
                              alt={currentRequest?.customer?.first_name}
                              width="32"
                              height="32"
                            />
                          </div>
                          <div className="d-inline-block mt-25">
                            <h6 className="mb-0 text-bold-500">
                              {currentRequest?.customer?.first_name}{' '}
                              {currentRequest?.customer?.last_name}
                            </h6>
                            <p className="text-muted mt-1">
                              <small>{currentRequest?.reject_msg}</small>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <hr />
                <PlaceDateSection
                  municipality={currentRequest?.municipality}
                  track={currentRequest?.track}
                  date={currentRequest?.start_time}
                  title=""
                />
              </div>
              <hr />
              <div className="mx-md-25 text-center pl-3 pr-3 overflow-auto">
                <h6>Instructores ({currentRequest?.instructors.length})</h6>
                {currentRequest?.instructors.length > 0 ? (
                  <InstructorsSection requestId={parseInt(requestId)} />
                ) : (
                  <span>Esta solicitud no tiene instructores</span>
                )}
              </div>
              <hr />
              <div className="mx-md-25 text-center pl-3 pr-3 overflow-auto">
                <h6>Proveedores ({currentRequest?.providers.length})</h6>
                {currentRequest?.providers.length > 0 ? (
                  <ProvidersSection requestId={parseInt(requestId)} />
                ) : (
                  <span>Esta solicitud no tiene proveedores</span>
                )}
              </div>
              <hr />
              <div className="mx-md-25 text-center pl-3 pr-3 overflow-auto">
                <h6>Participantes ({currentRequest?.drivers.length})</h6>
                <DriversSection
                  drivers={currentRequest?.drivers}
                  status={currentRequest?.status?.step}
                  requestId={requestId}
                />
              </div>
              {currentRequest?.status.step && currentRequest.status.step > 3 && (
                <>
                  <hr />
                  <DocumentsSection requestId={requestId} />
                </>
              )}

              {userInfo.profile === PERFIL_ADMIN.profile &&
                currentRequest?.status?.step &&
                currentRequest?.status?.step > 6 && (
                  <>
                    <hr />
                    <InvoiceSection />
                  </>
                )}
            </div>
          </div>
        </div>
        <ControlsSection />
      </Row>
    </section>
  );
};
