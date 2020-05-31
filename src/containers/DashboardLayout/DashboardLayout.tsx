import React, { useEffect, useContext } from "react";
import NavBar from "../../views/NavBar/NavBar";
import "./DashboardLayout.scss";
import SideBar from "../../views/SideBar/SideBar";
import Usuarios from "../../views/Usuarios/Usuarios";
import RequestsHistory from "../../views/RequestsHistory/RequestsHistory";
import Dashboard from "../../views/Dashboard/Dashboard";
import {
  Route,
  Switch,
  Redirect,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import SolicitarServicio from "../../views/SolicitarServicio/SolicitarServicio";
import Tracks from "../../views/Tracks/Tracks";
import { Spinner } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import RequestContextProvider from "../../contexts/RequestContext";

const DashboardLayout: React.FC = () => {
  const { isLoggedInContext } = useContext(AuthContext);
  const history = useHistory();
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (!isLoggedInContext) {
      history.push("/login");
    }
    // eslint-disable-next-line
  }, []);

  if (isLoggedInContext) {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideBar url={url} />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"
            >
              <Switch>
                <Route path={`${path}/dashboard`}>
                  <Dashboard />
                </Route>
                <Route path={`${path}/usuarios`}>
                  <Usuarios />
                </Route>
                <Route path={`${path}/historial`}>
                  <RequestContextProvider>
                    <RequestsHistory />
                  </RequestContextProvider>
                </Route>
                <Route path={`${path}/solicitar`}>
                  <SolicitarServicio />
                </Route>
                <Route path={`${path}/pistas`}>
                  <Tracks />
                </Route>
                <Redirect from="/administrador" to="/administrador/dashboard" />
                <Redirect from="/cliente" to="/cliente/solicitar" />
                <Redirect from="/operario" to="/operario/dashboard" />
              </Switch>
            </main>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }
};

export default DashboardLayout;
