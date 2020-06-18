import React, { useEffect, useState } from "react";
import { getProviders } from "../../controllers/apiRequests";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Providers = () => {
  const [providers, setProviders] = useState([]);

  // ================================ FETCH INSTRUCTORS ON LOAD =====================================================
  const fetchProviders = async (url) => {
    let tempArr = [];
    const response = await getProviders(url);
    response.results.forEach(async (item) => {
      tempArr.push(item);
    });
    setProviders(tempArr);
    if (response.next) {
      return await getProviders(response.next);
    }
  };
  useEffect(() => {
    fetchProviders(`${process.env.REACT_APP_API_URL}/api/v1/providers/`);
  }, []);

  const expandRow = {
    renderer: (row) => (
      <div>
        <ul className="list-unstyled">
          <li>Teléfono: {row.cellphone}</li>
          <li>Email: {row.email}</li>
          <li>Nit: {row.official_id}</li>
          <li>
            Documentos: <a href={row.documents}>{row.documents}</a>
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
      dataField: "name",
      text: "Nombre",
      filter: textFilter(),
    },
    {
      dataField: "services",
      text: "Servicio",
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
        data={providers}
        columns={columns}
        expandRow={expandRow}
        filter={filterFactory()}
      />
    </div>
  );
};

export default Providers;
