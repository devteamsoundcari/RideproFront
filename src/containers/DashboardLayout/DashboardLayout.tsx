import React, { useEffect, useContext } from "react";
import NavBar from "../../views/NavBar/NavBar";
import "./DashboardLayout.scss";
import SideBar from "../../views/SideBar/SideBar";
import Usuarios from "../../views/AdminTabs/Usuarios/Usuarios";
import Companies from "../../views/AdminTabs/Companies/Companies";
import AdminRequestsHistory from "../../views/AdminRequestsHistory/AdminRequestsHistory";
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
import { Spinner, Container } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import ClientRequestsHistory from "../../views/ClientRequestsHistory/ClientRequestsHistory";
import Instructors from "../../views/Instructors/Instructors";
import Providers from "../../views/Providers/Providers";
import { RequestToastContainer } from "../../views/Notifications/RequestToast";
import Sucursales from "../../views/Sucursales/Sucursales";
import SuperClients from "../../views/AdminTabs/SuperClients/SuperClients";
import RequiredDocuments from "../../views/AdminTabs/RequiredDocuments/RequiredDocuments";
import AdminCredits from "../../views/AdminTabs/AdminCredits/AdminCredits";

const DashboardLayout: React.FC = () => {
  const { isLoggedInContext, userInfoContext } = useContext(AuthContext);
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
      <div className="container-fluid" style={{ height: "100%" }}>
        <div className="row">
          <SideBar url={url} />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-0">
            <NavBar />
            <Container fluid className="mt-2">
              <RequestToastContainer />
              <Switch>
                <Route path={`${path}/dashboard`}>
                  <Dashboard />
                </Route>
                <Route path={`${path}/usuarios`}>
                  <Usuarios />
                </Route>
                <Route path={`${path}/empresas`}>
                  <Companies />
                </Route>
                <Route path={`${path}/historial`}>
                  {userInfoContext.profile === 2 ||
                  userInfoContext.profile === 7 ? (
                    <ClientRequestsHistory />
                  ) : (
                    <AdminRequestsHistory />
                  )}
                </Route>
                <Route path={`${path}/solicitar`}>
                  <SolicitarServicio />
                </Route>
                <Route path={`${path}/pistas`}>
                  <Tracks />
                </Route>
                <Route path={`${path}/instructores`}>
                  <Instructors />
                </Route>
                <Route path={`${path}/proveedores`}>
                  <Providers />
                </Route>
                <Route path={`${path}/superclientes`}>
                  <SuperClients />
                </Route>
                <Route path={`${path}/documentos`}>
                  <RequiredDocuments />
                </Route>
                <Route path={`${path}/creditos`}>
                  <AdminCredits />
                </Route>
                <Route path={`${path}/sucursales`}>
                  <Sucursales />
                </Route>
                <Redirect from="/administrador" to="/administrador/dashboard" />
                <Redirect from="/cliente" to="/cliente/dashboard" />
                <Redirect from="/operario" to="/operario/dashboard" />
                <Redirect from="/tecnico" to="/tecnico/dashboard" />
                <Redirect from="/super-cliente" to="/super-cliente/dashboard" />
              </Switch>
            </Container>
          </main>
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
