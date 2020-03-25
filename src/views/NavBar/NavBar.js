import React from "react";
import { useHistory } from "react-router-dom";

import { GoogleLogout } from "react-google-login";
import { Button } from "react-bootstrap";

const NavBar = () => {
  const history = useHistory();

  const logout = () => {
    console.log("Bye bye");
    history.push({
      pathname: "/login"
    });
  };

  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#123">
        RidePro App
      </a>
      <input
        className="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={renderProps => (
              <Button
                variant="secondary"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                {" "}
                Cerrar Sesion
              </Button>
            )}
            buttonText="Logout"
            onLogoutSuccess={logout}
          ></GoogleLogout>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
