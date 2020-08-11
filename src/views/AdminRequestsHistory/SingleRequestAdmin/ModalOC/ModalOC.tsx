import React, { useState, useEffect, useContext } from "react";
import { FaSave } from "react-icons/fa";
import "./ModalOC.scss";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../../../../contexts/AuthContext";
import {
  updateInstructorFares,
  updateProviderFares,
  updateRequest,
  sendEmail,
} from "../../../../controllers/apiRequests";
import swal from "sweetalert";

type ModalOCProps = any;

const ModalOC: React.FC<ModalOCProps> = ({
  providers,
  instructors,
  track,
  requestId,
  fare_track,
  fisrt_payment,
  status,
  date,
  service,
  handleClose,
}) => {
  const [allInstructors, setAllInstructors] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [theTrack, setTheTrack] = useState<any>({});
  const { userInfoContext } = useContext(AuthContext);
  const [instFares, setInstFares] = useState({});
  const [provsFares, setProvsFares] = useState({});
  const [trackFare, setTrackFare] = useState(0);

  useEffect(() => {
    setAllInstructors(instructors);
    instructors.forEach((item) => {
      setInstFares({
        ...instFares,
        [item.instructors.id]: item.fare,
      });
    });
    setAllProviders(providers);
    providers.forEach((item) => {
      setProvsFares({
        ...provsFares,
        [item.providers.id]: item.fare,
      });
    });

    setTheTrack(track);
    setTrackFare(fare_track);

    // eslint-disable-next-line
  }, [instructors, providers, track, fisrt_payment]);

  const currencyFormatter = (ammount) => {
    return ammount.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  return (
    <Modal show={true} size="lg" onHide={handleClose} className="modal-oc">
      <Modal.Header className={`bg-${userInfoContext.perfil}`} closeButton>
        <Modal.Title className="text-white">Enviar OC</Modal.Title>
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
              <th>Primer pago</th>
              <th>Saldo</th>
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
                  <td>
                    <small>{instructor.instructors.email}</small>
                  </td>
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
                  <td>{currencyFormatter(instructor.first_payment)}</td>
                  <td>
                    {currencyFormatter(
                      instFares[instructor.instructors.id] -
                        instructor.first_payment
                    )}
                  </td>
                  <td>
                    <Button
                      variant="link"
                      onClick={async () => {
                        swal({
                          title: "¿Estas seguro?",
                          text: `${
                            instructor.instructors.first_name
                          } recibirá un email con pago inmediato por ${currencyFormatter(
                            instFares[instructor.instructors.id] -
                              instructor.first_payment
                          )}
                          Una vez envies las orden de compra no habra paso atras!`,
                          icon: "warning",
                          buttons: [
                            "No, dejame revisar",
                            "Si, actualizar tarifa",
                          ],
                          dangerMode: false,
                        }).then(async (willDelete) => {
                          if (willDelete) {
                            let res = await updateInstructorFares(
                              {
                                fare: instFares[instructor.instructors.id],
                              },
                              instructor.id
                            );
                            if (res.status === 200) {
                              swal(
                                "Tarifa Actualizada!",
                                `la tarifa de ${
                                  instructor.instructors.first_name
                                } por ${currencyFormatter(
                                  instFares[instructor.instructors.id]
                                )} fue actualizada 👍`,
                                "success"
                              );
                            } else {
                              swal(
                                "Algo pasa!",
                                "No pudimos actualizar la tarifa 😢",
                                "error"
                              );
                            }
                          }
                        });
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
                  <td>
                    <small>{provider.providers.email}</small>
                  </td>
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
                  <td>{currencyFormatter(provider.first_payment)}</td>
                  <td>
                    {currencyFormatter(
                      provsFares[provider.providers.id] - provider.first_payment
                    )}
                  </td>
                  <td>
                    <Button
                      variant="link"
                      onClick={async () => {
                        swal({
                          title: "¿Estas seguro?",
                          text: `${
                            provider.providers.name
                          } recibirá un email con pago inmediato por ${currencyFormatter(
                            provsFares[provider.providers.id] -
                              provider.first_payment
                          )} 
                            Una vez envies las orden de compra no habra paso atras!`,
                          icon: "warning",
                          buttons: [
                            "No, dejame revisar",
                            "Si, actualizar tarifa",
                          ],
                          dangerMode: false,
                        }).then(async (willDelete) => {
                          if (willDelete) {
                            let res = await updateProviderFares(
                              {
                                fare: provsFares[provider.providers.id],
                              },
                              provider.id
                            );
                            if (res.status === 200) {
                              swal(
                                "Tarifa Actualizada!",
                                `La tarifa de ${
                                  provider.providers.name
                                } por ${currencyFormatter(
                                  provsFares[provider.providers.id]
                                )} fue actualizada 👍`,
                                "success"
                              );
                            } else {
                              swal(
                                "Algo pasa!",
                                "No pudimos actualizar la tarifa 😢",
                                "error"
                              );
                            }
                          }
                        });
                      }}
                    >
                      <FaSave />
                    </Button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>Pista</td>
              <td>{theTrack.contact_name}</td>
              <td>{theTrack.cellphone}</td>
              <td>
                <small>{theTrack.contact_email}</small>
              </td>
              <td>
                <Form.Control
                  size="sm"
                  type="number"
                  placeholder="$0"
                  value={trackFare}
                  min={100}
                  onChange={(x) => {
                    setTrackFare(x.target.value);
                  }}
                />
              </td>
              <td>{currencyFormatter(fisrt_payment)}</td>
              <td>{currencyFormatter(trackFare - fisrt_payment)}</td>
              <td>
                <Button
                  variant="link"
                  onClick={async () => {
                    swal({
                      title: "¿Estas seguro?",
                      text: `${
                        theTrack.contact_name
                      } recibirá un email con pago inmediato por ${currencyFormatter(
                        trackFare - fisrt_payment
                      )}
                        Una vez envies las orden de compra no habra paso atras!`,
                      icon: "warning",
                      buttons: ["No, dejame revisar", "Si, actualizar tarifa"],
                      dangerMode: false,
                    }).then(async (willDelete) => {
                      if (willDelete) {
                        let res = await updateRequest(
                          {
                            fare_track: trackFare,
                          },
                          requestId
                        );
                        if (res.status === 200) {
                          swal(
                            "Tarifa Actualizada!",
                            `La tarifa de ${
                              theTrack.contact_name
                            } por ${currencyFormatter(
                              trackFare
                            )} fue actualizada 👍`,
                            "success"
                          );
                        } else {
                          swal(
                            "Algo pasa!",
                            "No pudimos actualizar la tarifa 😢",
                            "error"
                          );
                        }
                      }
                    });
                  }}
                >
                  <FaSave />
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            swal({
              title: "¿Estas seguro?",
              text:
                "Si haces click confirmar cada proveedor recibira un email con el código de confirmación del pago y no habrá vuelta atrás!",
              icon: "warning",
              buttons: ["No, dejame revisar", "Si, estoy seguro"],
              dangerMode: false,
            }).then(async (willUpdate) => {
              if (willUpdate) {
                let payload = {
                  new_request: 0, // It wont be a new request anymore
                  operator: userInfoContext.id,
                  status: `${process.env.REACT_APP_STATUS_STEP_6}`,
                };
                let res = await updateRequest(payload, requestId);
                if (res.status === 200) {
                  swal(
                    "Felicitaciones!",
                    `Haz culminado tus labores con la solicitud #${requestId} 👍`,
                    "success"
                  );
                  //TODO: Sent emails to every provider
                  // SEND EMAIL
                  const payload = {
                    id: requestId,
                    emailType: "ocAdmin",
                    subject: `OC Servicio#${requestId} 📑`,
                    uniqId: `${requestId}-${
                      providers.length + instructors.length + 1
                    }`,
                    email: "sdelrio@ridepro.co",
                    name: "Sergio",
                    date: date,
                    track: track,
                    track_balance: fare_track - fisrt_payment,
                    instructors: instructors,
                    providers: providers,
                    service: service,
                  };
                  await sendEmail(payload); // SEND SERVICE OPTIONS EMAIL TO USER

                  handleClose();
                } else {
                  swal(
                    "Algo pasa!",
                    "No pudimos actualizar la solicitud 😢",
                    "error"
                  );
                }
              }
            });
          }}
        >
          Confirmar OC's
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalOC;
