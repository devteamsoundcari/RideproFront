import React, { useEffect, useState, useContext } from 'react';
import { getUserReport } from '../../../../controllers/apiRequests';
import { FaExternalLinkAlt, FaFilePdf } from 'react-icons/fa';
import { ReportsContext } from '../../../../contexts/ReportsContext';
type SingleDriverProps = any;

const SingleDriver: React.FC<SingleDriverProps> = ({
  data,
  requestId,
  onUpdate
}) => {
  const [report, setReport] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { reportsInfoContext, setReportsInfoContext } =
    useContext(ReportsContext);
  const fetchReport = async (url) => {
    setLoading(true);
    const response = await getUserReport(url);
    setReport(response.results[0]);
    setLoading(false);
  };

  const callReport = async () => {
    setReportsInfoContext([]);
    await fetchReport(
      `${process.env.REACT_APP_API_URL}/api/v1/request_drivers/?request=${requestId}&driver=${data.id}`
    );
  };

  useEffect(() => {
    callReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, data, setReportsInfoContext]);

  useEffect(() => {
    if (!loading && report && report.file) {
      setReportsInfoContext([...reportsInfoContext, report]);
    }
    // eslint-disable-next-line
  }, [report, loading]);

  return (
    <tr>
      <td>{data?.official_id}</td>
      <td>{data?.first_name}</td>
      <td>{data?.last_name}</td>
      <td className="text-primary font-weight-bold">{data?.email}</td>
      <td>{data?.cellphone}</td>
      {!loading && report && report.file && (
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
