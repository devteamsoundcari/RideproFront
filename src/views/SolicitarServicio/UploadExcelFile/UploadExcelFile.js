import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import XLSX from "xlsx";
import "./UploadExcelFile.scss";

const UploadExcelFile = (props) => {
  const [fileName, setFileName] = useState("Cargar archivo Excel");
  const [fileUploaded, setFileUploaded] = useState("");
  const [participants, setParticipants] = useState([]);

  const handleUpload = (e) => {
    e.preventDefault();
    let fname = e.target.value.split(String.fromCharCode(92));
    setFileName(fname[fname.length - 1]);
    const files = e.target.files,
      f = files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];
      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setFileUploaded(dataParse);
    };
    reader.readAsBinaryString(f);
  };

  useEffect(() => {
    // console.log("DATA", fileUploaded);
    for (let index = 1; index < fileUploaded.length; index++) {
      let newPerson = {};
      const item = fileUploaded[index];
      newPerson.official_id = item[0]
        ? item[0].toString().replace(/\s/g, "")
        : "";
      newPerson.first_name = item[1]
        ? item[1].toString().replace(/\s/g, "")
        : "";
      newPerson.last_name = item[2]
        ? item[2].toString().replace(/\s/g, "")
        : "";
      newPerson.email = item[3] ? item[3].toString().replace(/\s/g, "") : "";
      newPerson.cellphone = item[4]
        ? item[4].toString().replace(/\s/g, "")
        : "";
      for (var key in newPerson) {
        if (newPerson[key] === "") {
          delete newPerson[key];
        }
      }
      if (Object.keys(newPerson).length === 5) {
        setParticipants((oldArr) => [...oldArr, newPerson]);
      }
    }
  }, [fileUploaded]);

  useEffect(() => {
    props.addItem(participants);
  }, [participants, props]);

  return (
    <Form className="form-excel-file">
      <Form.File
        id="custom-file"
        label={fileName}
        custom
        onChange={handleUpload}
      />
    </Form>
  );
};

export default UploadExcelFile;
