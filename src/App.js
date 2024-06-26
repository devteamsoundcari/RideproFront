import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import DashboardLayout from './containers/DashboardLayout/DashboardLayout.tsx';
import AuthContextProvider from './contexts/AuthContext';
import ServiceContextProvider from './contexts/ServiceContext';
import ParticipantsContextProvider from './contexts/ParticipantsContext';
import RequestsContextProvider from './contexts/RequestsContext';
import NewPassword from './views/NewPassword/NewPassword';
import ReportsContextProvider from './contexts/ReportsContext';
import TracksContextProvider from './contexts/TracksContext';

function App() {
  // ========================================================================

  return (
    <AuthContextProvider>
      <ServiceContextProvider>
        <RequestsContextProvider>
          <ParticipantsContextProvider>
            <ReportsContextProvider>
              <TracksContextProvider>
                <HashRouter>
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
                    <Route path="/tecnico">
                      <DashboardLayout />
                    </Route>
                    <Route path="/super-cliente">
                      <DashboardLayout />
                    </Route>
                    <Route path="/login">
                      <Login />
                    </Route>
                    <Route path="/password-reset">
                      <NewPassword />
                    </Route>
                  </Switch>
                </HashRouter>
              </TracksContextProvider>
            </ReportsContextProvider>
          </ParticipantsContextProvider>
        </RequestsContextProvider>
      </ServiceContextProvider>
    </AuthContextProvider>
  );
}

export default App;
