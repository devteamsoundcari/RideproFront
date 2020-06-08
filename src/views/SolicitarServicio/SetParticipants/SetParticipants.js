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

const SetParticipants = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const { serviceInfoContext } = useContext(ServiceContext);
  const {
    setAllParticipantsInfoContext,
    setRegisteredParticipantsContext,
    setParticipantsToRegisterContext,
  } = useContext(ParticipantsContext);
  const [participants, setParticipants] = useState([]);
  // eslint-disable-next-line
  const [errors, setErrors] = useState(false);
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
      regex: /^[a-z\u00C0-\u02AB'´`]+$/i,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un nombre válido."
      },
    },
    last_name: {
      name: "Apellido",
      regex: /^[a-z\u00C0-\u02AB'´`]+$/i,
      unique: false,
      errorMessages: {
        regex: "Por favor, ingresa un apellido válido."
      },
    },
    email: {
      name: "Email",
      regex: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i,
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
        regex: "Por favor ingrese un teléfono válido"
      },
    },
  };

  // ==================================== ADD PARTICIPANTS TO LIST ===========================================

  // const handleAddItem = (data) => {
  //   let rideVal = parseInt(serviceInfoContext.ride_value);
  //   // let temp = 100;
  //   if (rideVal + rides <= userInfoContext.company.credit) {
  //     // if (true) {
  //     let userIsRegistered = isParticipantRegistered(participantsDB, data); // Check if driver is already in db
  //     if (userIsRegistered.res) {
  //       data = userIsRegistered.obj;
  //       data.registered = true;
  //       alert(
  //         `ADVERTENCIA: Identificación: ${userIsRegistered.obj.official_id} Nombre: ${userIsRegistered.obj.first_name} ${userIsRegistered.obj.last_name} ya ha sido parte de otros servicios`
  //       );
  //     } else {
  //       data.registered = false;
  //     }
  //     // Check if the users is already on the list... if so skip with alert
  //     let alreadyAdded = participants.filter(
  //       (person) => person.official_id === data.official_id
  //     );
  //     if (alreadyAdded.length === 0) {
  //       setParticipants((prevParticipants) => [...prevParticipants, data]);
  //       setRides((prevRides) => prevRides + rideVal);
  //     } else {
  //       alert("No se puede añadir el mismo participante dos veces.");
  //     }
  //   } else {
  //     alert("Créditos insuificientes");
  //   }
  // };

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
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers/`);
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
      let registeredCreds = rideVal * registeredParticipants.length;
      let unregisteredCreds = rideVal * participants.length;
      setRides(registeredCreds + unregisteredCreds);
    } else {
      setRides(serviceInfoContext.ride_value);
    }
  }, [registeredParticipants, serviceInfoContext, participants]);

  // =================================  UPDATE DATA TABLE AND REGISTERED PARTICIPANTS  ================================================

  const handleSearchParticipant = (item) => {
    const temp = participantsDB.filter((i) => {
      return i.official_id !== item.official_id;
    });
    setParticipantsDB(temp);
    setDataTable((oldArr) => [...oldArr, item]);
  };

  const handleUpdateTable = (data) => {
    setParticipantsToRegisterContext(data);
    setParticipants(data);
  };

  const handleRedisteredParticipants = (data) => {
    setRegisteredParticipants(data);
    setRegisteredParticipantsContext(data);
  };
  // =========================================================================================================

  return (
    <Container className="setParticipants">
      <Row className="participantsTools">
        <Col md="3" className="from-excel">
          <UploadExcelFile addItem={(a) => setParticipants(a)} />
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
            disabled={rides ? false : true}
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
          registeredParticipants={handleRedisteredParticipants}
          deletedItem={(x) => setParticipantsDB((oldArray) => [...oldArray, x])}
        />
      </Row>
      <Row className="editableTable">
        <h5>Registrar nuevos participantes</h5>
        <EditableTable
          dataSet={participants}
          fields={fields}
          onValidate={(x) => setErrors(x)}
          onUpdate={handleUpdateTable}
        />
      </Row>
    </Container>
  );
};

export default SetParticipants;
