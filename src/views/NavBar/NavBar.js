import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import setUserInfoLocal from "../../controllers/setUserInfoLocal";
// import { GoogleLogout } from "react-google-login";
import { Button } from "react-bootstrap";

const NavBar = props => {
  const history = useHistory();
  const [profile, setProfile] = useState("");

  const logout = () => {
    console.log("Bye bye");
    setAuthorizationToken();
    setUserInfoLocal();
    history.push({
      pathname: "/login"
    });
  };

  useEffect(() => {
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
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#123">
        RideProApp | <small style={{ fontSize: "12px" }}>{profile}</small>
      </a>
      <input
        className="form-control form-control-dark w-50"
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          {/* <GoogleLogout
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
          ></GoogleLogout> */}
          <Button variant="secondary" onClick={logout}>
            Cerrar Sesion
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
