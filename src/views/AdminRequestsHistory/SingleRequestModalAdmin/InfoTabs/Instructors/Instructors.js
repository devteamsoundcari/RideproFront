import React, { useEffect, useState } from "react";
import { getInstructors } from "../../../../../controllers/apiRequests";
import SearchByDocument from "../../../../../utils/SearchByDocument/SearchByDocument";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  // ================================ FETCH INSTRUCTORS ON LOAD =====================================================
  const fetchInstructors = async (url) => {
    let tempArr = [];
    const response = await getInstructors(url);
    response.results.forEach(async (item) => {
      tempArr.push(item);
    });
    setInstructors(tempArr);
    if (response.next) {
      return await getInstructors(response.next);
    }
  };
  useEffect(() => {
    fetchInstructors(`${process.env.REACT_APP_API_URL}/api/v1/instructors/`);
  }, []);

  const handleSelected = (item) => {
    setSelectedInstructors((oldArr) => [...oldArr, item]);
  };

  return (
    <div>
      <SearchByDocument
        participants={instructors}
        returnedItem={handleSelected}
        title="Buscar por documento"
        placeholder="Buscar por Identificación"
      />
      <ul className="list-unstyled">
        {selectedInstructors.map((item, idx) => {
          return <li key={idx}>{item.first_name}</li>;
        })}
      </ul>
    </div>
  );
};

export default Instructors;
