import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Container,
  Table,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./SetParticipants.scss";
import { AuthContext } from "../../../contexts/AuthContext";
import { ServiceContext } from "../../../contexts/ServiceContext";
import { ParticipantsContext } from "../../../contexts/ParticipantsContext";
import { getAllDrivers } from "../../../controllers/apiRequests";
import UploadExcelFile from "../UploadExcelFile/UploadExcelFile";
import EditableTable from "../../../utils/EditableTable";
import SearchByDocument from "../../../utils/SearchByDocument/SearchByDocument";
import DataTable from "./DataTable/DataTable";

function isParticipantRegistered(x, y) {
  for (var index in x) {
    if (x[index].official_id === y.official_id) {
      return {
        res: true,
        obj: x[index],
      };
    }
  }
  return {
    res: false,
    obj: null,
  };
}

const SetParticipants = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const { serviceInfoContext } = useContext(ServiceContext);
  const {
    setAllParticipantsInfoContext,
    setRegisteredParticipantsContext,
  } = useContext(ParticipantsContext);
  const { handleSubmit, register } = useForm();
  const [participants, setParticipants] = useState([]);
  const [errors, setErrors] = useState(false);
  const [participantsDB, setParticipantsDB] = useState([]);
  const [rides, setRides] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);

  const fields = [
    {
      basename: "officialId",
      name: "Identificación",
      regex: /^\d+$/,
      errorMsg: "Por favor ingrese un número válido",
    },
    {
      basename: "first_name",
      name: "Nombre",
      regex: /^[a-z\u00C0-\u02AB'´`]+$/i,
      errorMsg: "Por favor ingrese un nombre válido",
    },
    {
      basename: "last_name",
      name: "Apellido",
      regex: /^[a-z\u00C0-\u02AB'´`]+$/i,
      errorMsg: "Por favor ingrese un apellido válido",
    },
    {
      basename: "email",
      name: "Email",
      regex: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i,
      errorMsg: "Por favor ingrese un email válido",
    },
    {
      basename: "phone",
      name: "Teléfono",
      regex: /^\d{7,10}$/,
      errorMsg: "Por favor ingrese un teléfono válido",
    },
  ];

  // ==================================== ADD PARTICIPANTS TO LIST ===========================================

  const handleAddItem = (data) => {
    let rideVal = parseInt(serviceInfoContext.ride_value);
    // let temp = 100;
    if (rideVal + rides <= userInfoContext.company.credit) {
      // if (true) {
      let userIsRegistered = isParticipantRegistered(participantsDB, data); // Check if driver is already in db
      if (userIsRegistered.res) {
        data = userIsRegistered.obj;
        data.registered = true;
        alert(
          `ADVERTENCIA: Identificación: ${userIsRegistered.obj.official_id} Nombre: ${userIsRegistered.obj.first_name} ${userIsRegistered.obj.last_name} ya ha sido parte de otros servicios`
        );
      } else {
        data.registered = false;
      }
      // Check if the users is already on the list... if so skip with alert
      let alreadyAdded = participants.filter(
        (person) => person.official_id === data.official_id
      );
      if (alreadyAdded.length === 0) {
        setParticipants((prevParticipants) => [...prevParticipants, data]);
        setRides((prevRides) => prevRides + rideVal);
      } else {
        alert("No se puede añadir el mismo participante dos veces.");
      }
    } else {
      alert("Créditos insuificientes");
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
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers/`);
  }, []);

  // ============================================  HANDLE SUMBIT  ================================================

  const handleFinalizar = () => {
    props.setParticipants(participants, rides);
  };

  useEffect(() => {
    if (serviceInfoContext.service_type === "Persona") {
      let creds = serviceInfoContext.ride_value * registeredParticipants.length;
      setRides(creds);
    } else {
      setRides(serviceInfoContext.ride_value);
    }
  }, [registeredParticipants, serviceInfoContext]);

  const handleSearchParticipant = (item) => {
    const temp = participantsDB.filter((i) => {
      return i.official_id !== item.official_id;
    });
    setParticipantsDB(temp);
    setDataTable((oldArr) => [...oldArr, item]);
  };

  const handleUpdateTable = (data) => {
    setRegisteredParticipantsContext((oldArr) => [...oldArr, data[0]]);
    setParticipants((oldArr) => [...oldArr, data[0]]);
  };

  useEffect(() => {
    console.log(serviceInfoContext);
  }, [serviceInfoContext]);

  return (
    <Container className="setParticipants">
      <Row className="participantsTools">
        <Col>
          <UploadExcelFile addItem={handleAddItem} />
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
        <Col className="stats">
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
            Participantes: <small>{registeredParticipants.length}</small>
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
          registeredParticipants={(x) => setRegisteredParticipants(x)}
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
