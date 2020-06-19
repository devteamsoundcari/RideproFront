import React, { useState, useContext, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import "./SetParticipants.scss";
import { AuthContext } from "../../../contexts/AuthContext";
import { ServiceContext } from "../../../contexts/ServiceContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import { getAllDrivers } from "../../../controllers/apiRequests";
import UploadExcelFile from "../UploadExcelFile/UploadExcelFile";
import { EditableTable } from "../../../utils/EditableTable";
import SearchByDocument from "../../../utils/SearchByDocument/SearchByDocument";
import DataTable from "./DataTable/DataTable";
import RegularExpressions from "../../../utils/RegularExpressions";


const SetParticipants = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const { serviceInfoContext } = useContext(ServiceContext);
  const {
    allParticipantsInfoContext,
    setAllParticipantsInfoContext,
    setRegisteredParticipantsContext,
    setParticipantsToRegisterContext
  } = useContext(ParticipantsContext);
  const [participants, setParticipants] = useState([]);
  const [participantToAdd, setParticipantToAdd] = useState({});
  const [participantsForReplacing, setParticipantsForReplacing] = useState([]);
  const [areParticipantsValid, setAreParticipantsValid] = useState(false);
  const [participantsDB, setParticipantsDB] = useState([]);
  const [rides, setRides] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);

  // ============================================  EDITABLE TABLE SETUP  ================================================

  const fields = {
    official_id: {
      name: "Identificación",
      format: "string",
      regex: /^E?\d+$/,
      unique: true,
      errorMessages: {
        regex: "Por favor, ingresa un número válido.",
        unique: "Oops, este documento ya esta siendo usado por otra persona.",
      },
    },
    first_name: {
      name: "Nombre",
      regex: RegularExpressions.name,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un nombre válido."
      },
    },
    last_name: {
      name: "Apellido",
      regex: RegularExpressions.name,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un apellido válido."
      },
    },
    email: {
      name: "Email",
      regex: RegularExpressions.email,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un email válido."
      },
    },
    cellphone: {
      name: "Teléfono",
      regex: /^\d{7,10}$/,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un teléfono válido.."
      },
    },
    isRegistered: {
      name: "",
      format: "boolean",
      hidden: true,
      default: false
    }
  };

  // ================================== GETTING ALL DRIVERS FROM DB =================================================

  useEffect(() => {
    const items = [];
    async function fetchDrivers(url) {
      const response = await getAllDrivers(url);
      if (response.next) {
        response.results.map((item) => {
          items.push(item);
          return true;
        });
        return await fetchDrivers(response.next);
      }
      response.results.map((item) => {
        items.push(item);
        return true;
      });
      setAllParticipantsInfoContext(items);
      setParticipantsDB(items);
    }
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers_company/`);
    // eslint-disable-next-line
  }, []);

  // ============================================  HANDLE SUMBIT  ================================================

  const handleFinalizar = () => {
    props.setParticipants(rides);
  };

  // ============================================  CHECK TYPE OF SERVICE  ================================================

  useEffect(() => {
    if (serviceInfoContext.service_type === "Persona") {
      const rideVal = serviceInfoContext.ride_value;
      let credits = rideVal * participants.length;
      setRides(credits);
    } else {
      setRides(serviceInfoContext.ride_value);
    }
  }, [registeredParticipants, serviceInfoContext, participants]);

  // =================================  UPDATE DATA TABLE AND REGISTERED PARTICIPANTS  ================================================

  const handleSearchParticipant = (item) => {
    const newParticipantsDB = participantsDB.filter((i) => {
      return i.official_id !== item.official_id;
    });
    setParticipantsDB(newParticipantsDB);
    setParticipantToAdd({...item, isRegistered: true});
  };

  useEffect(() => {
    const newParticipantsDB = [...allParticipantsInfoContext];
    const registeredParticipants = participants.filter((participant) => {
      return participant.isRegistered;
    });

    for (const participant of allParticipantsInfoContext) {
      const index = registeredParticipants.findIndex((i) => {
        return i.official_id === participant.official_id;
      });
      if (index >= 0) {
        let participantIndex = newParticipantsDB.findIndex((p) => {
          return p.official_id === participant.official_id;
        });
        if (participantIndex >= 0) {
          newParticipantsDB.splice(participantIndex, 1);
        }
      }
    }

    setParticipantsDB(newParticipantsDB);
  }, [participants]);

  const handleUpdateTable = (data) => {
    setParticipantsToRegisterContext(data);
    setParticipants(data);
  };

  const handleRegisteredParticipants = (data) => {
    setRegisteredParticipants(data);
    setRegisteredParticipantsContext(data);
  };

  const handleXLSXLoadUp = (data) => {
    setParticipantsForReplacing([...data]);
  }

  // =========================================================================================================

  const isParticipantAlreadyRegistered = (participant) => {
    if (participant.isRegistered === true) {
      return true
    }; 
  }

  return (
    <Container className="setParticipants">
      <Row className="participantsTools">
        <Col md="3" className="from-excel">
          <UploadExcelFile addItem={(a) => handleXLSXLoadUp(a)} />
          <a
            href={require("../../../assets/BulkParticipantesRidepro.xlsx")}
            download
          >
            Descargar Plantilla
            <span>
              <FaDownload />
            </span>
          </a>
        </Col>
        <Col>
          {participantsDB.length > 0 && (
            <SearchByDocument
              participants={participantsDB}
              returnedItem={handleSearchParticipant}
              title="Buscar por documento"
              placeholder="Buscar por Identificación"
            />
          )}
        </Col>
        <Col md="3" className="stats">
          <Button
            variant="primary"
            size="bg"
            onClick={handleFinalizar}
            className="finalizarBtn"
            disabled={areParticipantsValid && rides ? false : true}
          >
            Finalizar
          </Button>
          <p>
            Tipo de Servicio:
            <small>
              {serviceInfoContext.ride_value} x{" "}
              {serviceInfoContext.service_type}
            </small>
          </p>
          <p>
            Creditos a utilizar:
            <small>
              {rides} / {userInfoContext.company.credit}
            </small>
          </p>
          <p>
            Participantes:{" "}
            <small>{registeredParticipants.length + participants.length}</small>
          </p>
        </Col>
      </Row>
      <Row
        className="dataTable"
        style={{
          display: `${registeredParticipants.length > 0 ? "" : "none"}`,
        }}
      >
        <DataTable
          data={dataTable}
          registeredParticipants={handleRegisteredParticipants}
          deletedItem={(x) => setParticipantsDB((oldArray) => [...oldArray, x])}
        />
      </Row>
      <Row className="editableTable">
        <h5>Registrar nuevos participantes</h5>
        <EditableTable
          dataSet={participants}
          fields={fields}
          onValidate={(x) => setAreParticipantsValid(x)}
          onUpdate={handleUpdateTable}
          readOnlyIf={isParticipantAlreadyRegistered}
          recordToAdd={participantToAdd}
          recordsForReplacing={participantsForReplacing}
        />
      </Row>
    </Container>
  );
};

export default SetParticipants;
