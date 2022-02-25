import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { FaUpload, FaSave, FaCheckCircle } from 'react-icons/fa';
import { SingleRequestContext } from '../../../../../../contexts';
import { FileIcon } from '../../../../../atoms';
import swal from 'sweetalert';

type SingleDriverProps = any;

const SingleDriver: React.FC<SingleDriverProps> = ({ driver }) => {
  const { requestDriversReports, updateDriverReport, loadingReport } =
    useContext(SingleRequestContext);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requestDriversReports?.length) {
      const foundReport = requestDriversReports.filter((report) => report.driver === driver.id)[0];
      if (foundReport) setReport(foundReport);
    }
  }, [requestDriversReports, driver]);

  const handleChange = (event) => {
    const value = event.target.value === '' ? null : event.target.value === '1' ? true : false;
    setReport({
      ...report,
      quialified: value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    let res = await updateDriverReport(report);
    if (res.id) {
      swal('Perfecto', 'Reporte actualizado correctamente', 'success');
    } else {
      swal(
        'Oops',
        'No pudimos actualizar el reporte, asegurate de subir un archivo valido',
        'error'
      );
    }
    setLoading(false);
  };

  const checkDefault = (data) => {
    switch (data.quialified) {
      case null:
        return '';
      case true:
        return 1;
      case false:
        return 2;
      default:
        return '';
    }
  };

  return loadingReport || !report ? (
    <tr>
      <td colSpan={7}>Cargando...</td>
    </tr>
  ) : (
    <tr>
      <td>{driver.official_id}</td>
      <td>{driver.first_name}</td>
      <td>{driver.last_name}</td>
      <td>{driver.email}</td>
      <td>
        <Form.Control as="select" onChange={handleChange} defaultValue={checkDefault(report)}>
          <option value="">No asistió</option>
          <option value={1}>Cumple</option>
          <option value={2}>No cumple</option>
        </Form.Control>
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder="---"
          value={report?.description || ''}
          onChange={(event) => {
            setReport({
              ...report,
              description: event.target.value
            });
          }}
        />
      </td>
      <td>
        <Form.File
          id={`custom-file-translate-${driver.official_id}`}
          className="custom-file-translate-scss"
          label={
            <span>
              {report?.file?.name ? (
                <React.Fragment>
                  <FaCheckCircle /> {report.file.name}
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
            setReport({
              ...report,
              file: event.target.files[0]
            });
          }}
        />
        {report?.file && <FileIcon loading={loadingReport} file={report.file} size="sm" />}
      </td>
      <td>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <Button variant="link" size="sm" onClick={handleSave}>
            <FaSave />
            Guardar
          </Button>
        )}
      </td>
    </tr>
  );
};

export default SingleDriver;
