import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import { AuthContext } from "../../contexts/AuthContext";
import { Button } from "react-bootstrap";
import "./NavBar.scss";

const NavBar = (props) => {
  const history = useHistory();
  const {
    userInfoContext,
    setUserInfoContext,
    setIsLoggedInContext,
  } = useContext(AuthContext);
  const [profile, setProfile] = useState("");

  const logout = () => {
    console.log("Bye bye");
    setAuthorizationToken();
    setIsLoggedInContext(false);
    setUserInfoContext({});
    history.push({
      pathname: "/login",
    });
  };

  useEffect(() => {
    switch (userInfoContext.profile) {
      case 1:
        setProfile("Admin");
        break;
      case 2:
        setProfile("Cliente");
        break;
      case 3:
        setProfile("Operario");
        break;
      default:
        break;
    }
  }, [userInfoContext]);

  return (
    <nav
      className={`navbar navbar-dark bg-${profile.toLowerCase()} sticky-top flex-md-nowrap p-0 shadow`}
    >
      <span
        className="navbar-brand"
        style={{ cursor: "pointer" }}
        onClick={() => history.push("/login")}
      >
        <img
          alt="RideproLogo"
          src="https://www.ridepro.co/wp-content/uploads/2020/03/logo-ride-pro.png"
        />
        <small style={{ fontSize: "12px" }}>{profile}</small>
      </span>

      {/* <input
        className="form-control form-control-dark w-50"
        type="text"
        placeholder="Search"
        aria-label="Search"
      /> */}
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <Button variant="primary" size="sm" onClick={logout}>
            Cerrar Sesion
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
