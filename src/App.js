import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./containers/Login/Login";
import Home from "./containers/Home/Home";
import DashboardLayout from "./containers/DashboardLayout/DashboardLayout";
import AuthContextProvider from "./contexts/AuthContext";

function App() {
  // ========================================================================

  return (
    <AuthContextProvider>
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
          <Route path="/login">
            <Login />
          </Route>
          {/* <Route path="/login/:id/:token" render={<DashboardLayout />} /> */}
        </Switch>
        {/* <Redirect from="/" to="/" /> */}
      </Router>
    </AuthContextProvider>
  );
}

export default App;
