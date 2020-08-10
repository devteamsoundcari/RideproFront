import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaUpload, FaSave, FaCheckCircle } from "react-icons/fa";
import {
  getUserReport,
  updateParticipantReport,
} from "../../../../controllers/apiRequests";
import swal from "sweetalert";

type SingleParticipantProps = any;

const SingleParticipant: React.FC<SingleParticipantProps> = ({
  data,
  requestId,
}) => {
  const [report, setReport] = useState<any>({});

  const fetchReport = async (url) => {
    const response = await getUserReport(url);
    setReport(response.results[0]);
  };
  useEffect(() => {
    fetchReport(
      `${process.env.REACT_APP_API_URL}/api/v1/request_drivers/?request=${requestId}&driver=${data.id}`
    );
  }, [requestId, data]);

  const handleChange = (event) => {
    setReport({ ...report, quialified: event.target.value });
  };

  const handleSave = async () => {
    let res = await updateParticipantReport(report);
    if (res) {
      swal("Perfecto", "Reporte actualizado correctamente", "success");
    } else {
      swal("Oops", "No pudimos actualizar el reporte", "error");
    }
  };

  return (
    <tr>
      <td>{data.official_id}</td>
      <td>{data.first_name}</td>
      <td>{data.last_name}</td>
      <td>{data.email}</td>
      <td>
        <Form.Control as="select" onChange={handleChange}>
          <option
            value=""
            selected={
              report.quialified === null || report.quialified === ""
                ? true
                : false
            }
          >
            No asistió
          </option>
          <option value={1} selected={report.quialified ? true : false}>
            Aprobó
          </option>
          <option value={0} selected={!report.quialified ? true : false}>
            No aprobó
          </option>
        </Form.Control>
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder="---"
          value={report.description}
          onChange={(event) => {
            // setAllFiles([...allFiles, { id: row.id, file: e.target.files[0] }]);
            setReport({
              ...report,
              description: event.target.value,
            });
          }}
        />
      </td>
      <td>
        <Form.File
          id="custom-file-translate-scss"
          label={
            <span>
              {report.file ? (
                <React.Fragment>
                  <FaCheckCircle /> Ok
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FaUpload /> Subir archivo
                </React.Fragment>
              )}
            </span>
          }
          lang="es"
          onChange={(event) => {
            // setAllFiles([...allFiles, { id: row.id, file: e.target.files[0] }]);
            setReport({
              ...report,
              file: event.target.files[0],
            });
          }}
        />
      </td>
      <td>
        <Button variant="link" size="sm" onClick={handleSave}>
          <FaSave />
          Guardar
        </Button>
      </td>
    </tr>
  );
};
export default SingleParticipant;
