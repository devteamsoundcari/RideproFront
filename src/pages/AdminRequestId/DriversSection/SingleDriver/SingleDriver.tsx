import React, { useEffect, useState, useContext } from 'react';
import { FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';
import { SingleRequestContext } from '../../../../contexts';
type SingleDriverProps = any;

const SingleDriver: React.FC<SingleDriverProps> = ({ data, requestId }) => {
  const { getDriverReport, loadingReport, setRequestDriversReports, requestDriversReports } =
    useContext(SingleRequestContext);
  const [report, setReport] = useState<any>({});

  const fetchReport = async () => {
    try {
      const driversReport = await getDriverReport(requestId, data.id);
      setRequestDriversReports([...requestDriversReports, driversReport]);
      setReport(driversReport);
    } catch (error) {
      throw new Error('Error getting the report');
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, data]);

  return (
    <tr>
      <td>{data?.official_id}</td>
      <td className="text-capitalize">{data?.first_name}</td>
      <td className="text-capitalize">{data?.last_name}</td>
      <td className="text-primary font-weight-bold">{data?.email}</td>
      <td>{data?.cellphone}</td>
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
