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
import { getAllDrivers } from "../../../controllers/apiRequests";
import UploadExcelFile from "../UploadExcelFile/UploadExcelFile";
import EditableTable from "../../../utils/EditableTable";
import SearchParticipant from "./SearchParticipant/SearchParticipant";

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
  const { handleSubmit, register } = useForm();
  const [participants, setParticipants] = useState([]);
  const [errors, setErrors] = useState(false);
  const [participantsDB, setParticipantsDB] = useState([]);
  const [rides, setRides] = useState(0);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState({
    show: false,
    idx: null,
  });

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

  // ============================= REMOVE PARTICIPANT FROM LIST ============================================

  const removeUserFromList = (idx) => {
    let rideVal = parseInt(serviceInfoContext.ride_value);
    if (rideVal > 0) {
      const temp = [...participants];
      temp.splice(idx, 1);
      setParticipants(() => temp);
      setRides((prevRides) => prevRides - rideVal);
      setShowRemoveUserModal({ show: false, idx: null });
    }
  };

  const handleRemoveItem = (idx) => {
    setShowRemoveUserModal({ show: true, idx });
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

      setParticipantsDB(items);
    }
    fetchDrivers(`${process.env.REACT_APP_API_URL}/api/v1/drivers/`);
  }, []);

  // ============================================  HANDLE SUMBIT  ================================================

  const handleFinalizar = () => {
    props.setParticipants(participants, rides);
  };

  // =============================================================================================================
  // const handleFile = (data, info) => {
  //   let keys = ["official_id", "first_name", "last_name", "email", "cellphone"];
  //   data
  //     .map((x) => x.map((y, i) => ({ [keys[i]]: y })))
  //     .map((z) => (z = { ...z[0], ...z[1], ...z[2], ...z[3], ...z[4] }))
  //     .map((y) =>
  //       setParticipants((prevParticipants) => [...prevParticipants, y])
  //     );
  // };
  // =============================================================================================================

  useEffect(() => {
    console.log("participants", participants);
  }, [participants]);

  const handleSearchParticipant = (item) => {
    console.log("kkega", item);
    setParticipants((oldArr) => [...oldArr, item]);
  };

  const handleUpdateTable = (data) => {
    console.log("hanlde update", data);

    setParticipants((oldArr) => [...oldArr, data[0]]);
  };

  return (
    <Container className="setParticipants">
      <Row className="justify-content-center align-items-center p-3">
        <Col>
          <UploadExcelFile addItem={handleAddItem} />
        </Col>
        <Col>
          {participantsDB.length > 0 && (
            <SearchParticipant
              participants={participantsDB}
              returnedItem={handleSearchParticipant}
            />
          )}
        </Col>
      </Row>
      <Button
        variant="primary"
        size="bg"
        onClick={handleFinalizar}
        className="finalizarBtn"
        disabled={rides ? false : true}
      >
        Finalizar
      </Button>

      <EditableTable
        dataSet={participants}
        fields={fields}
        onValidate={(x) => setErrors(x)}
        onUpdate={handleUpdateTable}
      />

      <Modal
        size="sm"
        show={showRemoveUserModal.show}
        onHide={() => setShowRemoveUserModal({ show: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`¿Estás ` +
            `${
              {
                M: "seguro",
                F: "segura",
                O: "segur@",
              }[userInfoContext.gender]
            } de que quieres remover este usuario?`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRemoveUserModal({ show: false })}
          >
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => removeUserFromList(showRemoveUserModal.idx)}
          >
            {`Si, estoy ` +
              `${
                {
                  M: "seguro",
                  F: "segura",
                  O: "segur@",
                }[userInfoContext.gender]
              }`}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SetParticipants;
