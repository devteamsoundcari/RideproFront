import React, { useEffect, useState, useContext } from 'react';
import { FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';
import { SingleRequestContext } from '../../../../../contexts';
type SingleDriverProps = any;

const SingleDriver: React.FC<SingleDriverProps> = ({ driver, requestId }) => {
  const { getDriverReport, loadingReport, requestDriversReports } =
    useContext(SingleRequestContext);
  const [report, setReport] = useState<any>({});

  useEffect(() => {
    if (requestDriversReports?.length) {
      const foundReport = requestDriversReports.filter((report) => report.driver === driver.id)[0];
      if (foundReport) setReport(foundReport);
    }
  }, [requestDriversReports, driver]);

  const fetchReport = async () => {
    try {
      await getDriverReport(requestId, driver.id);
    } catch (error) {
      throw new Error('Error getting the report');
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, driver]);

  return loadingReport ? (
    <tr>
      <td colSpan={8}>Cargando...</td>
    </tr>
  ) : (
    <tr>
      <td>{driver?.official_id}</td>
      <td className="text-capitalize">{driver?.first_name}</td>
      <td className="text-capitalize">{driver?.last_name}</td>
      <td className="text-primary font-weight-bold">{driver?.email}</td>
      <td>{driver?.cellphone}</td>
      {!loadingReport && report && report.file && (
        <>
          <td>
            {report.quialified === '' || report.quialified === null
              ? 'No asistio'
              : report.quialified
              ? 'Cumple'
              : 'No cumple'}
          </td>
          <td>
            <a href={report.description} target="n_blank">
              <FaExternalLinkAlt />
            </a>
          </td>
          <td>
            <a href={report.file} target="n_blank">
              <FaFilePdf />
            </a>
          </td>
        </>
      )}
    </tr>
  );
};
export default SingleDriver;
