import React, { useState, useEffect, useContext } from "react";
import CryptoJS from "crypto-js";
import { FaCheckCircle, FaTimes, FaSave } from "react-icons/fa";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { AuthContext } from "../../../../contexts/AuthContext";
import {
  updateInstructorFares,
  updateProviderFares,
  updateRequest,
  updateRequestDocuments,
  sendEmail,
} from "../../../../controllers/apiRequests";
import swal from "sweetalert";
import ModalDocuments from "./ModalDocuments/ModalDocuments";

type ConfirmSectionProps = any;

const ConfirmSection: React.FC<ConfirmSectionProps> = ({
  providers,
  instructors,
  track,
  requestId,
  fare_track,
  fisrt_payment,
  status,
  date,
  participants,
  service,
}) => {
  const [showModalProviders, setShowModalProviders] = useState(false);
  const [showModalDocuments, setShowModalDocuments] = useState(false);
  const [allInstructors, setAllInstructors] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [theTrack, setTheTrack] = useState<any>({});
  const { userInfoContext } = useContext(AuthContext);
  const [instFares, setInstFares] = useState({});
  const [provsFares, setProvsFares] = useState({});
  const [trackFP, setTrackFP] = useState<any>(0);
  const [trackFare, setTrackFare] = useState<any>(0);
  const [selectedDocuments, setSelectedDocuments] = useState<any>([]);
  const [wasReviewed, setWasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAllInstructors(instructors);
    instructors.forEach((item) =>
      setInstFares({
        ...instFares,
        [item.instructors.id]: item.first_payment,
      })
    );
    setAllProviders(providers);
    providers.forEach((item) =>
      setProvsFares({
        ...provsFares,
        [item.providers.id]: item.first_payment,
      })
    );

    console.log("track", track);
    setTheTrack(track);
    setTrackFP(fisrt_payment);
    setTrackFare(fare_track);

    // eslint-disable-next-line
  }, [instructors, providers, track, fisrt_payment, fare_track]);

  let formatter = new Intl.NumberFormat("en-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  const hashCode = (id, requestId) => {
    return CryptoJS.AES.encrypt(String(id + requestId), "fuckyoucode")
      .toString()
      .substr(-7);
  };

  return (
    <div className="card invoice-action-wrapper mt-2 shadow-none border">
      <div className="card-body">
        <div className="invoice-action-btn">
          <Button
            variant="light"
            className="btn-block"
            disabled={status.step > 3 ? true : false}
            onClick={() => setShowModalProviders(true)}
          >
            <span>Confirmar proveedores *</span>
          </Button>

          <Modal
            show={showModalProviders}
            size="lg"
            onHide={() => setShowModalProviders(false)}
          >
            <Modal.Header
              className={`bg-${userInfoContext.perfil}`}
              closeButton
            >
              <Modal.Title className="text-white">
                Confirmar proveedores
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped responsive bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Tipo de proveedor</th>
                    <th>Nombre de proveedor</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th style={{ width: "50%" }}>Tarifa</th>
                    <th style={{ width: "50%" }}>Primer pago</th>
                    {/* <th>Guardar</th> */}
                  </tr>
                </thead>
                <tbody>
                  {allInstructors.map((instructor: any, idx) => {
                    return (
                      <tr key={idx}>
                        <td>Instructor</td>
                        <td>
                          {instructor.instructors.first_name}{" "}
                          {instructor.instructors.last_name}
                        </td>
                        <td>{instructor.instructors.cellphone}</td>
                        <td>{instructor.instructors.email}</td>
                        <td>${instructor.fare}</td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            placeholder="$0"
                            value={instFares[instructor.instructors.id]}
                            min={0}
                            onChange={(x) => {
                              setInstFares({
                                ...instFares,
                                [instructor.instructors.id]: x.target.value,
                              });
                            }}
                          />
                        </td>
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={async () => {
                              let res = await updateInstructorFares(
                                {
                                  first_payment:
                                    instFares[instructor.instructors.id],
                                },
                                instructor.id
                              );
                              if (res.status === 200) {
                                swal(
                                  "Pago registado!",
                                  `El pago de ${
                                    instructor.instructors.first_name
                                  } por ${formatter.format(
                                    instFares[instructor.instructors.id]
                                  )} fue registrado 👍`,
                                  "success"
                                );
                              } else {
                                swal(
                                  "Algo pasa!",
                                  "No pudimos actualizar el pago 😢",
                                  "error"
                                );
                              }
                            }}
                          >
                            <FaSave />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {allProviders.map((provider: any, idx) => {
                    return (
                      <tr key={idx}>
                        <td>Proveedor</td>
                        <td>{provider.providers.name}</td>
                        <td>{provider.providers.cellphone}</td>
                        <td>{provider.providers.email}</td>
                        <td>${provider.fare}</td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            placeholder="$0"
                            value={provsFares[provider.providers.id]}
                            min={0}
                            onChange={(x) => {
                              setProvsFares({
                                ...provsFares,
                                [provider.providers.id]: x.target.value,
                              });
                            }}
                          />
                        </td>
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={async () => {
                              let res = await updateProviderFares(
                                {
                                  first_payment:
                                    provsFares[provider.providers.id],
                                },
                                provider.id
                              );
                              if (res.status === 200) {
                                swal(
                                  "Pago registado!",
                                  `El pago de ${
                                    provider.providers.name
                                  } por ${formatter.format(
                                    provsFares[provider.providers.id]
                                  )} fue registrado 👍`,
                                  "success"
                                );
                              } else {
                                swal(
                                  "Algo pasa!",
                                  "No pudimos actualizar el pago 😢",
                                  "error"
                                );
                              }
                            }}
                          >
                            <FaSave />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {theTrack.company && theTrack.company.name === "Ridepro" && (
                    <tr>
                      <td>Pista</td>
                      <td>{theTrack.contact_name}</td>
                      <td>{theTrack.cellphone}</td>
                      <td>{theTrack.contact_email}</td>
                      <td>
                        <Form.Control
                          size="sm"
                          type="number"
                          placeholder="$0"
                          value={trackFare}
                          min={0}
                          onChange={(x) => {
                            setTrackFare(x.target.value);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          size="sm"
                          type="number"
                          placeholder="$0"
                          value={trackFP}
                          min={0}
                          onChange={(x) => {
                            setTrackFP(x.target.value);
                          }}
                        />
                      </td>
                      <td>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={async () => {
                            let res = await updateRequest(
                              {
                                f_p_track: trackFP,
                                fare_track: trackFare,
                              },
                              requestId
                            );
                            if (res.status === 200) {
                              swal(
                                "Pago registado!",
                                `El pago de ${
                                  theTrack.contact_name
                                } por ${formatter.format(
                                  trackFP
                                )} fue registrado 👍`,
                                "success"
                              );
                            } else {
                              swal(
                                "Algo pasa!",
                                "No pudimos actualizar el pago 😢",
                                "error"
                              );
                            }
                          }}
                        >
                          <FaSave />
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Modal.Body>
          </Modal>
        </div>
        <div className="invoice-action-btn">
          <Button
            variant="light"
            className="btn-block"
            disabled={status.step > 3 ? true : false}
            onClick={() => setShowModalDocuments(true)}
          >
            <span>Confirmar documentos </span>
            {wasReviewed || status.step > 3 ? (
              <FaCheckCircle className="text-success" />
            ) : (
              <FaTimes className="text-danger" />
            )}
          </Button>

          {showModalDocuments && (
            <ModalDocuments
              x={selectedDocuments}
              handleClose={() => setShowModalDocuments(false)}
              requestId={requestId}
              handleSave={(data) => {
                setSelectedDocuments(data);
                setShowModalDocuments(false);
                setWasReviewed(true);
                // updateRequestsContext();
              }}
            />
          )}
        </div>

        <div className="invoice-action-btn">
          <Button
            className="btn-block btn-success"
            disabled={!wasReviewed || status.step > 3 ? true : false}
            onClick={() => {
              swal({
                title: "¿Estas seguro?",
                text:
                  "Confirmo que he llamado a cada proveedor para confirmar el evento. Tambien selecioné los documentos necesarios, compré tiquete, hoteles o demás gasto necesario",
                icon: "warning",
                buttons: [
                  "No, dejame revisar",
                  "Si, confirmar con proveedores",
                ],
                dangerMode: true,
              }).then(async (willUpdate) => {
                if (willUpdate) {
                  let docsIds: any = [];
                  setLoading(true);
                  selectedDocuments.forEach((doc: any) => {
                    docsIds.push(doc.id);
                  });
                  let payloadDocs = {
                    request: requestId,
                    documents: docsIds,
                  };
                  let payloadStatus = {
                    new_request: 0, // It wont be a new request anymore
                    operator: userInfoContext.id, // JUST IN CASE
                    status: `${process.env.REACT_APP_STATUS_STEP_4}`,
                  };
                  let resDocs = await updateRequestDocuments(payloadDocs);
                  let resStatus = await updateRequest(payloadStatus, requestId);
                  if (resStatus.status === 200 && resDocs.status === 201) {
                    // Hash for every provider and isntructor
                    track.hash = hashCode(track.id, requestId);
                    providers.forEach(
                      (item) => (item.hash = hashCode(item.id, requestId))
                    );
                    instructors.forEach(
                      (item) => (item.hash = hashCode(item.id, requestId))
                    );

                    // Send track email if track is part of ridepro
                    if (
                      theTrack.company &&
                      theTrack.company.name === "Ridepro"
                    ) {
                      let trackPayload = {
                        id: requestId,
                        emailType: "requestConfirmedTrack",
                        subject: "Evento confirmado ✔️",
                        email: track.contact_email,
                        name: track.contact_name,
                        instructor: instructors[0].instructors,
                        hash: track.hash,
                        firstPayment: trackFP,
                        date: date,
                      };
                      await sendEmail(trackPayload);
                    }

                    // Send providers email
                    providers.forEach(async (prov) => {
                      let providerPayload = {
                        id: requestId,
                        emailType: "requestConfirmedProvider",
                        subject: "Evento confirmado ✔️",
                        email: prov.providers.email,
                        name: prov.providers.name,
                        instructor: instructors[0].instructors,
                        hash: prov.hash,
                        firstPayment: prov.first_payment,
                        date: date,
                        track: track,
                      };
                      await sendEmail(providerPayload);
                    });

                    // Send instructors email
                    instructors.forEach(async (ins) => {
                      let instructorPayload = {
                        id: requestId,
                        emailType: "requestConfirmedInstructor",
                        subject: "Evento confirmado ✔️",
                        email: ins.instructors.email,
                        name: ins.instructors.first_name,
                        hash: ins.hash,
                        firstPayment: ins.first_payment,
                        date: date,
                        track: track,
                        participantes: participants,
                        documents: selectedDocuments,
                        service: service,
                      };
                      await sendEmail(instructorPayload);
                    });

                    // Send admin email
                    let adminPayload = {
                      id: requestId,
                      emailType: "requestConfirmedAdmin",
                      subject: "Proveedores confirmados ✔️",
                      email: "aliados@ridepro.co",
                      date: date,
                      track: track,
                      trackFirstPayment: trackFP,
                      providers: providers,
                      instructors: instructors,
                    };
                    await sendEmail(adminPayload);

                    setLoading(false);

                    swal("Solicitud actualizada!", {
                      icon: "success",
                    });
                  } else {
                    swal("Oops, no se pudo actualizar el servicio.", {
                      icon: "error",
                    });
                  }
                }
              });
            }}
          >
            Confirmar {loading && <Spinner animation="border" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmSection;
