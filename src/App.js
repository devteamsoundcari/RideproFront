import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./containers/Login/Login";
import Home from "./containers/Home/Home";
import DashboardLayout from "./containers/DashboardLayout/DashboardLayout";

function App() {
  // ========================================================================

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/cliente">
          <DashboardLayout />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
      <Redirect from="/" to="/login" />
    </Router>
  );
}

export default App;
