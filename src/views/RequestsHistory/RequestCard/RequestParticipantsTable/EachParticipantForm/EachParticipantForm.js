import React, { useState } from "react";
import { Button, Form, Col, Row, Spinner } from "react-bootstrap";
import { updateDriver } from "../../../../../controllers/apiRequests";

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const EachParticipantForm = (props) => {
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [participantInfo, setParticipantInfo] = useState({});

  // ================================ CLICK ON EDIT DISABLED FALSE=================================

  const handleClick = () => {
    setShowSaveBtn(true);
    [...document.getElementsByClassName(props.cls)].forEach(
      (element, index, array) => {
        element.disabled = false;
      }
    );
  };

  // ================================ UPDATE DRIVER =================================

  const handleSubmit = async () => {
    setShowSaveBtn(false);
    setLoading(true);
    if (isEmpty(participantInfo)) {
      setLoading(false);
      [...document.getElementsByClassName(props.cls)].forEach(
        (element, index, array) => {
          element.disabled = true;
        }
      );
    } else {
      // if (!isEmpty(participantInfo)) {
      // UPDATE DRIVER API
      let res = await updateDriver(participantInfo, props.driver.id);
      if (res.status === 200) {
        setLoading(false);
        [...document.getElementsByClassName(props.cls)].forEach(
          (element, index, array) => {
            element.disabled = true;
          }
        );
      } else {
        console.log("Eror modificando driver", res);
      }
    }
  };

  // ================================ HANDLE CHANGE INPUTS SAVE STATE =================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipantInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // ================================ RENDER EDIT AND SAVE BUTTONS =================================
  const renderEditButtons = () => {
    if (props.status.step !== 0) {
      if (showSaveBtn) {
        return (
          <td>
            <Button variant="danger" size="sm" onClick={() => handleSubmit()}>
              Actualizar
            </Button>
          </td>
        );
      } else if (!loading) {
        return (
          <td>
            <Button variant="info" size="sm" onClick={() => handleClick()}>
              Editar
            </Button>
          </td>
        );
      }
    }
  };

  //=================================================================================================
  return (
    <tr>
      <td>
        <Form.Control disabled placeholder={props.driver.official_id} />
      </td>
      <td>
        <Form.Control
          disabled
          type="text"
          name="first_name"
          className={props.cls}
          placeholder={props.driver.first_name}
          onChange={handleChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          disabled
          name="last_name"
          className={props.cls}
          placeholder={props.driver.last_name}
          onChange={handleChange}
        />
      </td>
      <td>
        <Form.Control
          type="email"
          disabled
          name="email"
          className={props.cls}
          placeholder={props.driver.email}
          onChange={handleChange}
        />
      </td>
      <td>
        <Form.Control
          type="number"
          disabled
          name="cellphone"
          className={props.cls}
          placeholder={props.driver.cellphone}
          onChange={handleChange}
        />
      </td>
      {props.editable && renderEditButtons()}
      {loading && (
        <td>
          <Spinner animation="border" role="status" size="sm">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </td>
      )}
    </tr>
  );
};

export default EachParticipantForm;
