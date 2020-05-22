import React, { useState } from "react";
import { Form, Spinner, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import { updateRequest } from "../../../../../controllers/apiRequests";
import es from "date-fns/locale/es";
registerLocale("es", es);

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const InfoForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [requestInfo, setRequestInfo] = useState({});
  const { control } = useForm();
  const [date, setDate] = useState({
    date: "",
    placeholder: "",
    disabled: true,
  });
  const [time, setTimeOfDate] = useState({
    time: "",
    placeholder: "",
    disabled: true,
  });

  // =================================  HANDLE CHANGE DATA AND TIME ==================================
  const dateHandler = (data) => {
    let today = new Date();
    today.setDate(today.getDate() + 2); // 48 hours before
    if (today < data[0]) {
      // If the users request an invalid date
      setDate({
        date: data[0],
      });
      setRequestInfo((prevState) => ({ ...prevState, start_time: data[0] }));
    } else {
      alert(
        "Fecha invalida, recuerde solicitar el servicio con 48 horas de anticipacion"
      );
    }
  };

  const timeHandler = (data) => {
    setTimeOfDate({
      time: data[0],
    });
    let hours = data[0].getHours();
    let min = data[0].getMinutes();
    date.date.setHours(hours); // Setting date to the new time
    date.date.setMinutes(min); // Setting date to the new time
    setRequestInfo((prevState) => ({ ...prevState, start_time: date.date }));
  };

  // ================================ CLICK ON EDIT DISABLED FALSE =================================

  const handleClick = () => {
    setShowSaveBtn(true);
    [...document.getElementsByClassName(props.cls)].forEach(
      (element, index, array) => {
        element.disabled = false;
      }
    );
    setDate({
      ...date,
      disabled: false,
      date: new Date(props.request.start_time),
    });
    setTimeOfDate({
      ...time,
      disabled: false,
      time: new Date(props.request.start_time),
    });
  };

  // ================================= HANDLE CHANGE ON INPUT FIELDS ================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // ================================ SUBMIT UPDATE SERVICE INFO =================================

  const handleSubmit = async () => {
    const isNewDate =
      date.date.toLocaleDateString() !==
      new Date(props.request.start_time).toLocaleDateString();
    const isNewTime =
      time.time.toLocaleTimeString() !==
      new Date(props.request.start_time).toLocaleTimeString();

    setShowSaveBtn(false);
    setLoading(true);
    // date.date.setTime(time.time.getTime());
    // setRequestInfo((prevState) => ({ ...prevState, start_time: date.date }));
    // ================ IF NO CHANGES IN DATE OR TIME ===================
    if (isNewDate && isNewTime && isEmpty(requestInfo)) {
      [...document.getElementsByClassName(props.cls)].forEach(
        (element, index, array) => {
          element.disabled = true;
        }
      );
      setDate({ ...date, disabled: true });
      setTimeOfDate({ ...time, disabled: true });
      setLoading(false);
    } else {
      // UPDATE REQUEST IN API
      let res = await updateRequest(requestInfo, props.request.id);
      if (res.status === 200) {
        setLoading(false);
        [...document.getElementsByClassName(props.cls)].forEach(
          (element, index, array) => {
            element.disabled = true;
          }
        );
        setDate({
          ...date,
          disabled: true,
        });
        setTimeOfDate({
          ...time,
          disabled: true,
        });
      } else {
        console.log("Eror modificando driver", res);
      }
    }
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
  return (
    <tr>
      <td>
        <Form.Control
          disabled
          type="text"
          name="municipality"
          placeholder={props.request.municipality.name}
          //   onChange={handleChange}
        />
      </td>
      <td>
        <Form.Control
          disabled
          type="text"
          name="department"
          placeholder={props.request.municipality.department.name}
          //   onChange={handleChange}
        />
      </td>
      <td>
        <Form.Control
          disabled
          type="text"
          name="place"
          className={props.cls}
          placeholder={props.request.place}
          onChange={handleChange}
        />
      </td>
      <td>
        {!showSaveBtn && (
          <Form.Control
            disabled
            type="text"
            name="start_date"
            className={props.cls}
            placeholder={
              date.date ? date.date.toLocaleDateString() : props.startDate
            }
            //   onChange={handleChange}
          />
        )}
        {showSaveBtn && (
          <Controller
            as={DatePicker}
            selected={date.date}
            onChange={dateHandler}
            locale="es"
            disabled={date.disabled}
            control={control}
            dateFormat="MMMM d, yyyy"
            //   placeholderText={date.placeholder}
            name="start_date"
          />
        )}
      </td>
      <td>
        {!showSaveBtn && (
          <Form.Control
            disabled
            type="text"
            name="start_time"
            className={props.cls}
            placeholder={
              time.time ? time.time.toLocaleTimeString() : props.time
            }
            //   onChange={handleChange}
          />
        )}
        {showSaveBtn && (
          <Controller
            as={DatePicker}
            selected={time.time}
            locale="es"
            control={control}
            onChange={timeHandler}
            disabled={time.disabled}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Hora"
            dateFormat="h:mm aa"
            name="start_time"
            placeholderText={time.placeholder}
          />
        )}
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

export default InfoForm;
