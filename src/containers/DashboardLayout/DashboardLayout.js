import React, { useEffect, useState } from "react";
import NavBar from "../../views/NavBar/NavBar";
import "./DashboardLayout.scss";
import SideBar from "../../views/SideBar/SideBar";
import Dashboard from "../../views/Dashboard/Dashboard";
import {
  Route,
  useLocation,
  Switch,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import Solicitar from "../../views/Solicitar/Solicitar";

const DashboardLayout = () => {
  const location = useLocation();
  let { path, url } = useRouteMatch();
  const [userInfo, setUserInfo] = useState({
    isSignedIn: false,
    userName: "",
    email: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (location.state) {
      setUserInfo(location.state.userInfo);
    }
  }, [location]);

  if (userInfo.isSignedIn) {
    return (
      <div>
        <NavBar userInfo={userInfo} />
        <div className="container-fluid">
          <div className="row">
            <SideBar url={url} />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"
            >
              <Switch>
                <Route path={`${path}/dashboard`}>
                  <Dashboard userInfo={userInfo} />
                </Route>
                <Route path={`${path}/solicitar`}>
                  <Solicitar userInfo={userInfo} />
                </Route>
                <Redirect from="/cliente" to="/cliente/solicitar" />
              </Switch>
            </main>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default DashboardLayout;
