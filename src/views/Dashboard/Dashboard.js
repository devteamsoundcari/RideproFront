import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";

const Dashboard = props => {
  // const location = useLocation();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");

  useEffect(() => {
    setName(props.name);
    switch (props.profile) {
      case 1:
        setProfile("Administrador");
        break;
      case 2:
        setProfile("Cliente");
        break;
      default:
        break;
    }
  }, [props]);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
        <span>
          Bienvenid@ {name} {profile}
        </span>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button className="btn btn-sm btn-outline-secondary">Share</button>
            <button className="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar"></span>
            This week
          </button>
        </div>
      </div>
      <h3>Eventos Solicitados</h3>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Servicio #</th>
              <th>Fecha de Solicitud</th>
              <th>Producto</th>
              <th>Ciudad</th>
              <th>Fecha de Ejecucion</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ninguno</td>
              <td>Ninguno</td>
              <td>Ninguno</td>
              <td>Ninguno</td>
              <td>Ninguno</td>
              <td>Ninguno</td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
