import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./containers/Login/Login";
import Home from "./containers/Home/Home";
import DashboardLayout from "./containers/DashboardLayout/DashboardLayout.tsx";
import AuthContextProvider from "./contexts/AuthContext";
import ServiceContextProvider from "./contexts/ServiceContext";
import ParticipantsContextProvider from "./contexts/ParticipantsContext";
import RequestsContextProvider from "./contexts/RequestsContext";

function App() {
  // ========================================================================

  return (
    <AuthContextProvider>
      <ServiceContextProvider>
        <RequestsContextProvider>
          <ParticipantsContextProvider>
            <Router>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/administrador">
                  <DashboardLayout />
                </Route>
                <Route path="/cliente">
                  <DashboardLayout />
                </Route>
                <Route path="/operario">
                  <DashboardLayout />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                {/* <Route path="/login/:id/:token" render={<DashboardLayout />} /> */}
              </Switch>
              {/* <Redirect from="/" to="/" /> */}
            </Router>
          </ParticipantsContextProvider>
        </RequestsContextProvider>
      </ServiceContextProvider>
    </AuthContextProvider>
  );
}

export default App;
