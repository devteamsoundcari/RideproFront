import React, { useEffect, useState } from "react";
import { getInstructors } from "../../controllers/apiRequests";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);

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

  const expandRow = {
    renderer: (row) => (
      <div>
        <ul className="list-unstyled">
          <li>Teléfono: {row.cellphone}</li>
          <li>Email: {row.email}</li>
          <li>
            Documentos: <a href={row.documents}>{row.documents}</a>
          </li>
          <li>
            Foto: <img alt="Foto instructor" src={row.picture} />
          </li>
        </ul>
      </div>
    ),
    showExpandColumn: true,
    onlyOneExpanding: true,
  };

  // ======================================= COLUMNS =============================================================
  const columns = [
    {
      dataField: "official_id",
      text: "Identificación",
      filter: textFilter(),
    },
    {
      dataField: "first_name",
      text: "Nombre",
    },
    {
      dataField: "last_name",
      text: "Apellido",
    },
    {
      dataField: "municipality",
      text: "Ciudad",
    },
  ];

  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={instructors}
        columns={columns}
        expandRow={expandRow}
        filter={filterFactory()}
      />
    </div>
  );
};

export default Instructors;
