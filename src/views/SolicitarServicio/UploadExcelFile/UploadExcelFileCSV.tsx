import React, { useState, useEffect } from "react";
import CSVReader from "react-csv-reader";

interface Props {
  addItem: (data: any) => void;
}

// interface ParticipantsNode {
//   official_id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   cellphone: number;
// }

// ===================================================================================

const UploadExcelFile: React.FC<Props> = ({ addItem }) => {
  const [incompleteParticipants, setIncompleteParticipants] = useState<any[]>(
    []
  );

  // ===================================================================================

  const isInfoOk = (participant) => {
    if (isNaN(participant.official_id)) {
      setIncompleteParticipants((prevArr) => [...prevArr, participant]);
      return false;
    } else if (typeof participant.first_name !== "string") {
      setIncompleteParticipants((prevArr) => [...prevArr, participant]);
      return false;
    } else if (typeof participant.last_name !== "string") {
      setIncompleteParticipants((prevArr) => [...prevArr, participant]);
      return false;
    } else if (typeof participant.email !== "string") {
      setIncompleteParticipants((prevArr) => [...prevArr, participant]);
      return false;
    } else if (
      isNaN(participant.cellphone) ||
      participant.cellphone.length > 10
    ) {
      setIncompleteParticipants((prevArr) => [...prevArr, participant]);
      return false;
    } else {
      return true;
    }
  };
  // ===================================================================================

  const hasMissingProperties = (obj) => {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === "") {
        return true;
      }
    }
    return false;
  };

  // ==================================================================================

  const checkParticipant = (participant) => {
    if (hasMissingProperties(participant)) {
      setIncompleteParticipants((prevArr) => [...prevArr, participant]);
    } else {
      isInfoOk(participant) ? addItem(participant) : console.error("error");
    }
  };

  // ===================================================================================

  const handleFile = (data, info) => {
    let keys = ["official_id", "first_name", "last_name", "email", "cellphone"];
    data
      .map((x) => x.map((y, i) => ({ [keys[i]]: y })))
      .map((z) => (z = { ...z[0], ...z[1], ...z[2], ...z[3], ...z[4] }))
      .map((y) => checkParticipant(y));
  };

  // ===================================================================================

  useEffect(() => {
    setTimeout(() => {
      setIncompleteParticipants([]);
    }, 8000);
  }, [incompleteParticipants]);

  return (
    <React.Fragment>
      <CSVReader
        cssClass="react-csv-input"
        label="Cargar desde archivo CSV "
        onFileLoaded={(data, fileInfo) => handleFile(data, fileInfo)}
      />
      {incompleteParticipants.length > 0 && (
        <strong style={{ color: "red" }}>
          Se omitieron {incompleteParticipants.length} participantes porque la
          infomacion no esta completa o es erronea
        </strong>
      )}
    </React.Fragment>
  );
};

export default UploadExcelFile;
