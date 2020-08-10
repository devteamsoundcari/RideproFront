import React, { useEffect, useState } from "react";
import { getUserReport } from "../../../../controllers/apiRequests";
import { FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";

type SingleDriverProps = any;

const SingleDriver: React.FC<SingleDriverProps> = ({
  data,
  requestId,
  status,
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

  return (
    <tr>
      <td>{data?.official_id}</td>
      <td>{data?.first_name}</td>
      <td>{data?.last_name}</td>
      <td className="text-primary font-weight-bold">{data?.email}</td>
      <td>{data?.cellphone}</td>
      {status > 5 && (
        <React.Fragment>
          <td>
            {report.quialified === "" || report.quialified === null
              ? "No asistio"
              : report.quialified
              ? "Aprobado"
              : "No aprobado"}
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
        </React.Fragment>
      )}
    </tr>
  );
};
export default SingleDriver;